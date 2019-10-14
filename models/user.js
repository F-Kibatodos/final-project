'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.BOOLEAN,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    birthday: DataTypes.DATE
  }, {});
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.ShippingAddress)
    User.hasMany(models.Order)
    User.belongsToMany(models.Coupon, {
      through: models.UserCoupon,
      foreignKey: 'UserId',
      as: 'OwnCoupons'
    })
  };
  return User;
};