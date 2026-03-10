// backend/server.js
require('dotenv').config(); // MUST BE AT THE VERY TOP! Loads the OpenAI key first.

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./models');

// Route imports
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require("./routes/users");
const therapistsRouter = require('./routes/therapists');
const bookingRoutes = require('./routes/booking');
const availabilityRoutes = require('./routes/availability');
const chatbot = require('./routes/chatbot');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to accept requests from your frontend
app.use(cors({
  origin: ['http://localhost:5173', 'https://smart-booking-system-8cgy.onrender.com'], // or whatever port your frontend runs on
  credentials: true
}));
app.use(bodyParser.json());

// Auth Routes
app.use('/api/auth', authRoutes);

// Admin & Therapist Routes
app.use('/api/admin', adminRoutes);
app.use('/api/therapists', therapistsRouter);

// User Routes
app.use('/api/users', userRoutes);

// Booking & Availability Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/availability', availabilityRoutes);

// Chatbot Route 
app.use('/api/chat', chatbot);

// Base test route
app.get('/', (req, res) => res.send('Server is running'));

// Sync DB and start server
db.sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});