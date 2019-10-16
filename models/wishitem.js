'use strict';
module.exports = (sequelize, DataTypes) => {
  const WishItem = sequelize.define('WishItem', {
    UserId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER
  }, {});
  WishItem.associate = function(models) {
    // associations can be defined here
  };
  return WishItem;
};