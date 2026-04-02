"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: "clientId",
        as: "client",
      });

      Booking.belongsTo(models.User, {
        foreignKey: "therapistId",
        as: "therapist",
      });

      Booking.hasOne(models.Payment, {
        foreignKey: "bookingId",
        as: "payment",
      });
    }
  }

  Booking.init(
    {
      clientId: DataTypes.INTEGER,
      therapistId: DataTypes.INTEGER,
      bookingDate: DataTypes.DATEONLY,
      startTime: DataTypes.TIME,
      endTime: DataTypes.TIME,
      serviceId: DataTypes.INTEGER,
      availabilitySlotId: DataTypes.INTEGER,
      status: {
        type: DataTypes.ENUM("PENDING", "CONFIRMED", "CANCELLED"),
        defaultValue: "PENDING",
      },
      notes: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Booking",
    },
  );

  return Booking;
};
