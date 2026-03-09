const express = require('express');
const { AvailabilitySlot } = require('../models'); 
const router = express.Router();

// GET /api/availability?therapistId=123&date=2025-03-20
router.get('/', async (req, res) => {
  try {
    const { therapistId, date } = req.query;

    if (!therapistId || !date) {
      return res.status(400).json({ error: 'Missing therapistId or date' });
    }

    // Find all slots for this therapist on the given date that are not booked
    const availableSlots = await AvailabilitySlot.findAll({
      where: {
        therapistId,
        date,
        isBooked: false
      },
      attributes: ['id', 'startTime', 'endTime'], // return what you need
      order: [['startTime', 'ASC']]
    });

    res.json({ available: availableSlots });
  } catch (error) {
    console.error('Availability error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;