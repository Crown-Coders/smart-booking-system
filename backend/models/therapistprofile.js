'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TherapistProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // e.g., TherapistProfile.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  TherapistProfile.init(
    {
      userId: DataTypes.INTEGER,
      qualification: DataTypes.STRING,
      yearsOfExperience: DataTypes.INTEGER,
      licenseNumber: DataTypes.STRING,
      specialization: DataTypes.STRING,
      bio: DataTypes.TEXT,
      image: DataTypes.STRING, // ✅ use DataTypes here, not Sequelize
    },
    {
      sequelize,
      modelName: 'TherapistProfile',
    }
  );

  return TherapistProfile;
};
