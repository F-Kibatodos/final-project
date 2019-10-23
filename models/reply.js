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
  Reply.associate = function (models) {
    Reply.belongsTo(models.User)
    Reply.belongsTo(models.Comment)
  }
  return Reply
}
