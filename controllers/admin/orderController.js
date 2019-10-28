const db = require('../../models')
const User = db.User
const Order = db.Order
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const orderController = {
  getOrders: (req, res) => {
    Order.findAll({ include: [User] })
      .then((orders) => {
        const data = orders.map(order => {
          return {
            ...order.dataValues
          }
        })
        return res.render('admin/orders', { orders: data })
      })
  },
  createOrder: (req, res) => {
    // 新增訂單
  },
  putOrder: (req, res) => {
    // 修改訂單
  },
  deleteOrder: (req, res) => {
    // 刪除訂單
  },
  searchOrders: (req, res) => {
    Order.findAll({
      include: [User],
      order: [['sn', 'ASC']],
      where: {
        [Op.or]: {
          sn:
            { [Op.like]: '%' + req.query.q + '%' },
          '$User.name$':
            { [Op.like]: '%' + req.query.q + '%' }
        }
      }
    }).then(orders => {
      const data = orders.map(order => {
        return {
          ...order.dataValues
        }
      })
      return res.render('admin/orders', { orders: data })
    })
  }
}

module.exports = orderController
