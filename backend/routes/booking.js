// routes/booking.js
const express = require("express");
const router = express.Router();
const { Booking, AvailabilitySlot, Payment, User, sequelize } = require("../models");
const { Op, fn, col, where } = require("sequelize");
const { generateSignature } = require("../utils/payfast");
const sendEmail = require("../utils/sendEmail");

/** -------------------- HELPER FUNCTION -------------------- */
const calculatePrice = (startTime, endTime) => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const hours = (end - start) / (1000 * 60 * 60);
  return hours * 800; // R800 per hour
};

const serializeBooking = (booking) => {
  const plain = booking.get ? booking.get({ plain: true }) : booking;
  return {
    ...plain,
    price: plain.payment?.amount ? Number(plain.payment.amount) : calculatePrice(plain.startTime, plain.endTime),
  };
};

const buildLegacySlotWhere = (booking) => ({
  [Op.and]: [
    { therapistId: booking.therapistId },
    where(fn("date", col("date")), booking.bookingDate),
    {
      startTime: {
        [Op.gte]: booking.startTime,
        [Op.lt]: booking.endTime,
      },
    },
  ],
});

const buildSlotRows = (bookingId, therapistId, bookingDate, startTime, endTime, isBooked) => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const rows = [];
  let current = new Date(start);

  while (current < end) {
    const slotStart = current.toTimeString().slice(0, 5);
    current.setMinutes(current.getMinutes() + 30);
    const slotEnd = current.toTimeString().slice(0, 5);

    rows.push({
      therapistId,
      bookingId,
      date: bookingDate,
      startTime: slotStart,
      endTime: slotEnd,
      isBooked,
    });
  }

  return rows;
};

const canRescheduleBooking = (booking) => {
  const sessionStart = new Date(`${booking.bookingDate}T${booking.startTime}`);
  return sessionStart.getTime() - Date.now() >= 24 * 60 * 60 * 1000;
};

/** -------------------- GET ALL BOOKINGS -------------------- */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          as: "client",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Payment,
          as: "payment",
          attributes: ["amount", "status", "currency"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(bookings.map(serializeBooking));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

/** -------------------- GET THERAPIST BOOKINGS -------------------- */
router.get("/therapist/:therapistId", async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { therapistId: req.params.therapistId },
      include: [
        {
          model: User,
          as: "client",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Payment,
          as: "payment",
          attributes: ["amount", "status", "currency"],
          required: false,
        },
      ],
      order: [["bookingDate", "DESC"], ["startTime", "DESC"]],
    });

    res.json(bookings.map(serializeBooking));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch therapist bookings" });
  }
});

/** -------------------- UPDATE BOOKING STATUS -------------------- */
router.patch("/:id/status", async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { status } = req.body;
    const booking = await Booking.findByPk(req.params.id, {
      transaction: t,
    });

    if (!booking) {
      await t.rollback();
      return res.status(404).json({ error: "Booking not found" });
    }

    if (!["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
      await t.rollback();
      return res.status(400).json({ error: "Invalid booking status" });
    }

    console.log("Booking status update requested", {
      bookingId: booking.id,
      currentStatus: booking.status,
      nextStatus: status,
    });

    booking.status = status;
    await booking.save({ transaction: t });

    if (status === "CONFIRMED") {
      const [linkedSlotCount] = await AvailabilitySlot.update(
        { isBooked: true },
        {
          where: { bookingId: booking.id },
          transaction: t,
        },
      );

      if (linkedSlotCount === 0) {
        const [legacySlotCount] = await AvailabilitySlot.update(
          { isBooked: true, bookingId: booking.id },
          {
            where: buildLegacySlotWhere(booking),
            transaction: t,
          },
        );
        console.log("Booking confirmation fallback slot update", {
          bookingId: booking.id,
          linkedSlotCount,
          legacySlotCount,
        });
      }

      await Payment.update(
        { status: "COMPLETED" },
        {
          where: { bookingId: booking.id },
          transaction: t,
        },
      );
    }

    if (status === "CANCELLED") {
      await AvailabilitySlot.destroy({
        where: {
          [Op.or]: [
            { bookingId: booking.id },
            buildLegacySlotWhere(booking),
          ],
        },
        transaction: t,
      });
      await Payment.update(
        { status: "FAILED" },
        {
          where: { bookingId: booking.id },
          transaction: t,
        },
      );
    }

    const updatedBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: User,
          as: "client",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Payment,
          as: "payment",
          attributes: ["amount", "status", "currency"],
          required: false,
        },
      ],
      transaction: t,
    });

    await t.commit();
    res.json(serializeBooking(updatedBooking));
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: "Failed to update booking status" });
  }
});

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
        userId: userId, // <--- add this
        amount: price,
        currency: "ZAR",
        status: "PENDING",
        transactionReference: `BOOK-${booking.id}`,
        paymentMethod: "CARD",
      },
      { transaction: t },
    );

    await t.commit(); // commit transaction

    console.log("Booking created successfully", {
      bookingId: booking.id,
      clientId: userId,
      therapistId,
      bookingDate,
      startTime,
      endTime,
      slotCount: slotsToCreate.length,
      amount: price,
    });

    res.status(201).json({ booking, amount: price });
  } catch (error) {
    await t.rollback(); // rollback if anything fails

    console.error("Booking creation failed", error);

    res.status(500).json({ error: "Booking failed" });
  }
});

