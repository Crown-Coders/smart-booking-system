// backend/routes/booking.js
const express = require('express');
const router = express.Router();
const { Booking, AvailabilitySlot, Payment, User, sequelize } = require('../models');
const { generateSignature } = require('../utils/payfast');
const sendEmail = require('../utils/sendEmail');
const { Op } = require('sequelize');

/** -------------------- HELPER FUNCTION -------------------- */
const calculatePrice = (startTime, endTime) => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const hours = (end - start) / (1000 * 60 * 60);
  return hours * 800; // Price per hour
};

/** -------------------- CREATE BOOKING -------------------- */
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId, therapistId, bookingDate, startTime, endTime, description } = req.body;
    if (!userId || !therapistId || !startTime || !endTime) {
      await t.rollback();
      return res.status(400).json({ error: 'Missing required booking fields' });
    }

    const price = calculatePrice(startTime, endTime);

    /** Check overlapping bookings */
    const overlappingBooking = await Booking.findOne({
      where: {
        therapistId,
        bookingDate,
        status: { [Op.in]: ['PENDING', 'COMPLETED'] },
        [Op.or]: [{ startTime: { [Op.lt]: endTime }, endTime: { [Op.gt]: startTime } }],
      },
      transaction: t,
    });

    if (overlappingBooking) {
      await t.rollback();
      return res.status(400).json({ error: 'This time range is already booked' });
    }

    /** Create booking */
    const booking = await Booking.create(
      {
        clientId: userId,
        therapistId,
        bookingDate,
        startTime,
        endTime,
        notes: description,
        status: 'PENDING',
      },
      { transaction: t }
    );

    /** Create slots */
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    let current = new Date(start);
    const slotsToCreate = [];

    while (current < end) {
      const slotStart = current.toTimeString().slice(0, 5);
      current.setMinutes(current.getMinutes() + 30);
      const slotEnd = current.toTimeString().slice(0, 5);

      slotsToCreate.push({
        therapistId,
        date: bookingDate,
        startTime: slotStart,
        endTime: slotEnd,
        isBooked: false,
        bookingId: booking.id,
      });
    }

    await AvailabilitySlot.bulkCreate(slotsToCreate, { transaction: t });

    /** Create payment record */
    await Payment.create(
      {
        bookingId: booking.id,
        userId,
        amount: price,
        currency: 'ZAR',
        status: 'PENDING',
        transactionReference: `BOOK-${booking.id}`,
        paymentMethod: 'CARD',
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({ booking, amount: price });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: 'Booking failed' });
  }
});

/** -------------------- CANCEL BOOKING -------------------- */
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const booking = await Booking.findByPk(req.params.id, { transaction: t });
    if (!booking) {
      await t.rollback();
      return res.status(404).json({ error: 'Booking not found' });
    }
    if (booking.status === 'COMPLETED') {
      await t.rollback();
      return res.status(400).json({ error: 'Cannot cancel a completed booking' });
    }

    /** Delete slots and payment */
    await AvailabilitySlot.destroy({ where: { bookingId: booking.id }, transaction: t });
    await Payment.destroy({ where: { bookingId: booking.id }, transaction: t });
    await booking.destroy({ transaction: t });

    await t.commit();
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: 'Cancel failed' });
  }
});

/** -------------------- GET BOOKED SLOTS -------------------- */
router.get('/available/:therapistId', async (req, res) => {
  try {
    const { therapistId } = req.params;
    const { date } = req.query;

    const bookedSlots = await AvailabilitySlot.findAll({
      where: { therapistId, date, isBooked: true },
      order: [['startTime', 'ASC']],
    });

    res.json({ bookedSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

/** -------------------- GET USER BOOKINGS -------------------- */
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { clientId: req.params.userId },
      order: [['createdAt', 'DESC']],
    });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

/** -------------------- PAYFAST REDIRECT -------------------- */
router.post('/payfast/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const user = await User.findByPk(booking.clientId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const price = calculatePrice(booking.startTime, booking.endTime);
    const [firstName, ...lastParts] = user.name.split(' ');
    const lastName = lastParts.join(' ') || 'User';
    const paymentId = `${booking.id}-${Date.now()}`;

    const data = {
      merchant_id: '10036644',
      merchant_key: 't4gr984tybhfx',
      return_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      notify_url: `${process.env.BACKEND_URL}/api/bookings/payfast-ipn`,
      name_first: firstName,
      name_last: lastName,
      email_address: user.email,
      m_payment_id: paymentId,
      amount: price.toFixed(2),
      item_name: `Therapy Booking #${booking.id}`,
    };

    data.signature = generateSignature(data, 'payfastintergration');
    const url = `https://sandbox.payfast.co.za/eng/process?${new URLSearchParams(data)}`;

    res.json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'PayFast redirect failed' });
  }
});

/** -------------------- PAYFAST IPN -------------------- */
router.post('/payfast-ipn', async (req, res) => {
  try {
    const { m_payment_id, payment_status } = req.body;
    const bookingId = m_payment_id.split('-')[0];
    const booking = await Booking.findByPk(bookingId);

    if (booking && payment_status === 'COMPLETE') {
      booking.status = 'COMPLETED';
      await booking.save();

      await Payment.update({ status: 'COMPLETED' }, { where: { bookingId: booking.id } });
      await AvailabilitySlot.update({ isBooked: true }, { where: { bookingId: booking.id } });

      const user = await User.findByPk(booking.clientId);
      if (user) {
        await sendEmail(
          user.email,
          'Booking Confirmed',
          `<h3>Hi ${user.name},</h3><p>Your booking #${booking.id} is confirmed.</p>`
        );
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'IPN failed' });
  }
});

/** -------------------- PAYMENT SUCCESS - MARK SLOTS BOOKED -------------------- */
router.post('/payment-success/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.status = 'CONFIRMED';
    await booking.save();

    // Mark all slots for this booking as booked
    await AvailabilitySlot.update({ isBooked: true }, { where: { bookingId: booking.id } });

    res.json({ message: 'Booking confirmed and slots marked as booked' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment confirmation failed' });
  }
});

/** -------------------- PAYMENT SUCCESS - FETCH BOOKING STATUS -------------------- */
router.get('/payment-success/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch booking status' });
  }
});

module.exports = router;
