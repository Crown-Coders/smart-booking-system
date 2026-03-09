const jwt = require("jsonwebtoken");

// 🔐 VERIFY TOKEN FIRST
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );

    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


// 👑 SUPERUSER ONLY
const superUserOnly = (req, res, next) => {
  if (!req.user.isSuperUser) {
    return res.status(403).json({ message: "Superuser access only" });
  }
  next();
};


// 🧑‍💼 STAFF ONLY
const staffOnly = (req, res, next) => {
  if (!req.user.isStaff) {
    return res.status(403).json({ message: "Staff only" });
  }
  next();
};


module.exports = {
  verifyToken,
  superUserOnly,
  staffOnly
};
