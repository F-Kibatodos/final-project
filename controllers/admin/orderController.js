const orderController = {
  getOrders: (req, res) => {
    res.render('admin/orders')
  },
  createOrder: (req, res) => {
    // 新增訂單
  },
  putOrder: (req, res) => {
    // 修改訂單
  },
  deleteOrder: (req, res) => {
    // 刪除訂單
  }
}

module.exports = orderController
