const db = require('../../models')
const Product = db.Product
const Category = db.Category

const productController = {
  getProducts: (req, res) => {
    Product.findAll({ include: [Category], order: [['name', 'ASC']] })
      .then((products) => {
        const data = products.map(product => {
          return {
            ...product.dataValues
          }
        })
        return res.render('admin/products', { products: data })
      })
  },
  createProducts: (req, res) => {
    res.render('admin/createProducts')
  },
  editProduct: (req, res) => {
    res.render('admin/editProduct')
  },
  createProduct: (req, res) => {
    // 新增商品
  },
  putProduct: (req, res) => {
    // 修改商品
  },
  deleteProduct: (req, res) => {
    // 刪除商品
  }
}

module.exports = productController
