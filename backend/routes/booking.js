// routes/booking.js
const express = require("express");
const router = express.Router();
const { Booking, Payment, User, TherapistProfile, AvailabilitySlot } = require("../models");
const { Op } = require('sequelize');
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

    if (!userId || !therapistId || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required booking fields" });
    }

    // Check for overlapping slots in AvailabilitySlots
    const overlappingSlot = await AvailabilitySlot.findOne({
      where: {
        therapistId: therapistId,
        date: bookingDate,
        isBooked: true,
        [Op.or]: [
          {
            startTime: { [Op.lte]: startTime },
            endTime: { [Op.gt]: startTime }
          },
          {
            startTime: { [Op.lt]: endTime },
            endTime: { [Op.gte]: endTime }
          }
        ]
      }
    });

    if (overlappingSlot) {
      return res.status(400).json({ 
        error: "This time slot overlaps with an existing booking." 
      });
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

    // Create payment record
    await Payment.create({
      amount: price,
      currency: "ZAR",
      status: "PENDING",
      transactionReference: `BOOK-${booking.id}`,
      paymentMethod: "CARD",
    });

    // Create availability slot but mark as not booked yet (will be booked after payment)
    await AvailabilitySlot.create({
      therapistId: therapistId,
      date: bookingDate,
      startTime: startTime,
      endTime: endTime,
      isBooked: false
    });

    res.status(201).json({ booking, amount: price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Booking failed" });
  }
});
// Add this DELETE endpoint after your other routes, before module.exports
// Cancel booking - completely removes booking and frees up availability slot
router.delete("/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking first
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Delete the associated availability slot first
    await AvailabilitySlot.destroy({
      where: {
        therapistId: booking.therapistId,
        date: booking.bookingDate,
        startTime: booking.startTime,
        endTime: booking.endTime
      }
    });

    // Delete the booking
    await booking.destroy();

    res.json({ 
      message: "Booking cancelled and deleted successfully. No refund will be issued." 
    });

  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

// Get available slots for a therapist on a specific date
router.get("/available/:therapistId", async (req, res) => {
  try {
    const { therapistId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    // Find all booked slots for this therapist on this date
    const bookedSlots = await AvailabilitySlot.findAll({
      where: {
        therapistId: therapistId,
        date: date,
        isBooked: true
      },
      attributes: ['startTime', 'endTime']
    });

    res.json({ 
      bookedSlots: bookedSlots
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch available slots" });
  }
});

// Get user's bookings with availability slot data
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { 
        clientId: req.params.userId
      },
      order: [["createdAt", "DESC"]],
    });

    // Get unique therapist IDs
    const therapistIds = [...new Set(bookings.map(b => b.therapistId))];
    
    // Fetch therapist details
    const therapists = await TherapistProfile.findAll({
      where: { id: therapistIds }
    });

    // Get user details for each therapist
    const therapistMap = {};
    for (const therapist of therapists) {
      const user = await User.findByPk(therapist.userId, {
        attributes: ['id', 'name', 'email']
      });
      therapistMap[therapist.id] = {
        id: therapist.id,
        name: user?.name || 'Unknown',
        specialization: therapist.specialization,
        yearsOfExperience: therapist.yearsOfExperience,
        image: therapist.image
      };
    }

    // Enhance bookings with availability slot data
    const enhancedBookings = await Promise.all(bookings.map(async (booking) => {
      // Find the corresponding availability slot
      const availabilitySlot = await AvailabilitySlot.findOne({
        where: {
          therapistId: booking.therapistId,
          date: booking.bookingDate,
          startTime: booking.startTime,
          endTime: booking.endTime
        },
        attributes: ['id', 'isBooked', 'date', 'startTime', 'endTime']
      });

      // Format time for display
      const formatTime = (timeString) => {
        if (!timeString) return "Unknown";
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      };

      return {
        id: booking.id,
        status: booking.status,
        notes: booking.notes,
        createdAt: booking.createdAt,
        bookingDate: booking.bookingDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        // Availability slot data
        slot: availabilitySlot ? {
          id: availabilitySlot.id,
          isBooked: availabilitySlot.isBooked,
          date: availabilitySlot.date,
          startTime: availabilitySlot.startTime,
          endTime: availabilitySlot.endTime
        } : null,
        // Formatted for display
        displayDate: new Date(booking.bookingDate).toLocaleDateString("en-US", {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        displayStartTime: formatTime(booking.startTime),
        displayEndTime: formatTime(booking.endTime),
        therapist: therapistMap[booking.therapistId] || {
          id: booking.therapistId,
          name: 'Unknown Therapist',
          specialization: 'Therapy Session'
        }
      };
    }));

    res.json(enhancedBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Payment success - confirm booking and mark slot as booked
router.post("/payment-success/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    booking.status = "CONFIRMED";
    await booking.save();

    // Update the corresponding availability slot to booked
    await AvailabilitySlot.update(
      { isBooked: true },
      {
        where: {
          therapistId: booking.therapistId,
          date: booking.bookingDate,
          startTime: booking.startTime,
          endTime: booking.endTime
        }
      }
    );

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

      return_url: "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/payment-cancel",
      notify_url: "http://localhost:5000/api/bookings/payfast-ipn",

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

// PayFast IPN (Instant Payment Notification)
router.post("/payfast-ipn", async (req, res) => {
  try {
    const { m_payment_id, payment_status } = req.body;

    const bookingId = m_payment_id.split("-")[0];

    const booking = await Booking.findByPk(bookingId, { 
      include: [{ model: User, as: 'client' }] 
    });

    if (booking && payment_status === "COMPLETE") {
      booking.status = "CONFIRMED";
      await booking.save();

      // Update the corresponding availability slot to booked
      await AvailabilitySlot.update(
        { isBooked: true },
        {
          where: {
            therapistId: booking.therapistId,
            date: booking.bookingDate,
            startTime: booking.startTime,
            endTime: booking.endTime
          }
        }
      );

      const user = booking.client;

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
           <p>Your payment has been successfully processed.</p>`
        );
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("IPN Error:", error);
    res.sendStatus(500);
  }
});

module.exports = router;