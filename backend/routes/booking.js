const express = require("express");
const router = express.Router();
const { Booking, AvailabilitySlot } = require("../models");

// Create booking
router.post("/", async (req, res) => {
  try {
    const { userId, therapistId, slotId } = req.body;

    const booking = await Booking.create({
      userId,
      therapistId,
      slotId,
      status: "confirmed"
    });

    // mark slot as booked
    await AvailabilitySlot.update(
      { isBooked: true },
      { where: { id: slotId } }
    );

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Booking failed" });
  }
});

module.exports = router;