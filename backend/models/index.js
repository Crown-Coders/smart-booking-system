'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const basename = path.basename(__filename);
const db = {};

let sequelize;

// 🌐 Use PostgreSQL (Render) if DATABASE_URL exists
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production'
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
    },
  });

  console.log('✅ Connected to PostgreSQL database');
} 
// 💻 Fallback to SQLite for local development
else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || 'database.sqlite',
    logging: false,
  });

  console.log('🟡 Using SQLite database (local)');
}

// 🔍 Test DB connection early
sequelize
  .authenticate()
  .then(() => console.log('✅ Database connection successful'))
  .catch(err => {
    console.error('❌ Database connection failed:', err);
  });

// 📦 Import models
fs.readdirSync(__dirname)
  .filter(file => file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// 🔗 Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;