const db = require('../models')
const Product = db.Product
const Category = db.Category
const Comment = db.Comment
const User = db.User
const Reply = db.Reply
const displayCategory = require('../config/displayCategories')
const displayPriceMenu = require('../config/displayPriceMenu')
const displaySorMenu = require('../config/displaySort')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const productController = {
  getIndex: (req, res) => {
    const sugar = ['無糖', '微糖', '半糖', '少糖']
    const ice = ['去冰', '少冰']
    const priceRange = [
      { forQuery: '0,30', forOption: '30元以下' },
      { forQuery: '31,40', forOption: '31-40元' },
      { forQuery: '41,50', forOption: '41-50元' },
      { forQuery: '51,60', forOption: '51-60元' },
      { forQuery: '61,100', forOption: '60元以上' }
    ]
    let sortKey = req.query.sortKey || 'price'
    let sortValue = req.query.sortValue || 'DESC'
    let sortOption
    let displaySort = displaySorMenu(sortKey, sortValue, sortOption)
    let categoryFilter = req.query.category
    let where = {}
    if (categoryFilter) where.CategoryId = categoryFilter
    let price = req.query.priceRange
    let priceFilterMenu = displayPriceMenu(price)
    if (price) {
      price = JSON.parse('[' + price + ']')
      where.price = { [Op.between]: price }
    }
    let search = req.query.search
    if (search) where.name = { [Op.like]: '%' + search + '%' }
    let categoryFilterMenu = displayCategory(categoryFilter)
    const rating = 90
    Product.findAll({
      include: [Category, { model: User, as: 'WishedUsers' }],
      order: [[sortKey, sortValue]],
      where
    }).then(products => {
      const drinks = products.map(drink => ({
        ...drink.dataValues,
        description: drink.dataValues.description
          ? drink.dataValues.description.substring(0, 17)
          : '',
        isWished: req.user
          ? req.user.WishProducts
            ? req.user.WishProducts.map(d => d.id).includes(drink.id)
            : req.user.WishProducts
          : false
      }))
      Category.findAll().then(category => {
        res.render('index', {
          drinks,
          category,
          price,
          categoryFilter,
          priceRange,
          search,
          categoryFilterMenu: categoryFilterMenu || '所有分類',
          priceFilterMenu: priceFilterMenu || '所有價格',
          js: 'indexPage.js',
          displaySort,
          style: 'home.css',
          sugar,
          ice
        })
      })
    })
  },
  getProduct: (req, res) => {
    const sugar = ['無糖', '微糖', '半糖', '少糖']
    const ice = ['去冰', '少冰']
    const rank = [1, 2, 3, 4, 5]
    Product.findByPk(req.params.id, { include: [Category] }).then(product => {
      const amount = product.price * req.body.amount
      const isLiked = req.user
        ? req.user.WishProducts
          ? req.user.WishProducts.map(d => d.id).includes(product.id)
          : req.user.WishProducts
        : false
      Comment.findAll({
        where: { ProductId: req.params.id },
        include: [User, { model: Reply, include: [User] }]
      }).then(comments => {
        modComments = comments.map(comment => ({
          ...comment.dataValues,
          ranking: (comment.dataValues.ranking / 5) * 100
        }))
        res.render('product', {
          product,
          rank,
          style: 'product.css',
          js: 'product.js',
          modComments,
          sugar,
          ice,
          isLiked
        })
      })
    })
  }
}

module.exports = productController
