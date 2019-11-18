const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../../models')
const Product = db.Product
const Category = db.Category
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const productController = {
  getProducts: (req, res) => {
    Product.findAll({ include: [Category], order: [['name', 'ASC']] }).then(
      products => {
        const data = products.map(product => {
          return {
            ...product.dataValues
          }
        })
        return res.render('admin/products', { products: data })
      })
  },
  createProducts: (req, res) => {
    Category.findAll().then(categories => {
      res.render('admin/createProducts', { categories })
    })
  },
  editProduct: (req, res) => {
    return Product.findByPk(req.params.id).then(product => {
      Category.findAll().then(categories => {
        return res.render('admin/createProducts', {
          categories,
          product
        })
      })
    })
  },
  postProduct: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { name, price, description, categoryId } = req.body
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        //console.log(err)
        return Product.create({
          name: name,
          description: description,
          price: price,
          CategoryId: categoryId,
          image: file ? img.data.link : null,
          rating: 0,
          available: Number(req.body.available)
        })
          .then(product => {
            console.log(categoryId)
            req.flash('success_messages', 'product was successfully created')
            return res.redirect('/admin/products')
          })
          .catch(err => {
            console.log(err)
          })
      })
    } else {
      return Product.create({
        name: name,
        description: description,
        price: price,
        CategoryId: categoryId,
        image: null,
        rating: 0,
        available: Number(req.body.available)
      })
        .then(product => {
          console.log(categoryId)
          req.flash('success_messages', 'product was successfully created')
          return res.redirect('/admin/products')
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  putProduct: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { name, price, description, categoryId } = req.body
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Product.findByPk(req.params.id).then(product => {
          product
            .update({
              name: name,
              description: description,
              price: price,
              CategoryId: categoryId,
              image: file ? img.data.link : product.image,
              available: Number(req.body.available)
            })
            .then(product => {
              req.flash(
                'success_messages',
                'product was successfully to update'
              )
              res.redirect('/admin/products')
            })
        })
      })
    } else
      return Product.findByPk(req.params.id).then(product => {
        product
          .update({
            name: name,
            description: description,
            price: price,
            CategoryId: categoryId,
            image: product.image,
            available: Number(req.body.available)
          })
          .then(product => {
            req.flash('success_messages', 'product was successfully to update')
            res.redirect('/admin/products')
          })
      })
  },
  deleteProduct: (req, res) => {
    return Product.findByPk(req.params.id)
      .then(product => {
        product.destroy()
          .then(product => {
            req.flash('error_messages', `${product.name} 已被刪除`)
            res.redirect('/admin/products')
          })
      })
  },
  searchProducts: (req, res) => {
    Product.findAll({
      include: [Category],
      order: [['name', 'ASC']],
      where: {
        [Op.or]: {
          name: { [Op.like]: '%' + req.query.q + '%' },
          '$Category.name$': { [Op.like]: '%' + req.query.q + '%' }
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
