const userController = {
  // ========使用者========
  getUser: (req, res) => {
    res.render('profile')
  },
  editUser: (req, res) => {
    res.render('edit-profile')
  },
  putUser: (req, res) => {
    // 修改使用者資訊
  },
  // ========收件資訊========
  getShippingInfos: (req, res) => {
    res.render('shipping-info')
  },
  createShippingInfo: (req, res) => {
    // 新增收件資訊
  },
  putShippingInfo: (req, res) => {
    // 更改收件資訊
  },
  // ========願望清單========
  getWishlist: (req, res) => {
    res.render('wishlist')
  },
  putWishlist: (req, res) => {
    // 更改願望清單
  },
  addWish: (req, res) => {
    // 新增願望清單品項
  },
  removeWish: (req, res) => {
    // 移除願望清單品項
  },
}

module.exports = userController
