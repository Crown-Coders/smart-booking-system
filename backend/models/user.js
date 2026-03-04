'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    idNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },

    role: {
      type: DataTypes.ENUM('CLIENT', 'THERAPIST', 'ADMIN', 'SUPERUSER'),
      defaultValue: 'CLIENT'
    },

    // Django-style fields
    isStaff: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    isSuperUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }

  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
