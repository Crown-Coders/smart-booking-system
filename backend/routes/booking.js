// routes/booking.js
const express = require("express");
const router = express.Router();
const { Booking, AvailabilitySlot, Payment, User, sequelize,} = require("../models");
const { generateSignature } = require("../utils/payfast");
const sendEmail = require("../utils/sendEmail");

/** -------------------- HELPER FUNCTION -------------------- */
const calculatePrice = (startTime, endTime) => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const hours = (end - start) / (1000 * 60 * 60);
  return hours * 800; // R800 per hour
};

/** -------------------- CREATE BOOKING & RESERVE SLOTS -------------------- */
router.post("/", async (req, res) => {
  const t = await sequelize.transaction(); // transaction start

  try {
    const {
      userId,
      therapistId,
      bookingDate,
      startTime,
      endTime,
      description,
    } = req.body;

    if (!userId || !therapistId || !startTime || !endTime) {
      await t.rollback();
      return res.status(400).json({ error: "Missing required booking fields" });
    }

    const price = calculatePrice(startTime, endTime);

    // Check if slot already reserved or booked
    const existingSlot = await AvailabilitySlot.findOne({
      where: {
        therapistId,
        date: bookingDate,
        startTime,
      },
      transaction: t,
    });

    if (existingSlot) {
      await t.rollback();
      return res.status(400).json({
        error: "This slot is already booked",
      });
    }

    /** -------------------- CREATE BOOKING -------------------- */
    const booking = await Booking.create(
      {
        clientId: userId,
        therapistId,
        bookingDate,
        startTime,
        endTime,
        notes: description,
        status: "PENDING",
      },
      { transaction: t },
    );

    /** -------------------- RESERVE TIME SLOTS -------------------- */
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    let current = new Date(start);

    const slotsToCreate = [];

    while (current < end) {
      const slotStart = current.toTimeString().slice(0, 5);

      current.setMinutes(current.getMinutes() + 30);

      const slotEnd = current.toTimeString().slice(0, 5);

      slotsToCreate.push({
        therapistId,
        date: bookingDate,
        startTime: slotStart,
        endTime: slotEnd,
        isBooked: false, // reserved but not confirmed
        bookingId: booking.id,
      });
    }

    await AvailabilitySlot.bulkCreate(slotsToCreate, { transaction: t });

    /** -------------------- CREATE PAYMENT RECORD -------------------- */
    await Payment.create(
      {
        bookingId: booking.id,
        amount: price,
        currency: "ZAR",
        status: "PENDING",
        transactionReference: `BOOK-${booking.id}`,
        paymentMethod: "CARD",
      },
      { transaction: t },
    );

    await t.commit(); // commit transaction

    res.status(201).json({ booking, amount: price });
  } catch (error) {
    await t.rollback(); // rollback if anything fails

    console.error(error);

    res.status(500).json({ error: "Booking failed" });
  }
});
/** -------------------- DELETE BOOKING (CANCEL) - Simplified -------------------- */
router.delete("/:id", async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const bookingId = req.params.id;

    // Find the booking
    const booking = await Booking.findByPk(bookingId, { transaction: t });

    if (!booking) {
      await t.rollback();
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if booking can be cancelled
    if (booking.status === "COMPLETED") {
      await t.rollback();
      return res
        .status(400)
        .json({ error: "Cannot cancel a completed booking" });
    }

    console.log("Cancelling booking:", booking.id);

    // Get all availability slots for this therapist on this date
    const allSlots = await AvailabilitySlot.findAll({
      where: {
        therapistId: booking.therapistId,
        date: booking.bookingDate,
      },
      transaction: t,
    });

    console.log(`Found ${allSlots.length} slots for therapist on this date`);

    // Filter slots that fall within the booking time range
    const slotsToDelete = allSlots.filter((slot) => {
      return (
        slot.startTime >= booking.startTime && slot.endTime <= booking.endTime
      );
    });

    console.log(
      `Found ${slotsToDelete.length} slots to delete within time range`,
    );

    // Delete each slot individually
    for (const slot of slotsToDelete) {
      await slot.destroy({ transaction: t });
      console.log(`Deleted slot: ${slot.startTime} - ${slot.endTime}`);
    }

    // Delete payment if it exists
    try {
      const payments = await Payment.findAll({
        where: { bookingId: booking.id },
        transaction: t,
      });

      for (const payment of payments) {
        await payment.destroy({ transaction: t });
      }
    } catch (err) {
      console.log("Payment deletion skipped:", err.message);
    }

    // Delete the booking
    await booking.destroy({ transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error cancelling booking:", error);
    res.status(500).json({
      success: false,
      error: "Failed to cancel booking: " + error.message,
    });
  }
});

/** -------------------- GET AVAILABLE SLOTS -------------------- */
router.get("/available/:therapistId", async (req, res) => {
  try {
    const { therapistId } = req.params;
    const { date } = req.query;

    const whereClause = { therapistId };

    if (date) whereClause.date = date;

    const bookedSlots = await AvailabilitySlot.findAll({
      where: { ...whereClause, isBooked: true },
      order: [["startTime", "ASC"]],
    });

    res.json({ bookedSlots });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Failed to fetch available slots" });
  }
});

/** -------------------- GET USER BOOKINGS -------------------- */
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { clientId: req.params.userId },
      order: [["createdAt", "DESC"]],
    });

    res.json(bookings);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

