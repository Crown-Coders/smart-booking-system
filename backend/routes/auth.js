const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const jwt = require("jsonwebtoken");

// --------------------
// REGISTER
// --------------------
router.post('/register', async (req, res) => {
  const { name, surname, email, password, idNumber } = req.body;

  // 1️⃣ Validate input
  if (!name || !surname || !email || !password || !idNumber)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      surname,
      email,
      password: hashedPassword,
      idNumber,
      role: "CLIENT",        // Default role
      isStaff: false,
      isSuperUser: false,
      isActive: true
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        role: newUser.role,
        isStaff: newUser.isStaff,
        isSuperUser: newUser.isSuperUser,
        isActive: newUser.isActive
      },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: 'User registered',
      token
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// --------------------
// LOGIN
// --------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Normalize email to lowercase for consistent matching
    const normalizedEmail = email.toLowerCase();

    // Find user in the database
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ message: "Account is inactive" });
    }

    // Compare password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token (no expiration)
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        isStaff: user.isStaff,
        isSuperUser: user.isSuperUser,
        isActive: user.isActive
      },
      process.env.JWT_SECRET || "your_jwt_secret"
      // No expiresIn → token never expires
    );

    // Return token + user info (exclude password)
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isStaff: user.isStaff,
        isSuperUser: user.isSuperUser,
        isActive: user.isActive,
        idNumber: user.idNumber,
        cardHolderName: user.cardHolderName,
        cardBrand: user.cardBrand,
        cardLast4: user.cardLast4,
        cardExpiryMonth: user.cardExpiryMonth,
        cardExpiryYear: user.cardExpiryYear,
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
