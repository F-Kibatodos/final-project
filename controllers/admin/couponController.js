const db = require('../../models')
const Coupon = db.Coupon
const Discount = db.Discount

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
    //res.render('admin/coupons')
  },
  createCoupon: (req, res) => {
    // 新增折價券
  },
  putCoupon: (req, res) => {
    // 修改折價券
  },
  deleteCoupon: (req, res) => {
    // 刪除折價券
  }
}

module.exports = couponController
