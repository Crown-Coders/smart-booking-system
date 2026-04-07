// backend/routes/booking.js
const express = require("express");
const router = express.Router();
const { Booking, AvailabilitySlot, Payment, User, TherapistProfile, sequelize } = require("../models");
const { Op, fn, col, where } = require("sequelize");
const { generateSignature } = require("../utils/payfast");
const sendEmail = require("../utils/sendEmail");

/** -------------------- HELPER FUNCTIONS -------------------- */
const calculatePrice = (startTime, endTime) => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const hours = (end - start) / (1000 * 60 * 60);
  return hours * 800;
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

// ============= email sending function ===============

// format the time and date for the email content
const formatBookingDateTime = (booking) => ({
  date: new Date(booking.bookingDate).toLocaleDateString("en-ZA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  time: `${booking.startTime} - ${booking.endTime}`,
});
// sends email to both client and therapist when a booking is approved
const sendApprovalEmails = async (booking) => {
  const client = await User.findByPk(booking.clientId);
  const therapistProfile = await TherapistProfile.findByPk(booking.therapistId);
  const therapistUser = therapistProfile ? await User.findByPk(therapistProfile.userId) : null;
  const { date, time } = formatBookingDateTime(booking);

  if (client?.email) {
    await sendEmail({
      to: client.email,
      subject: "Session Approved",
      htmlContent: `<h3>Hi ${client.name},</h3><p>Your session has been approved.</p><p><strong>Date:</strong> ${date}</p><p><strong>Time:</strong> ${time}</p>`,
    });
  }
  // get booked therapist email and send approval email to them as well
  if (therapistUser?.email) {
    await sendEmail({
      to: therapistUser.email,
      subject: "New Approved Session",
      htmlContent: `<h3>Hi ${therapistUser.name},</h3><p>You have a confirmed session with ${client?.name || "a client"}.</p><p><strong>Date:</strong> ${date}</p><p><strong>Time:</strong> ${time}</p>`,
    });
  }
};
// lock the availability slots for a booking when it is confirmed, with a fallback for legacy slot records
const markBookingSlotsBooked = async (booking, transaction) => {
  const [linkedSlotCount] = await AvailabilitySlot.update(
    { isBooked: true },
    {
      where: { bookingId: booking.id },
      transaction,
    }
  );

  if (linkedSlotCount === 0) {
    const [legacySlotCount] = await AvailabilitySlot.update(
      { isBooked: true, bookingId: booking.id },
      {
        where: buildLegacySlotWhere(booking),
        transaction,
      }
    );

    console.log("Booking confirmation fallback slot update", {
      bookingId: booking.id,
      linkedSlotCount,
      legacySlotCount,
    });
  }
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
    const booking = await Booking.findByPk(req.params.id, { transaction: t });

    if (!booking) {
      await t.rollback();
      return res.status(404).json({ error: "Booking not found" });
    }

    if (!["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
      await t.rollback();
      return res.status(400).json({ error: "Invalid booking status" });
    }

    booking.status = status;
    await booking.save({ transaction: t });

    if (status === "CONFIRMED") {
      await markBookingSlotsBooked(booking, t);
      await Payment.update(
        { status: "COMPLETED" },
        {
          where: { bookingId: booking.id },
          transaction: t,
        }
      );
    }

    if (status === "CANCELLED") {
      await AvailabilitySlot.destroy({
        where: {
          [Op.or]: [{ bookingId: booking.id }, buildLegacySlotWhere(booking)],
        },
        transaction: t,
      });

      await Payment.update(
        { status: "FAILED" },
        {
          where: { bookingId: booking.id },
          transaction: t,
        }
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
    if (status === "CONFIRMED") {
      await sendApprovalEmails(updatedBooking);
    }
    res.json(serializeBooking(updatedBooking));
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: "Failed to update booking status" });
  }
});

/** -------------------- CREATE BOOKING -------------------- */
router.post("/", async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { userId, therapistId, bookingDate, startTime, endTime, description } = req.body;

    if (!userId || !therapistId || !bookingDate || !startTime || !endTime) {
      await t.rollback();
      return res.status(400).json({ error: "Missing required booking fields" });
    }

    const price = calculatePrice(startTime, endTime);

    const overlappingBooking = await Booking.findOne({
      where: {
        therapistId,
        bookingDate,
        status: { [Op.in]: ["CONFIRMED"] },
        [Op.or]: [{ startTime: { [Op.lt]: endTime }, endTime: { [Op.gt]: startTime } }],
      },
      transaction: t,
    });

    if (overlappingBooking) {
      await t.rollback();
      return res.status(400).json({ error: "This time range is already booked" });
    }

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
      { transaction: t }
    );

    const slotsToCreate = buildSlotRows(
      booking.id,
      therapistId,
      bookingDate,
      startTime,
      endTime,
      false
    );

    await AvailabilitySlot.bulkCreate(slotsToCreate, { transaction: t });

    await Payment.create(
      {
        bookingId: booking.id,
        userId,
        amount: price,
        currency: "ZAR",
        status: "PENDING",
        transactionReference: `BOOK-${booking.id}`,
        paymentMethod: "CARD",
      },
      { transaction: t }
    );

    await t.commit();

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
    await t.rollback();
    console.error("Booking creation failed", error);
    res.status(500).json({ error: "Booking failed" });
  }
});

