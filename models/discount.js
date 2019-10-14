'use strict';
module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define('Discount', {
    description: DataTypes.STRING
  }, {});
  Discount.associate = function (models) {
    Discount.hasMany(models.Coupon)
  };
  return Discount;
};