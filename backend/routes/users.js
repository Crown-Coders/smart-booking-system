const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const serializeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  idNumber: user.idNumber,
  isStaff: user.isStaff,
  isSuperUser: user.isSuperUser,
  isActive: user.isActive,
  cardHolderName: user.cardHolderName,
  cardBrand: user.cardBrand,
  cardLast4: user.cardLast4,
  cardExpiryMonth: user.cardExpiryMonth,
  cardExpiryYear: user.cardExpiryYear,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getUserFromAuthHeader = async (authHeader) => {
  if (!authHeader) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
  const user = await User.findByPk(decoded.id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

router.get("/me", async (req, res) => {
  try {

    console.log("AUTH HEADER:", req.headers.authorization);

    const user = await getUserFromAuthHeader(req.headers.authorization);
    res.json(serializeUser(user));

  } catch (err) {
    console.error("JWT ERROR:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
});

router.patch("/me/payment-method", async (req, res) => {
  try {
    const user = await getUserFromAuthHeader(req.headers.authorization);
    const {
      cardHolderName,
      cardNumber,
      cardBrand,
      cardExpiryMonth,
      cardExpiryYear,
    } = req.body;

    if (!cardHolderName || !cardNumber || !cardExpiryMonth || !cardExpiryYear) {
      return res.status(400).json({ message: "Missing card details" });
    }

    const digitsOnly = String(cardNumber).replace(/\D/g, "");
    if (digitsOnly.length < 12) {
      return res.status(400).json({ message: "Invalid card number" });
    }

    user.cardHolderName = cardHolderName;
    user.cardBrand = cardBrand || "Card";
    user.cardLast4 = digitsOnly.slice(-4);
    user.cardExpiryMonth = String(cardExpiryMonth).padStart(2, "0");
    user.cardExpiryYear = String(cardExpiryYear);

    await user.save();

    res.json({
      message: "Payment method saved",
      user: serializeUser(user),
    });
  } catch (err) {
    console.error("PAYMENT METHOD ERROR:", err.message);
    res.status(401).json({ message: "Unable to save payment method" });
  }
});


// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users.map(serializeUser));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Deactivate user
router.patch('/:id/deactivate', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deactivating user' });
  }
});

// Activate user
router.patch('/:id/activate', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = true;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error activating user' });
  }
});

module.exports = router;
