const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./models');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require("./routes/users");



const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Auth Routes
app.use('/api/auth', authRoutes);

// Admin Routes
app.use('/api/admin', adminRoutes);

// User Routes
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.send('Server is running'));

// Sync DB and start server
db.sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
