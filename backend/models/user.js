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
    cardHolderName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cardBrand: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cardLast4: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cardExpiryMonth: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cardExpiryYear: {
      type: DataTypes.STRING,
      allowNull: true
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },

  role: {
    type: DataTypes.STRING,
    defaultValue: 'CLIENT',
    validate: {
      isIn: [['CLIENT', 'THERAPIST', 'ADMIN', 'SUPERUSER']]
    }
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
