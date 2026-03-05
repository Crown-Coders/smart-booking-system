const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models");

router.get("/me", async (req, res) => {
  try {

    console.log("AUTH HEADER:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");

    console.log("DECODED:", decoded);

    const user = await User.findByPk(decoded.id);

    res.json(user);

  } catch (err) {
    console.error("JWT ERROR:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;