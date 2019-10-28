const db = require('../../models')
const Coupon = db.Coupon
const Discount = db.Discount
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const couponController = {
  getCoupons: (req, res) => {
    Coupon.findAll({ include: [Discount] })
      .then((coupons) => {
        const data = coupons.map(coupon => {
          return {
            ...coupon.dataValues
          }
        })
        return res.render('admin/coupons', { coupons: data })
      })
  },
  createCoupon: (req, res) => {
    // 新增折價券
  },
  putCoupon: (req, res) => {
    // 修改折價券
  },
  deleteCoupon: (req, res) => {
    // 刪除折價券
  },
  searchCoupons: (req, res) => {
    Coupon.findAll({
      include: [Discount],
      order: [['code', 'ASC']],
      where: {
        [Op.or]: {
          code:
            { [Op.like]: '%' + req.query.q + '%' },
          '$Discount.description$':
            { [Op.like]: '%' + req.query.q + '%' }
        }
      }
    }).then(coupons => {
      const data = coupons.map(coupon => {
        return {
          ...coupon.dataValues
        }
      })
      return res.render('admin/coupons', { coupons: data })
    })
  }
}

module.exports = couponController
