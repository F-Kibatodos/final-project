'use strict';
module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define('Coupon', {
    code: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    DiscountId: DataTypes.INTEGER
  }, {});
  Coupon.associate = function(models) {
    // associations can be defined here
  };
  return Coupon;
};