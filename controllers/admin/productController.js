const db = require('../../models')
const Product = db.Product
const Category = db.Category
const Sequelize = require('sequelize')
const Op = Sequelize.Op

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
  },
  searchProducts: (req, res) => {
    Product.findAll({
      include: [Category],
      order: [['name', 'ASC']],
      where: {
        [Op.or]: {
          name:
            { [Op.like]: '%' + req.query.q + '%' },
          '$Category.name$':
            { [Op.like]: '%' + req.query.q + '%' }
        }
      }
    }).then(products => {
      const data = products.map(product => {
        return {
          ...product.dataValues
        }
      })
      return res.render('admin/products', { products: data })
    })
  }
}

module.exports = productController
