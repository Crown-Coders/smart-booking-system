// // routes/booking.js
// const express = require("express");
// const router = express.Router();
// const { Booking, TherapistProfile, User, AvailabilitySlot } = require("../models");
// const { Op } = require('sequelize');

// // Create booking
// router.post("/", async (req, res) => {
//   try {
//     const { userId, therapistId, bookingDate, startTime, endTime, description } = req.body;

//     // Validate required fields
//     if (!userId || !therapistId || !bookingDate || !startTime || !endTime) {
//       return res.status(400).json({ 
//         error: "Missing required fields" 
//       });
//     }

//     // Check if this time slot is already CONFIRMED in AvailabilitySlots
//     const existingSlot = await AvailabilitySlot.findOne({
//       where: {
//         therapistId: therapistId,
//         date: bookingDate,
//         startTime: startTime,
//         endTime: endTime,
//         isBooked: true
//       }
//     });

//     if (existingSlot) {
//       return res.status(400).json({ 
//         error: "This time slot is already booked. Please select a different time." 
//       });
//     }

//     // Create booking with PENDING status
//     const booking = await Booking.create({
//       clientId: userId,
//       therapistId: therapistId,
//       bookingDate: bookingDate,
//       startTime: startTime,
//       endTime: endTime,
//       notes: description || "",
//       status: "PENDING",
//     });

//     // Create availability slot (will be marked as booked when admin confirms)
//     await AvailabilitySlot.create({
//       therapistId: therapistId,
//       date: bookingDate,
//       startTime: startTime,
//       endTime: endTime,
//       isBooked: false // Set to false initially, admin will mark as booked when confirming
//     });

//     res.status(201).json({
//       message: "Booking created successfully. Awaiting admin approval.",
//       booking: booking
//     });

//   } catch (error) {
//     console.error("Error creating booking:", error);
//     res.status(500).json({ error: "Booking failed" });
//   }
// });

// // Get available slots for a therapist on a specific date
// router.get("/available/:therapistId", async (req, res) => {
//   try {
//     const { therapistId } = req.params;
//     const { date } = req.query;

//     if (!date) {
//       return res.status(400).json({ error: "Date is required" });
//     }

//     // Find all CONFIRMED/booked slots for this therapist on this date
//     const bookedSlots = await AvailabilitySlot.findAll({
//       where: {
//         therapistId: therapistId,
//         date: date,
//         isBooked: true // Only return slots that are actually booked
//       },
//       attributes: ['startTime', 'endTime']
//     });

//     res.json({ 
//       bookedSlots: bookedSlots
//     });

//   } catch (error) {
//     console.error("Error fetching available slots:", error);
//     res.status(500).json({ error: "Failed to fetch available slots" });
//   }
// });

// // Admin route to confirm booking
// router.patch("/:bookingId/confirm", async (req, res) => {
//   try {
//     const { bookingId } = req.params;

//     // Find the booking
//     const booking = await Booking.findByPk(bookingId);
    
//     if (!booking) {
//       return res.status(404).json({ error: "Booking not found" });
//     }

//     // Update booking status to CONFIRMED
//     booking.status = "CONFIRMED";
//     await booking.save();

//     // Find and update the corresponding availability slot to booked
//     await AvailabilitySlot.update(
//       { isBooked: true },
//       {
//         where: {
//           therapistId: booking.therapistId,
//           date: booking.bookingDate,
//           startTime: booking.startTime,
//           endTime: booking.endTime,
//           isBooked: false
//         }
//       }
//     );

//     res.json({ 
//       message: "Booking confirmed successfully",
//       booking: booking
//     });

//   } catch (error) {
//     console.error("Error confirming booking:", error);
//     res.status(500).json({ error: "Failed to confirm booking" });
//   }
// });

// // Admin route to cancel/reject booking
// router.patch("/:bookingId/cancel", async (req, res) => {
//   try {
//     const { bookingId } = req.params;

//     // Find the booking
//     const booking = await Booking.findByPk(bookingId);
    
//     if (!booking) {
//       return res.status(404).json({ error: "Booking not found" });
//     }

//     // Update booking status to CANCELLED
//     booking.status = "CANCELLED";
//     await booking.save();

