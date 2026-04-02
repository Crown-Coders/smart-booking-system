const express = require("express");
const router = express.Router();
const { AvailabilitySlot } = require("../models");

router.get("/", async (req, res) => {

  const { therapistId, date } = req.query;

  if (!therapistId || !date) {
    return res.status(400).json({ error: "therapistId and date required" });
  }

  try {

    const slots = await AvailabilitySlot.findAll({
      where: {
        therapistId,
        date
      },
      attributes: ["startTime", "endTime", "isBooked"],
      order: [["startTime", "ASC"]]
    });

    res.json({ slots });

  } catch (error) {
    console.error("Availability error:", error);
    res.status(500).json({ error: "Failed to fetch availability" });
  }

});

module.exports = router;