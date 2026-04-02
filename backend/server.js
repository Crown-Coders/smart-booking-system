// backend/server.js
require('dotenv').config(); // MUST BE AT THE VERY TOP! Loads the OpenAI key first.
 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs'); // <-- Add bcrypt to hash passwords
const db = require('./models');
const { User } = require('./models'); // <-- Import User model
 
// Route imports
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require("./routes/users");
const therapistsRouter = require('./routes/therapists');
const bookingRoutes = require('./routes/booking');
const availabilityRoutes = require("./routes/availability");
const chatbot = require('./routes/chatbot');
 
const app = express();
const PORT = process.env.PORT || 5000;
 
// Configure CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://smart-booking-system-8cgy.onrender.com'
  ],
  credentials: true
}));
app.use(bodyParser.json());
 
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/therapists', therapistsRouter);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use("/api/availability-slots", availabilityRoutes);
app.use('/api/chat', chatbot);
 
// Base test route
app.get('/', (req, res) => res.send('Server is running'));
 
// Function to ensure superuser exists
const ensureSuperUser = async () => {
  try {
    const existing = await User.findOne({ where: { email: "super@system.com" } });
    if (!existing) {
      const hashedPassword = await bcrypt.hash("Super123!", 10);
        await User.create({
          name: "Main Superuser",
          email: "super@system.com",
          password: hashedPassword,
          idNumber: "9999999999999",
          role: "SUPERUSER",
        });
      console.log("👑 Superuser created!");
    } else {
      console.log("👑 Superuser already exists!");
    }
  } catch (error) {
    console.error("Failed to create superuser:", error);
  }
};
 
// Sync DB, ensure superuser, and start server
const startServer = async () => {
  try {
    // Force rebuild the database from your models
    await db.sequelize.sync({ force: true });
    console.log("Database synced (all tables recreated)");

    await ensureSuperUser(); // <-- create superuser if missing

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to sync DB or start server:", err);
  }
};
 
startServer();