const db = require('../../models')
const Coupon = db.Coupon
const Discount = db.Discount
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const moment = require('moment')

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
    return res.render('admin/edit-coupon')
  },
  postCoupon: (req, res) => {
    let { code, description, startDate, endDate, limit, figure } = req.body
    if (!/^[^\s]+([^\s]+)*$/g.test(code)) {
      req.flash('error_messages', '請填入折扣碼代號')
      return res.redirect('back')
    }
    if (moment(endDate).isBefore(startDate)) {
      req.flash('error_messages', '結束日期要大於起始日期')
      return res.redirect('back')
    }
    if ((limit < 0) || (figure < 0)) {
      req.flash('error_messages', '請檢查填入的金額數字需大於0')
      return res.redirect('back')
    }
    if (description === "% off") {
      if (Number(figure) > 100) {
        req.flash('error_messages', '折扣％需小於100%')
        return res.redirect('back')
      }
    }
    if (description === "minus") {
      if (Number(limit) < Number(figure)) {
        req.flash('error_messages', '滿X元折Y元，其中X必須大於Y')
        return res.redirect('back')
      }
    }
    if (Number.isInteger(Number(limit)) && Number.isInteger(Number(figure))) {
      startDate = moment(startDate).format('YYYY-MM-DD 00:00:00')
      endDate = moment(endDate).format('YYYY-MM-DD 23:59:59')
      Discount.create({
        description: description,
        limit: limit,
        figure: figure
      }).then(discount => {
        Coupon.create({
          code: code,
          start_date: startDate,
          end_date: endDate,
          DiscountId: discount.id
        }).then(coupon => {
          req.flash('success_messages', '折扣券新增成功')
          res.redirect('/admin/coupons')
        })
      })
    } else {
      req.flash('error_messages', '請檢查輸入的數字是否皆為正整數')
      return res.redirect('back')
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
    let { code, description, startDate, endDate, limit, figure } = req.body
    if (!/^[^\s]+([^\s]+)*$/g.test(code)) {
      req.flash('error_messages', '請填入折扣碼代號')
      return res.redirect('back')
    }
    if (moment(endDate).isBefore(startDate)) {
      req.flash('error_messages', '結束日期要大於起始日期')
      return res.redirect('back')
    }
    if ((limit < 0) || (figure < 0)) {
      req.flash('error_messages', '請檢查填入的金額數字需大於0')
      return res.redirect('back')
    }
    if (description === "% off") {
      if (Number(figure) > 100) {
        req.flash('error_messages', '折扣％需小於100%')
        return res.redirect('back')
      }
    }
    if (description === "minus") {
      if (Number(limit) < Number(figure)) {
        req.flash('error_messages', '滿X元折Y元，其中X必須大於Y')
        return res.redirect('back')
      }
    }
    if (Number.isInteger(Number(limit)) && Number.isInteger(Number(figure))) {
      startDate = moment(startDate).format('YYYY-MM-DD 00:00:00')
      endDate = moment(endDate).format('YYYY-MM-DD 23:59:59')
      Coupon.findByPk(req.params.id, { include: [Discount] })
        .then(coupon => {
          coupon.update({
            code: code,
            start_date: startDate,
            end_date: endDate
          }).then(coupon => {
            Discount.findByPk(coupon.DiscountId).then(discount => {
              discount.update({
                description: description,
                limit: limit,
                figure: figure
              })
            }).then(discount => {
              req.flash('success_messages', '折扣券已更新')
              res.redirect('/admin/coupons')
            })
          })
        })
    } else {
      req.flash('error_messages', '請檢查輸入的數字是否皆為正整數')
      return res.redirect('back')
    }
  },
  deleteCoupon: (req, res) => {
    return Coupon.findByPk(req.params.id, { include: [Discount] })
      .then(coupon => {
        coupon.destroy()
          .then(coupon => {
            Discount.findByPk(coupon.DiscountId).then(discount => {
              discount.destroy()
                .then(discount => {
                  req.flash('error_messages', '折扣券已成功刪除')
                  return res.redirect('/admin/coupons')
                })
            })
          })
      })
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
