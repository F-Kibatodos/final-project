const orderController = {
  getOrders: (req, res) => {
    res.render('orders')
  },
  getOrder: (req, res) => {
    res.render('order')
  },
  createOrder: (req, res) => {
    // 新增訂單
  },
  buyNow: (req, res) => {
    // 直接購買
  }
}

module.exports = orderController
