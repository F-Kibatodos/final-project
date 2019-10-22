const orderController = {
  getOrders: (req, res) => {
    res.render('orders')
  },
  getOrder: (req, res) => {
    res.render('order')
  },
  createOrder: (req, res) => {
    res.render('payment')
  },
  buyNow: (req, res) => {
    // 直接購買
  },
  checkCoupon: (req, res) => {
    // 確認折扣券是否符合
  }
}

module.exports = orderController
