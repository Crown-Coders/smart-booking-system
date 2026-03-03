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

    // 3️⃣ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create the new user
    const newUser = await User.create({
      name,
      surname,
      email,
      password: hashedPassword,
      idNumber,
    });

    // 5️⃣ Create JWT token for new user
    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    // 6️⃣ Return token and user info
    return res.status(201).json({ message: 'User registered', token, user: newUser });
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

  // 1️⃣ Validate input
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    // 2️⃣ Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // 4️⃣ Create JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    // 5️⃣ Return token
    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
