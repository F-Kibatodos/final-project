'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    sn: DataTypes.BIGINT,
    amount: DataTypes.INTEGER,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    shipping_status: DataTypes.STRING,
    shipping_method: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    CouponId: DataTypes.INTEGER
  }, {});
  Order.associate = function (models) {
    // associations can be defined here
    Order.belongsTo(models.User)
    Order.belongsTo(models.Coupon)
    Order.hasMany(models.Payment)
  };
  return Order;
};