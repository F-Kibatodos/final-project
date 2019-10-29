const db = require('../models')
const Product = db.Product
const Category = db.Category

const productController = {
  getProduct: (req, res) => {
    Product.findByPk(req.params.id, { include: [Category] }).then(product => {
      res.render('product', { product })
    })
  }
}

module.exports = productController
