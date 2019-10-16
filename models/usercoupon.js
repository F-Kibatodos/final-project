'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserCoupon = sequelize.define('UserCoupon', {
    UserId: DataTypes.INTEGER,
    CouponId: DataTypes.INTEGER
  }, {});
  UserCoupon.associate = function(models) {
    // associations can be defined here
  };
  return UserCoupon;
};