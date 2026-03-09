// routes/booking.js
const express = require("express");
const router = express.Router();
const { Booking, Payment,User } = require("../models");
const { generateSignature } = require("../utils/payfast");
const sendEmail = require("../utils/sendEmail");


// Helper function
const calculatePrice = (startTime, endTime) => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const diffMs = end - start;
  const hours = diffMs / (1000 * 60 * 60);
  const pricePerHour = 800;
  return hours * pricePerHour;
};

// Create booking
router.post("/", async (req, res) => {
  try {
    const { userId, therapistId, bookingDate, startTime, endTime, description } = req.body;

    if (!userId || !therapistId || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required booking fields" });
    }

    const price = calculatePrice(startTime, endTime);

    const booking = await Booking.create({
      clientId: userId,
      therapistId,
      bookingDate,
      startTime,
      endTime,
      notes: description,
      status: "PENDING",
    });

    await Payment.create({
      amount: price,
      currency: "ZAR",
      status: "PENDING",
      transactionReference: `BOOK-${booking.id}`,
      paymentMethod: "CARD",
    });

    res.status(201).json({ booking, amount: price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Booking failed" });
  }
});

// Get available slots
router.get("/available/:therapistId", async (req, res) => {
  try {
    const { therapistId } = req.params;
    const bookedSlots = await Booking.findAll({
      where: { therapistId, status: "CONFIRMED" },
      attributes: ["availabilitySlotId"],
    });

    const bookedSlotIds = bookedSlots.map(b => b.availabilitySlotId);
    res.json({ bookedSlotIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch available slots" });
  }
});

// Get user's bookings
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { clientId: req.params.userId, status: "CONFIRMED" },
      order: [["createdAt", "DESC"]],
    });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Payment success
router.post("/payment-success/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    booking.status = "CONFIRMED";
    await booking.save();
    res.json({ message: "Booking confirmed after payment" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Payment confirmation failed" });
  }
});

// Redirect to PayFast sandbox
router.post("/payfast/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // get logged-in user
    const user = await User.findByPk(booking.clientId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const price = calculatePrice(booking.startTime, booking.endTime);

    // split name
    const nameParts = user.name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "User";

    // create payment id (bookingId + today's date)
    const today = new Date().toISOString().slice(0,10).replace(/-/g,"");
    const paymentId = `${booking.id}-${today}`;

    const data = {
      merchant_id: "10036644",
      merchant_key: "t4gr984tybhfx",

      return_url: "https://smart-booking-system-8cgy.onrender.com/payment-success",
      cancel_url: "https://smart-booking-system-8cgy.onrender.com/payment-cancel",
      notify_url: `${import.meta.env.VITE_API_URL}/api/bookings/payfast-ipn`,

      name_first: firstName,
      name_last: lastName,
      email_address: user.email,

      m_payment_id: paymentId,

      amount: price.toFixed(2),

      item_name: `Therapy Booking #${booking.id}`
    };

    const signature = generateSignature(data, "payfastintergration");

    data.signature = signature;

    const query = new URLSearchParams(data).toString();

    const url = `https://sandbox.payfast.co.za/eng/process?${query}`;

    res.json({ url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "PayFast redirect failed" });
  }
});

router.post("/payfast-ipn", async (req, res) => {
  const { m_payment_id, payment_status } = req.body;

  const bookingId = m_payment_id.split("-")[0];

  const booking = await Booking.findByPk(bookingId, { include: User });

  if (booking && payment_status === "COMPLETE") {
    booking.status = "CONFIRMED";
    await booking.save();

    const user = await User.findByPk(booking.clientId);

    if (user) {
      await sendEmail(
        user.email,
        "Booking Confirmed",
        `<h3>Hi ${user.name},</h3>
         <p>Your booking #${booking.id} for ${booking.bookingDate} from ${booking.startTime} to ${booking.endTime} has been confirmed.</p>`
      );

      await sendEmail(
        user.email,
        "Payment Successful",
        `<h3>Hi ${user.name},</h3>
         <p>Your payment of R${booking.Payment?.amount || 'N/A'} has been successfully processed.</p>`
      );
    }
  }

  res.sendStatus(200);
});


module.exports = router;
