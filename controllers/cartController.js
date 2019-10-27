const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Product = db.Product


const cartController = {
  getCart: (req, res) => {
    return Cart.findByPk(req.session.cartId, { include: [{ model: Product, as: 'CartProducts' }] }).then(cart => {
      cart = cart || { CartProducts: [] }
      let totalPrice = cart.CartProducts.length > 0 ? cart.CartProducts.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      CartItem.sum('quantity', { where: { CartId: req.session.cartId || 0 } }).then(totalQuantity => {
        totalQuantity = totalQuantity || 0
        return res.render('cart', {
          cart,
          totalPrice,
          totalQuantity
        })
      })
    })
  },

  postCart: (req, res) => {
    return Cart.findOrCreate({
      where: {
        id: req.session.cartId || 0,
        name: 'cart'
      },
      default: {
        name: 'cart'
      }
    }).spread(function (cart, created) {
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
      }).spread(function (cartItem, created) {
        return cartItem.update({
          quantity: (cartItem.quantity || 0) + 1,
        })
          .then((cartItem) => {
            req.session.cartId = cart.id
            return req.session.save(() => {
              return res.redirect('back')
            })
          })
      })
    });
  },
  addCartItem: (req, res) => {
    CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.update({
        quantity: cartItem.quantity + 1,
      })
        .then((cartItem) => {
          return res.redirect('back')
        })
    })
  },
  subCartItem: (req, res) => {
    CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.update({
        quantity: cartItem.quantity - 1 >= 1 ? cartItem.quantity - 1 : 1,
      })
        .then((cartItem) => {
          return res.redirect('back')
        })
    })
  },
  deleteCartItem: (req, res) => {
    CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.destroy()
        .then((cartItem) => {
          return res.redirect('back')
        })
    })
  }
}

module.exports = cartController
