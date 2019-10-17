const couponController = {
  getCoupons: (req, res) => {
    res.render('admin/coupons')
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
