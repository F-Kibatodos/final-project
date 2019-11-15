const db = require('../../models')
const User = db.User
const Product = db.Product
const Order = db.Order
const OrderItem = db.OrderItem
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
  editOrder: (req, res) => {
    Order.findByPk(req.params.id).then(order => {
      OrderItem.findAll({
        where: { OrderId: order.id }, include: [Product], attributes: ['id', 'ice', 'sugar']
      }).then(items => {
        res.render('admin/edit-order', { items: items, order: order })
      })
    })
  },
  putOrder: (req, res) => {
    Order.findByPk(req.params.id)
      .then(order => {
        OrderItem.findAll({
          where: { OrderId: req.params.id }, attributes: ['id', 'ice', 'sugar']
        }).then(items => {
          for (var i = 0; i < items.length; i++) {
            console.log(order.id, items[i].id)
            let temp1 = 'ice' + items[i].id
            let temp2 = 'sugar' + items[i].id
            OrderItem.findOne({ where: { 'id': items[i].id } }).then(item => {
              item.update({
                ice: req.body[temp1],
                sugar: req.body[temp2]
              })
            })
          }
          req.flash('success_messages', `訂單 ${order.sn} 已更新`)
          res.redirect('/admin/orders')
        })
      })
  },
  deleteOrder: (req, res) => {
    return Order.findByPk(req.params.id)
      .then(order => {
        order.destroy()
          .then(order => {
            req.flash('error_messages', `${order.name} 已被刪除`)
            res.redirect('/admin/orders')
          })
      })
  },
  searchOrders: (req, res) => {
    Order.findAll({
      include: [User],
      order: [['sn', 'ASC']],
      where: {
        [Op.or]: [
          { '$User.name$': { [Op.like]: '%' + req.query.q + '%' } },
          { 'sn': Number(req.query.q) }
        ]
      }
    }).then(orders => {
      const data = orders.map(order => {
        return {
          ...order.dataValues
        }
      })
      return res.render('admin/orders', { orders: data })
    })
  },
  changeShippingStatus: (req, res) => {
    Order.findByPk(req.params.id).then(order => {
      if (req.body.shippingStatus === '0') {
        order.update({
          shipping_status: 1
        }).then(order => {
          req.flash('success_messages', `訂單 ${order.sn} 已更新成「已送達」`)
          res.redirect('/admin/orders')
        })
      } else {
        order.update({
          shipping_status: 0
        }).then(order => {
          req.flash('success_messages', `訂單 ${order.sn} 已更新成「運輸中」`)
          res.redirect('/admin/orders')
        })
      }
    })
  }
}

module.exports = orderController
