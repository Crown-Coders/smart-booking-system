'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AvailabilitySlot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AvailabilitySlot.init({
    therapistId: DataTypes.INTEGER,
    bookingId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
    isBooked: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'AvailabilitySlot',
  });
  return AvailabilitySlot;
};
