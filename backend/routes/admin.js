const express = require('express');
const router = express.Router();
const { verifyToken, superUserOnly } = require('../middleware/authMiddleware');

// Example: Admin Dashboard Route
router.get('/dashboard', verifyToken, superUserOnly, (req, res) => {
  res.json({ message: 'Welcome Superuser 👑' });
});

// Example: Get all users (only superuser can access)
const { User } = require('../models');
router.get('/users', verifyToken, superUserOnly, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'isSuperUser'] });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