/** -------------------- RESCHEDULE BOOKING -------------------- */
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

    const { bookingDate, startTime, endTime, description } = req.body;

    if (!bookingDate || !startTime || !endTime) {
      await t.rollback();
      return res.status(400).json({ error: "Missing reschedule details" });
    }

    await AvailabilitySlot.destroy({
      where: {
        [Op.or]: [{ bookingId: booking.id }, buildLegacySlotWhere(booking)],
      },
      transaction: t,
    });

    const conflictingSlot = await AvailabilitySlot.findOne({
      where: {
        therapistId: booking.therapistId,
        isBooked: true,
        [Op.and]: [
          where(fn("date", col("date")), bookingDate),
          { startTime: { [Op.lt]: endTime } },
          { endTime: { [Op.gt]: startTime } },
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

    const replacementSlots = buildSlotRows(
      booking.id,
      booking.therapistId,
      bookingDate,
      startTime,
      endTime,
      booking.status === "CONFIRMED"
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

/** -------------------- DELETE BOOKING (CANCEL) -------------------- */
router.delete("/:id", async (req, res) => {
  res.status(403).json({
    success: false,
    error: "Booked sessions cannot be cancelled or refunded under company policy",
  });
});

/** -------------------- GET BOOKED SLOTS -------------------- */
router.get("/available/:therapistId", async (req, res) => {
  try {
    const { therapistId } = req.params;
    const { date } = req.query;

    const bookedSlots = await AvailabilitySlot.findAll({
      where: { therapistId, date, isBooked: true },
      order: [["startTime", "ASC"]],
    });

    res.json({ bookedSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch slots" });
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
    const [firstName, ...lastParts] = user.name.split(" ");
    const lastName = lastParts.join(" ") || "User";
    const paymentId = `${booking.id}-${Date.now()}`;

    await Payment.update(
      { transactionReference: paymentId },
      { where: { bookingId: booking.id } }
    );

    const data = {
      merchant_id: "10036644",
      merchant_key: "t4gr984tybhfx",
      return_url: `${process.env.FRONTEND_URL}/payment-success?bookingId=${booking.id}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel?bookingId=${booking.id}`,
      notify_url: `${process.env.BACKEND_URL}/api/bookings/payfast-ipn`,
      name_first: firstName,
      name_last: lastName,
      email_address: user.email,
      m_payment_id: paymentId,
      amount: price.toFixed(2),
      item_name: `Therapy Booking #${booking.id}`,
    };

    data.signature = generateSignature(data, "payfastintergration");
    const url = `https://sandbox.payfast.co.za/eng/process?${new URLSearchParams(data)}`;

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
    console.log("PayFast ITN body:", req.body);

    if (!m_payment_id || !payment_status) {
      return res.status(400).json({ error: "Invalid ITN payload" });
    }

    const bookingId = m_payment_id.split("-")[0];
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (payment_status === "COMPLETE") {
      booking.status = "CONFIRMED";
      await booking.save();

      const [updatedPayments] = await Payment.update(
        { status: "COMPLETED" },
        { where: { bookingId: booking.id } }
      );

      await markBookingSlotsBooked(booking);

      console.log("PayFast payment completion result", {
        bookingId: booking.id,
        updatedPayments,
      });

      const user = await User.findByPk(booking.clientId);
      if (user) {
        await sendEmail({
          to: user.email,
          subject: "Booking Confirmed",
          htmlContent: `<h3>Hi ${user.name},</h3><p>Your booking #${booking.id} is confirmed.</p>`,
        });
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("IPN failed", error);
    res.status(500).json({ error: "IPN failed" });
  }
});

/** -------------------- PAYMENT SUCCESS -------------------- */
router.post("/payment-success/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    booking.status = "CONFIRMED";
    await booking.save();

    await Payment.update({ status: "COMPLETED" }, { where: { bookingId: booking.id } });
    await markBookingSlotsBooked(booking);

    res.json({ message: "Booking confirmed and payment marked completed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Payment confirmation failed" });
  }
});

/** -------------------- FETCH PAYMENT SUCCESS STATUS -------------------- */
router.get("/payment-success/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId, {
      include: [
        {
          model: Payment,
          as: "payment",
          attributes: ["amount", "status", "currency"],
          required: false,
        },
      ],
    });

    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ booking: serializeBooking(booking) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch booking status" });
  }
});

module.exports = router;
