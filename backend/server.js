const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./models'); // Sequelize models
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('Server is running'));

// Sync DB and start server
db.sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
