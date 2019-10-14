'use strict';
module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define('Coupon', {
    code: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    DiscountId: DataTypes.INTEGER
  }, {});
  Coupon.associate = function (models) {
    Coupon.hasMany(models.Order)
    Coupon.belongsTo(models.Discount)
    Coupon.belongsToMany(models.User, {
      through: models.UserCoupon,
      foreignKey: 'CouponId',
      as: 'CouponUsers'
    })
  };
  return Coupon;
};