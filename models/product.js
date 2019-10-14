'use strict'
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.INTEGER,
      image: DataTypes.STRING,
      CategoryId: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      stock_warning: DataTypes.INTEGER
    },
    {}
  )
  Product.associate = function(models) {
    Product.belongsTo(models.Category)
    Product.belongsToMany(mdoels.User, {
      through: models.WishItem,
      foreignKey: 'ProductId',
      as: WishedUsers
    })
    Product.belongsToMany(mdoels.Order, {
      through: models.WishItem,
      foreignKey: 'ProductId',
      as: OfOrders
    })
    Product.belongsToMany(mdoels.Cart, {
      through: models.CartItem,
      foreignKey: 'ProductId',
      as: OfCarts
    })
  }
  return Product
}
