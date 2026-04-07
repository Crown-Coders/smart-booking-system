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
const HOST = process.env.HOST || '0.0.0.0';
 
const allowedOrigins = new Set([
  'https://smart-booking-system-8cgy.onrender.com'
]);

const isLocalDevOrigin = (origin) => {
  if (!origin) return true;

  try {
    const { protocol, hostname } = new URL(origin);
    return (
      (protocol === 'http:' || protocol === 'https:') &&
      (hostname === 'localhost' || hostname === '127.0.0.1')
    );
  } catch {
    return false;
  }
};

// Allow local web clients plus deployed frontend while keeping credentials enabled.
app.use(cors({
  origin(origin, callback) {
    if (allowedOrigins.has(origin) || isLocalDevOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
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

const ensureLocalSqliteColumns = async () => {
  if (process.env.DATABASE_URL) {
    return;
  }

  const queryInterface = db.sequelize.getQueryInterface();

  const ensureColumn = async (tableName, columnName, definition) => {
    const table = await queryInterface.describeTable(tableName);
    if (!table[columnName]) {
      await queryInterface.addColumn(tableName, columnName, definition);
      console.log(`Added missing column ${tableName}.${columnName}`);
    }
  };

  await ensureColumn('AvailabilitySlots', 'bookingId', { type: db.Sequelize.INTEGER, allowNull: true });
  await ensureColumn('Users', 'cardHolderName', { type: db.Sequelize.STRING, allowNull: true });
  await ensureColumn('Users', 'cardBrand', { type: db.Sequelize.STRING, allowNull: true });
  await ensureColumn('Users', 'cardLast4', { type: db.Sequelize.STRING, allowNull: true });
  await ensureColumn('Users', 'cardExpiryMonth', { type: db.Sequelize.STRING, allowNull: true });
  await ensureColumn('Users', 'cardExpiryYear', { type: db.Sequelize.STRING, allowNull: true });
  await ensureColumn('TherapistProfiles', 'typeOfPractice', { type: db.Sequelize.STRING, allowNull: true });
  await ensureColumn('TherapistProfiles', 'workingDays', { type: db.Sequelize.STRING, allowNull: true, defaultValue: '1,2,3,4,5' });
  await ensureColumn('TherapistProfiles', 'workDayStart', { type: db.Sequelize.STRING, allowNull: true, defaultValue: '08:00' });
  await ensureColumn('TherapistProfiles', 'workDayEnd', { type: db.Sequelize.STRING, allowNull: true, defaultValue: '17:00' });
};
 
// Sync DB, ensure superuser, and start server
const startServer = async () => {
  try {
    await db.sequelize.sync();
    await ensureLocalSqliteColumns();
    console.log("Database synced");

    await ensureSuperUser(); // <-- create superuser if missing

    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to sync DB or start server:", err);
  }
};
 
startServer();
