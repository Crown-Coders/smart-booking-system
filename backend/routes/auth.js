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

  if (!name || !surname || !email || !password || !idNumber)
    return res.status(400).json({ message: 'All fields are required' });

  try {
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

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    if (!user.isActive)
      return res.status(403).json({ message: "Account is inactive" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        isStaff: user.isStaff,
        isSuperUser: user.isSuperUser,
        isActive: user.isActive
      },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
