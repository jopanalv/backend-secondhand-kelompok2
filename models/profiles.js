'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Profiles.init({
    UserId: DataTypes.INTEGER,
    image: DataTypes.STRING,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    no_hp: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profiles',
  });
  return Profiles;
};