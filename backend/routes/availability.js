const express = require("express");
const router = express.Router();
const { AvailabilitySlot } = require("../models");

// Get availability for therapist
router.get("/:therapistId", async (req, res) => {
  try {
    const slots = await AvailabilitySlot.findAll({
      where: {
        therapistId: req.params.therapistId,
        isBooked: false
      }
    });

    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch availability" });
  }
});

module.exports = router;