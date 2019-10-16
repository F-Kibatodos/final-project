'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define(
    'Reply',
    {
      content: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
      CommentId: DataTypes.INTEGER
    },
    {}
  )
  Reply.associate = function(models) {
    Reply.belongsToMany(models.User)
    Reply.belongsToMany(models.Comment)
  }
  return Reply
}
