'use strict';
module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define('Discount', {
    description: DataTypes.STRING
  }, {});
  Discount.associate = function(models) {
    // associations can be defined here
  };
  return Discount;
};