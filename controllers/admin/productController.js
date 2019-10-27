const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'your_client_id'
const db = require('../../models')
const Product = db.Product
const Category = db.Category

const productController = {
  getProducts: (req, res) => {
    res.render('admin/products')
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
        return Product.create({
          name: name,
          description: description,
          price: price,
          CategoryId: categoryId
          //image: file ? img.data.link : null
        })
          .then(restaurant => {
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
        CategoryId: categoryId
        //image: null
      })
        .then(restaurant => {
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
              CategoryId: categoryId
              //image: file ? img.data.link : product.image
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
            CategoryId: categoryId
            //image: product.image
          })
          .then(product => {
            req.flash('success_messages', 'product was successfully to update')
            res.redirect('/admin/products')
          })
      })
  },
  deleteProduct: (req, res) => {
    // 刪除商品
  }
}

module.exports = productController
