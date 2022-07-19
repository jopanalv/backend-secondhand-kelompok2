"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Users);

      this.hasMany(models.Products, {
        foreignKey: "ProfileId",
      });

      this.hasMany(models.Transactions, {
        foreignKey: "ProfileId",
      });

      // this.hasMany(models.Wishlist, {
      //   foreignKey: "SellerId",
      // });
    }
  }
  Profiles.init(
    {
      UserId: DataTypes.INTEGER,
      image: DataTypes.STRING,
      name: DataTypes.STRING,
      city: DataTypes.STRING,
      address: DataTypes.STRING,
      no_hp: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Profiles",
    }
  );
  return Profiles;
};
