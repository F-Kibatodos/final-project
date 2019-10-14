'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    content: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    CommentId: DataTypes.INTEGER
  }, {});
  Reply.associate = function(models) {
    // associations can be defined here
  };
  return Reply;
};