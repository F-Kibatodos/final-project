'use strict';
module.exports = (sequelize, DataTypes) => {
  const BranchAddress = sequelize.define('BranchAddress', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    facebook_site: DataTypes.STRING,
    line_site: DataTypes.STRING,
    email_site: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {});
  BranchAddress.associate = function (models) {
    BranchAddress.belongsTo(models.User)
  };
  return BranchAddress;
};