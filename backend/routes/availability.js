// routes/availability.js
const express = require("express");
const router = express.Router();
const { AvailabilitySlot } = require("../models");

// Get availability for therapist by date
router.get("/:therapistId", async (req, res) => {
  try {
    const { therapistId } = req.params;
    const { date } = req.query;

    const whereClause = {
      therapistId: therapistId
    };

    if (date) {
      whereClause.date = date;
    }

    const slots = await AvailabilitySlot.findAll({
      where: whereClause,
      order: [['time', 'ASC']]
    });

    res.json(slots);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: "Failed to fetch availability" });
  }
});

module.exports = router;