/** -------------------- PAYMENT SUCCESS - MARK SLOTS BOOKED -------------------- */
router.post("/payment-success/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    booking.status = "CONFIRMED";

    await booking.save();

    // Mark slots as booked
    await AvailabilitySlot.update(
      { isBooked: true },
      { where: { bookingId: booking.id } },
    );

    res.json({ message: "Booking confirmed and slots marked as booked" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Payment confirmation failed" });
  }
});

/** -------------------- PAYFAST REDIRECT -------------------- */
router.post("/payfast/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const user = await User.findByPk(booking.clientId);

    if (!user) return res.status(404).json({ error: "User not found" });

    const price = calculatePrice(booking.startTime, booking.endTime);

    const nameParts = user.name.split(" ");

    const firstName = nameParts[0];

    const lastName = nameParts.slice(1).join(" ") || "User";

    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    const paymentId = `${booking.id}-${today}`;

    const data = {
      merchant_id: "10036644",
      merchant_key: "t4gr984tybhfx",
      return_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      notify_url: `${process.env.BACKEND_URL}/api/bookings/payfast-ipn`,
      name_first: firstName,
      name_last: lastName,
      email_address: user.email,
      m_payment_id: paymentId,
      amount: price.toFixed(2),
      item_name: `Therapy Booking #${booking.id}`,
    };

    data.signature = generateSignature(data, "payfastintergration");

    const query = new URLSearchParams(data).toString();

    const url = `https://sandbox.payfast.co.za/eng/process?${query}`;

    res.json({ url });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "PayFast redirect failed" });
  }
});

/** -------------------- PAYFAST IPN -------------------- */
router.post("/payfast-ipn", async (req, res) => {
  try {
    const { m_payment_id, payment_status } = req.body;

    const bookingId = m_payment_id.split("-")[0];

    const booking = await Booking.findByPk(bookingId, { include: User });

    if (booking && payment_status === "COMPLETE") {
      booking.status = "CONFIRMED";

      await booking.save();

      // Mark slots as booked
      await AvailabilitySlot.update(
        { isBooked: true },
        { where: { bookingId: booking.id } },
      );

      const user = await User.findByPk(booking.clientId);

      if (user) {
        await sendEmail(
          user.email,
          "Booking Confirmed",
          `<h3>Hi ${user.name},</h3>
           <p>Your booking #${booking.id} for ${booking.bookingDate} from ${booking.startTime} to ${booking.endTime} has been confirmed.</p>`,
        );

        await sendEmail(
          user.email,
          "Payment Successful",
          `<h3>Hi ${user.name},</h3>
           <p>Your payment has been successfully processed.</p>`,
        );
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "PayFast IPN failed" });
  }
});

module.exports = router;
