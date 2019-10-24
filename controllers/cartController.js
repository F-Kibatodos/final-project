const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Product = db.Product

const cartController = {
  getCart: (req, res) => {
    return Cart.findOne({ where: { id: '1' } }, { include: [{ model: Product, as: 'CartProducts' }] }).then(cart => {
      res.render('cart', { cart })
    })
  },
  putCart: (req, res) => {
    // 更新購物車
  },
  deleteCartItem: (req, res) => {
    // 刪除購物車品項
  }
}

module.exports = cartController
