// models/payment.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Booking, {
        foreignKey: "bookingId",
        as: "booking",
      });
      Payment.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    }
  }
  Payment.init(
    {
      amount: DataTypes.DECIMAL,
      currency: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"),
        defaultValue: "PENDING",
      },
      transactionReference: DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Payment",
    },
  );
  return Payment;
};
