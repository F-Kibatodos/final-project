'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    ice: DataTypes.STRING,
    sugar: DataTypes.STRING,
    OrderId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER
  }, {});
  OrderItem.associate = function (models) {
    OrderItem.belongsTo(models.Product)
  };
  return OrderItem;
};