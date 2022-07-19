'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Products);
      // this.belongsTo(models.Profiles);
    }
  }
  Wishlist.init({
    BuyerId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    SellerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Wishlist',
  });
  return Wishlist;
};