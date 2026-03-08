const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./models');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require("./routes/users");
const therapistsRouter = require('./routes/therapists');
const bookingRoutes = require('./routes/booking');
const availabilityRoutes = require('./routes/availability');


const app = express();
const PORT = 5000;
require('dotenv').config();


// Configure CORS to accept requests from your frontend
app.use(cors({
  origin: 'http://localhost:5173', // or whatever port your frontend runs on
  credentials: true
}));
app.use(bodyParser.json());

// Auth Routes
app.use('/api/auth', authRoutes);

// Admin Routes
app.use('/api/admin', adminRoutes);
app.use('/api/therapists', therapistsRouter);

// User Routes
app.use('/api/users', userRoutes);

// booking routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/availability', availabilityRoutes);

app.get('/', (req, res) => res.send('Server is running'));

// Sync DB and start server
db.sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