//     // Delete or mark availability slot as not booked
//     await AvailabilitySlot.destroy({
//       where: {
//         therapistId: booking.therapistId,
//         date: booking.bookingDate,
//         startTime: booking.startTime,
//         endTime: booking.endTime,
//         isBooked: false
//       }
//     });

//     res.json({ 
//       message: "Booking cancelled successfully",
//       booking: booking
//     });

//   } catch (error) {
//     console.error("Error cancelling booking:", error);
//     res.status(500).json({ error: "Failed to cancel booking" });
//   }
// });

// // Get user's bookings
// router.get("/user/:userId", async (req, res) => {
//   try {
//     const bookings = await Booking.findAll({
//       where: { 
//         clientId: req.params.userId
//       },
//       order: [["createdAt", "DESC"]],
//     });

//     // Get unique therapist IDs
//     const therapistIds = [...new Set(bookings.map(b => b.therapistId))];
    
//     // Fetch therapist details
//     const therapists = await TherapistProfile.findAll({
//       where: { id: therapistIds }
//     });

//     // Get user details for each therapist
//     const therapistMap = {};
//     for (const therapist of therapists) {
//       const user = await User.findByPk(therapist.userId, {
//         attributes: ['id', 'name', 'email']
//       });
//       therapistMap[therapist.id] = {
//         id: therapist.id,
//         name: user?.name || 'Unknown',
//         specialization: therapist.specialization
//       };
//     }

//     // Enhance bookings with therapist info
//     const enhancedBookings = bookings.map(booking => ({
//       id: booking.id,
//       status: booking.status,
//       notes: booking.notes,
//       createdAt: booking.createdAt,
//       bookingDate: booking.bookingDate,
//       startTime: booking.startTime,
//       endTime: booking.endTime,
//       therapist: therapistMap[booking.therapistId] || {
//         id: booking.therapistId,
//         name: 'Unknown Therapist',
//         specialization: 'Therapy Session'
//       }
//     }));

//     res.json(enhancedBookings);
//   } catch (error) {
//     console.error("Error fetching user bookings:", error);
//     res.status(500).json({ error: "Failed to fetch bookings" });
//   }
// });

// module.exports = router;
// routes/booking.js
const express = require("express");
const router = express.Router();
const { Booking, TherapistProfile, User, AvailabilitySlot } = require("../models");
const { Op } = require('sequelize');
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

    // Validate required fields
    if (!userId || !therapistId || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({ 
        error: "Missing required fields" 
      });
    }

    // Check if this time slot is already booked in AvailabilitySlots
    const existingSlot = await AvailabilitySlot.findOne({
      where: {
        therapistId: therapistId,
        date: bookingDate,
        startTime: startTime,
        endTime: endTime,
        isBooked: true
      }
    });

    if (existingSlot) {
      return res.status(400).json({ 
        error: "This time slot is already booked. Please select a different time." 
      });
    }

    // Create booking with CONFIRMED status (no admin approval needed)
    const booking = await Booking.create({
      clientId: userId,
      therapistId: therapistId,
      bookingDate: bookingDate,
      startTime: startTime,
      endTime: endTime,
      notes: description || "",
      status: "CONFIRMED", // Immediately confirmed
    });

    // Create availability slot and mark as booked immediately
    await AvailabilitySlot.create({
      therapistId: therapistId,
      date: bookingDate,
      startTime: startTime,
      endTime: endTime,
      isBooked: true // Immediately mark as booked
    });

    res.status(201).json({
      message: "Booking confirmed successfully!",
      booking: booking
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Booking failed" });
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
    console.error("Error fetching available slots:", error);
    res.status(500).json({ error: "Failed to fetch available slots" });
  }
});

// Get user's bookings
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
        specialization: therapist.specialization
      };
    }

    // Enhance bookings with therapist info
    const enhancedBookings = bookings.map(booking => ({
      id: booking.id,
      status: booking.status,
      notes: booking.notes,
      createdAt: booking.createdAt,
      bookingDate: booking.bookingDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      therapist: therapistMap[booking.therapistId] || {
        id: booking.therapistId,
        name: 'Unknown Therapist',
        specialization: 'Therapy Session'
      }
    }));

    res.json(enhancedBookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
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
