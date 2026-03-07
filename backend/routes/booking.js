// routes/booking.js
const express = require("express");
const router = express.Router();
const { Booking } = require("../models");

// Create booking
router.post("/", async (req, res) => {
  try {
    const { userId, therapistId, slotId, description } = req.body;

    console.log('Received booking request:', { userId, therapistId, slotId, description });

    // Validate required fields
    if (!userId || !therapistId || !slotId) {
      return res.status(400).json({ error: "Missing required fields: userId, therapistId and slotId are required" });
    }

    // Check if this slot is already booked for this therapist
    const existingBooking = await Booking.findOne({
      where: { 
        therapistId: therapistId,
        availabilitySlotId: slotId,
        status: 'CONFIRMED'
      }
    });

    if (existingBooking) {
      return res.status(400).json({ error: "This time slot is already booked. Please select another slot." });
    }

    // Create booking
    const booking = await Booking.create({
      clientId: userId,
      therapistId: therapistId,
      availabilitySlotId: slotId,
      notes: description,
      status: 'CONFIRMED'
    });

    console.log('Booking created:', booking.toJSON());
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: "Booking failed: " + error.message });
  }
});

// Get available slots for a therapist (returns IDs of booked slots)
router.get("/available/:therapistId", async (req, res) => {
  try {
    const { therapistId } = req.params;
    
    // Find all booked slots for this therapist
    const bookedSlots = await Booking.findAll({
      where: { 
        therapistId: therapistId,
        status: 'CONFIRMED'
      },
      attributes: ['availabilitySlotId']
    });

    const bookedSlotIds = bookedSlots.map(booking => booking.availabilitySlotId);
    
    res.json({ bookedSlotIds });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ error: "Failed to fetch available slots" });
  }
});

// Get user's bookings
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { 
        clientId: req.params.userId,
        status: 'CONFIRMED'
      },
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

module.exports = router;