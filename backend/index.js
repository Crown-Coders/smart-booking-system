// backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const chatbotRoutes = require('./routes/chatbot'); // Importing chatbot routes
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend running!');
});
// AI chatbot endpoint
app.use('/api/chatbot', chatbotRoutes);

// Export app for testing
module.exports = app;

// Only start server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Testing Server running on port ${PORT}`));
}