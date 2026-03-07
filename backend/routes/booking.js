// routes/booking.js
const express = require("express");
const router = express.Router();
const { Booking, Payment } = require("../models");

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

module.exports = router;