router.patch("/:id/reschedule", async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: Payment,
          as: "payment",
          attributes: ["amount", "status", "currency"],
          required: false,
        },
      ],
      transaction: t,
    });

    if (!booking) {
      await t.rollback();
      return res.status(404).json({ error: "Booking not found" });
    }

    if (!canRescheduleBooking(booking)) {
      await t.rollback();
      return res.status(400).json({
        error: "Rescheduling is only allowed at least 24 hours before the session",
      });
    }

    const {
      bookingDate,
      startTime,
      endTime,
      description,
    } = req.body;

    if (!bookingDate || !startTime || !endTime) {
      await t.rollback();
      return res.status(400).json({ error: "Missing reschedule details" });
    }

    await AvailabilitySlot.destroy({
      where: {
        [Op.or]: [
          { bookingId: booking.id },
          buildLegacySlotWhere(booking),
        ],
      },
      transaction: t,
    });

    const conflictingSlot = await AvailabilitySlot.findOne({
      where: {
        therapistId: booking.therapistId,
        [Op.and]: [
          where(fn("date", col("date")), bookingDate),
          {
            startTime: {
              [Op.lt]: endTime,
            },
          },
          {
            endTime: {
              [Op.gt]: startTime,
            },
          },
        ],
      },
      transaction: t,
    });

    if (conflictingSlot) {
      await t.rollback();
      return res.status(400).json({ error: "That new time slot is no longer available" });
    }

    booking.bookingDate = bookingDate;
    booking.startTime = startTime;
    booking.endTime = endTime;
    if (description !== undefined) {
      booking.notes = description;
    }
    await booking.save({ transaction: t });

    const shouldMarkBooked = ["CONFIRMED", "COMPLETED"].includes(booking.status);
    const replacementSlots = buildSlotRows(
      booking.id,
      booking.therapistId,
      bookingDate,
      startTime,
      endTime,
      shouldMarkBooked,
    );

    await AvailabilitySlot.bulkCreate(replacementSlots, { transaction: t });

    const updatedBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: User,
          as: "client",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Payment,
          as: "payment",
          attributes: ["amount", "status", "currency"],
          required: false,
        },
      ],
      transaction: t,
    });

    await t.commit();
    res.json(serializeBooking(updatedBooking));
  } catch (error) {
    await t.rollback();
    console.error("Booking reschedule failed", error);
    res.status(500).json({ error: "Failed to reschedule booking" });
  }
});
/** -------------------- DELETE BOOKING (CANCEL) - Simplified -------------------- */
router.delete("/:id", async (req, res) => {
  res.status(403).json({
    success: false,
    error: "Booked sessions cannot be cancelled or refunded under company policy",
  });
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
      include: [
        {
          model: Payment,
          as: "payment",
          attributes: ["amount", "status", "currency"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(bookings.map(serializeBooking));
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

/** -------------------- GET THERAPIST BOOKINGS -------------------- */
router.get("/therapist/:therapistId", async (req, res) => {
  try {
    const { therapistId } = req.params;

    const bookings = await Booking.findAll({
      where: { therapistId },
      order: [["bookingDate", "ASC"], ["startTime", "ASC"]],
    });

    const bookingsWithClient = await Promise.all(
      bookings.map(async (booking) => {
        const client = await User.findByPk(booking.clientId, {
          attributes: ["id", "name", "email"],
        });

        return {
          ...booking.toJSON(),
          client: client
            ? {
                id: client.id,
                name: client.name,
                email: client.email,
              }
            : null,
        };
      })
    );

    return res.json(bookingsWithClient);
  } catch (error) {
    console.error("Error fetching therapist bookings:", error);
    return res.status(500).json({ error: "Failed to fetch therapist bookings" });
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
