'use strict'
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.INTEGER,
      image: DataTypes.STRING,
      CategoryId: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      stock_warning: DataTypes.INTEGER,
      rating: DataTypes.REAL(5, 2),
      available: DataTypes.BOOLEAN
    },
    {}
  )
  Product.associate = function(models) {
    Product.belongsTo(models.Category)
    Product.belongsToMany(models.User, {
      through: models.WishItem,
      foreignKey: 'ProductId',
      as: 'WishedUsers'
    })
    Product.belongsToMany(models.Order, {
      through: models.OrderItem,
      foreignKey: 'ProductId',
      as: 'OfOrders'
    })
    Product.belongsToMany(models.Cart, {
      through: models.CartItem,
      foreignKey: 'ProductId',
      as: 'OfCarts'
    })
    Product.hasMany(models.CartItem)
    Product.hasMany(models.OrderItem)
  }
  return Product
}
