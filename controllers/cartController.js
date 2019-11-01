const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Product = db.Product

const cartController = {
  getCart: (req, res) => {
    let buyNowItem = Number(req.query.item) || 'all'
    console.log(buyNowItem)
    return CartItem.findAll({
      where: { CartId: req.session.cartId || 0 },
      include: [{ model: Product }]
    }).then(items => {
      let totalPrice =
        items.length > 0
          ? items.map(d => d.Product.price * d.quantity).reduce((a, b) => a + b)
          : 0
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
    return Cart.findOrCreate({
      where: {
        id: req.session.cartId || 0,
        name: 'cart'
      },
      default: {
        name: 'cart'
      }
    }).spread(function(cart, created) {
      return CartItem.findOrCreate({
        where: {
          CartId: cart.id,
          ProductId: req.body.productId,
          ice: req.body.ice,
          sugar: req.body.sugar,
          quantity: req.body.amount
        },
        default: {
          CartId: cart.id,
          ProductId: req.body.productId,
          ice: req.body.ice,
          sugar: req.body.sugar,
          quantity: req.body.amount
        }
      }).spread(function(cartItem, created) {
        return cartItem
          .update({
            quantity: Number(cartItem.quantity) || 1
          })
          .then(cartItem => {
            req.session.cartId = cart.id
            return req.session.save(() => {
              return res.redirect('back')
            })
          })
      })
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
          sugar: req.body.sugar,
          quantity: req.body.amount
        },
        default: {
          CartId: cart.id,
          ProductId: req.body.productId,
          ice: req.body.ice,
          sugar: req.body.sugar,
          quantity: req.body.amount
        }
      }).spread(function(cartItem, created) {
        return cartItem
          .update({
            quantity: Number(cartItem.quantity) || 1
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
