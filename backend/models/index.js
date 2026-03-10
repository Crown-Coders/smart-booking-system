'use strict';
 
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
 
const basename = path.basename(__filename);
const db = {};
 
let sequelize;
 
// If DATABASE_URL exists (Render/PostgreSQL)
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} 
// Otherwise use SQLite locally
else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || 'database.sqlite',
    logging: false
  });
}
 
// Import models
fs
  .readdirSync(__dirname)
  .filter(file => file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });
 
// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
 
db.sequelize = sequelize;
db.Sequelize = Sequelize;
 
module.exports = db;