'use strict';
module.exports = (sequelize, DataTypes) => {
  const ShippingAddress = sequelize.define('ShippingAddress', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {});
  ShippingAddress.associate = function(models) {
    // associations can be defined here
  };
  return ShippingAddress;
};