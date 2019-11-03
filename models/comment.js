'use strict'
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      content: DataTypes.TEXT,
      ranking: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      ProductId: DataTypes.INTEGER
    },
    {}
  )
  Comment.associate = function(models) {
    Comment.belongsTo(models.User)
    Comment.belongsTo(models.Product)
    Comment.hasMany(models.Reply)
  }
  return Comment
}
