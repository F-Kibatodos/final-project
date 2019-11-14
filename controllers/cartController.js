const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Product = db.Product

const cartController = {
  getCart: (req, res) => {
    let buyNowItem = Number(req.query.item) || 'all'
    return CartItem.findAll({
      where: { CartId: req.session.cartId || 0 },
      include: [{ model: Product }]
    }).then(items => {
      let totalPrice =
        items.length > 0
          ? items.map(d => d.Product.price * d.quantity).reduce((a, b) => a + b)
          : 0
      if (items.length > 0) {
        items.map(item => {
          item.Product.isWished = req.user
            ? req.user.WishProducts
              ? req.user.WishProducts.map(d => d.id).includes(item.Product.id)
              : req.user.WishProducts
            : false
        })
      }
      CartItem.sum('quantity', {
        where: { CartId: req.session.cartId || 0 }
      }).then(totalQuantity => {
        totalQuantity = totalQuantity || 0
        return res.render('cart', {
          items,
          buyNowItem,
          totalPrice,
          totalQuantity,
          js: 'cart.js',
          style: 'cart.css'
        })
      })
    })
  },

  postCart: (req, res) => {
    if (req.body.amount <= 0) {
      req.flash('error_messages', '至少需買一杯')
      return res.redirect('back')
    }
    return Cart.findOrCreate({
      where: {
        id: req.session.cartId || 0,
        name: 'cart'
      },
      default: {
        name: 'cart'
      }
    })
      .spread(function(cart, created) {
        return CartItem.findOrCreate({
          where: {
            CartId: cart.id,
            ProductId: req.body.productId,
            ice: req.body.ice,
            sugar: req.body.sugar
          },
          default: {
            CartId: cart.id,
            ProductId: req.body.productId,
            ice: req.body.ice,
            sugar: req.body.sugar
          }
        })
          .spread(function(cartItem, created) {
            return cartItem
              .update({
                quantity: cartItem.quantity
                  ? Number(cartItem.quantity) + Number(req.body.amount) || 1
                  : Number(req.body.amount)
              })
              .then(cartItem => {
                req.session.cartId = cart.id
                return req.session.save(() => {
                  return res.redirect('back')
                })

                  .then(totalQuantity => {
                    totalQuantity = totalQuantity || 0
                    req.session.cartId = cart.id
                    req.session.cart_number = totalQuantity
                    return req.session.save(() => {
                      req.flash('success_messages', '已加入購物車')
                      return res.redirect('back')
                    })
                  })
                  .catch(err => {
                    console.log(err)
                  })
              })
              .catch(err => {
                console.log(err)
              })
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
      })
  },
  addCartItem: (req, res) => {
    CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem
        .update({
          quantity: cartItem.quantity + 1
        })
        .then(cartItem => {
          return res.redirect('back')
        })
    })
  },
  subCartItem: (req, res) => {
    CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem
        .update({
          quantity: cartItem.quantity - 1 >= 1 ? cartItem.quantity - 1 : 1
        })
        .then(cartItem => {
          return res.redirect('back')
        })
    })
  },
  deleteCartItem: (req, res) => {
    CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.destroy().then(cartItem => {
        return res.redirect('back')
      })
    })
  },
  buyNow: (req, res) => {
    if (req.body.amount <= 0) {
      req.flash('error_messages', '至少需買一杯')
      return res.redirect('back')
    }
    return Cart.findOrCreate({
      where: {
        id: req.session.cartId || 0,
        name: 'cart'
      },
      default: {
        name: 'cart'
      }
    }).spread(function(cart, created) {
      console.log(req.body.amount)
      return CartItem.findOrCreate({
        where: {
          CartId: cart.id,
          ProductId: req.body.productId,
          ice: req.body.ice,
          sugar: req.body.sugar
        },
        default: {
          CartId: cart.id,
          ProductId: req.body.productId,
          ice: req.body.ice,
          sugar: req.body.sugar
        }
      }).spread(function(cartItem, created) {
        return cartItem
          .update({
            quantity: cartItem.quantity
              ? Number(cartItem.quantity) + Number(req.body.amount)
              : Number(req.body.amount)
          })
          .then(cartItem => {
            req.session.cartId = cart.id
            return req.session.save(() => {
              return res.redirect(`/cart?item=${cartItem.id}`)
            })
          })
      })
    })
  }
}

module.exports = cartController

