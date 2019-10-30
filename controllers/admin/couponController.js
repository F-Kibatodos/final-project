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
    let { code, description, limit, figure } = req.body
    if (!/^[^\s]+([^\s]+)*$/g.test(code)) {
      req.flash('error_messages', '請填入折扣碼代號')
      return res.redirect('back')
    }
    if (limit < 0) {
      req.flash('error_messages', '最低啟用條件需大於0')
      return res.redirect('back')
    }
    if (!/^[0-9]+[0-9]*$/.test(figure)) {
      req.flash('error_messages', '折扣％和折扣金額需大於0')
      return res.redirect('back')
    }
    if (description === "minus") {
      if (Number(limit) < Number(figure)) {
        req.flash('error_messages', '滿X元折Y元，其中X必須大於Y')
        return res.redirect('back')
      }
    }

  },
  getCoupon: (req, res) => {
    Coupon.findByPk(req.params.id, { include: [Discount] })
      .then(coupon => {
        let type = coupon.Discount.description
        return res.render('admin/edit-coupon', { coupon: coupon, js: 'admin-edit-coupon.js', type: type })
      })
  },
  putCoupon: (req, res) => {
    // 修改折價券
    let { code, description, limit, figure } = req.body
    if (!/^[^\s]+([^\s]+)*$/g.test(code)) {
      req.flash('error_messages', '請填入折扣碼代號')
      return res.redirect('back')
    }
    if (limit < 0) {
      req.flash('error_messages', '最低啟用條件需大於0')
      return res.redirect('back')
    }
    if (!/^[0-9]+[0-9]*$/.test(figure)) {
      req.flash('error_messages', '折扣％和折扣金額需大於0')
      return res.redirect('back')
    }
    if (description === "minus") {
      if (Number(limit) < Number(figure)) {
        req.flash('error_messages', '滿X元折Y元，其中X必須大於Y')
        return res.redirect('back')
      }
    }


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
