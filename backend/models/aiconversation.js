'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AIConversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AIConversation.init({
    userId: DataTypes.INTEGER,
    sessionId: DataTypes.STRING,
    message: DataTypes.TEXT,
    response: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'AIConversation',
  });
  return AIConversation;
};