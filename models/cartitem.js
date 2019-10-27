'use strict';
module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: DataTypes.INTEGER,
    ice: DataTypes.STRING,
    sugar: DataTypes.STRING,
    CartId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER
  }, {});
  CartItem.associate = function (models) {
    // associations can be defined here
  };
  return CartItem;
};