const db = require('../models')
const Product = db.Product
const Category = db.Category
const Comment = db.Comment
const User = db.User
const Reply = db.Reply

const productController = {
  getProduct: (req, res) => {
    const rank = [1, 2, 3, 4, 5]
    Product.findByPk(req.params.id, { include: [Category] }).then(product => {
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
          modComments
        })
      })
    })
  }
}

module.exports = productController
