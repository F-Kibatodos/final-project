'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    name: DataTypes.STRING
  }, {});
  Cart.associate = function (models) {
    Cart.belongsToMany(models.Product, {
      through: models.CartItem,
      foreignKey: 'CartId',
      as: 'CartProducts'
    })
  };
  return Cart;
};