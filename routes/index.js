// 引進後台 controllers
const adminCouponController = require('../controllers/admin/couponController')
const adminOrderController = require('../controllers/admin/orderController')
const adminReplyController = require('../controllers/admin/replyController')
const adminContactController = require('../controllers/admin/contactController')
const adminCommentController = require('../controllers/admin/commentController')
const adminProductController = require('../controllers/admin/productController')
const adminUserController = require('../controllers/admin/userController')
const adminCategoryController = require('../controllers/admin/categoryController')

// 引進前台 controllers
const userController = require('../controllers/userController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
const commentController = require('../controllers/commentController')
const productController = require('../controllers/productController')
const contactController = require('../controllers/contactController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const { check, validationResult } = require('express-validator')
const displayCategory = require('../config/displayCategories')
const displayPriceMenu = require('../config/displayPriceMenu')
const displaySorMenu = require('../config/displaySort')
const { registerValidator } = require('../config/validator.js')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.role) {
        return next()
      }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }
  app.get('/signup', userController.signUpPage)
  app.post('/signup', registerValidator, userController.signUp)
  app.post(
    '/signin',
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: true
    }),
    userController.signIn
  )
  app.get('/logout', userController.logout)
  // 首頁
  app.get('/', productController.getIndex)
  app.get('/signin', userController.signInPage)
  // 使用者
  app.get('/user/:id', authenticated, userController.getUser)
  app.get('/user/:id/edit', authenticated, userController.editUser)
  app.put(
    '/user/:id',
    [
      check('email')
        .isEmail()
        .withMessage('請輸入正確信箱格式'),
      check('birthday')
        .isISO8601()
        .withMessage('請依照預設格式輸入生日'),
      check('phone')
        .isMobilePhone()
        .withMessage('請輸入正確電話格式')
    ],
    authenticated,
    userController.putUser
  )
  // 單一商品詳情
  app.get('/product/:id', productController.getProduct)
  // 評論
  app.post('/comment', authenticated, commentController.createComment)
  app.put('/comments/:id', authenticated, commentController.putComment)
  // 訂單
  app.get('/orders/', authenticated, orderController.getOrders)
  app.get('/orders/:orderId', authenticated, orderController.getOrder)
  app.post('/order', authenticated, orderController.createOrder)
  app.get(
    '/order/shipping-info',
    authenticated,
    orderController.getOrderShippingInfo
  )
  // 直接購買(query string)
  app.post('/buynow', cartController.buyNow)
  // 出貨資訊
  app.get(
    '/shipping-info/:userId',
    authenticated,
    userController.getShippingInfos
  )
  app.post(
    '/shipping-info/:userId',
    authenticated,
    userController.createShippingInfo
  )
  app.put(
    '/shipping-info/:userId/:id',
    authenticated,
    userController.putShippingInfo
  )
  // 第三方支付後callback
  app.post('/spgateway/callback', orderController.spgatewayCallback)
  // 購物車
  app.get('/cart', cartController.getCart)
  app.post('/cart', cartController.postCart)
  app.post('/cartItem/:id/add', cartController.addCartItem)
  app.post('/cartItem/:id/sub', cartController.subCartItem)
  app.delete('/cartItem/:id', cartController.deleteCartItem)
  //願望清單
  app.get('/wishlist/:userId', authenticated, userController.getWishlist)
  // app.put('/wishlist/:userId', userController.putWishlist)
  app.post('/product/:id', authenticated, userController.addWish)
  app.post('/product/:id/unwish', authenticated, userController.removeWish)

  app.get('/contact', contactController.getContact)
  // 使用折扣券
  app.get('/check-coupon/api', authenticated, orderController.checkCoupon)
  // 後台
  app.get(
    '/admin/users/search',
    authenticatedAdmin,
    adminUserController.searchUsers
  )
  app.get('/admin/users', authenticatedAdmin, adminUserController.getUsers)
  app.put('/admin/users/:id', authenticatedAdmin, adminUserController.putUser)

  // 後台商品
  app.get(
    '/admin/products/search',
    authenticatedAdmin,
    adminProductController.searchProducts
  )
  app.get(
    '/admin/products',
    authenticatedAdmin,
    adminProductController.getProducts
  )
  app.get(
    '/admin/products/create',
    authenticatedAdmin,
    adminProductController.createProducts
  )
  app.get(
    '/admin/products/:id/edit',
    authenticatedAdmin,
    adminProductController.editProduct
  )
  app.post(
    '/admin/products',
    upload.single('image'),
    adminProductController.postProduct
  )
  app.put(
    '/admin/products/:id',
    upload.single('image'),
    adminProductController.putProduct
  )
  app.delete('/admin/products/:id', adminProductController.deleteProduct)
  // 聯絡資訊
  app.put(
    '/admin/contact/edit/:id',
    authenticatedAdmin,
    adminContactController.putContact
  )
  app.get(
    '/admin/contact/edit/:id',
    authenticatedAdmin,
    adminContactController.editContact
  )
  app.get(
    '/admin/contacts',
    authenticatedAdmin,
    adminContactController.getContacts
  )
  app.post(
    '/admin/contact/create',
    authenticatedAdmin,
    adminContactController.postContact
  )
  app.delete(
    '/admin/contacts/:id',
    authenticatedAdmin,
    adminContactController.deleteContact
  )
  // 後台折價券
  app.get(
    '/admin/coupons/search',
    authenticatedAdmin,
    adminCouponController.searchCoupons
  )
  app.get(
    '/admin/coupons',
    authenticatedAdmin,
    adminCouponController.getCoupons
  )
  app.get(
    '/admin/coupons/create',
    authenticatedAdmin,
    adminCouponController.createCoupon
  )
  app.post(
    '/admin/coupons',
    authenticatedAdmin,
    adminCouponController.postCoupon
  )
  app.get(
    '/admin/coupons/:id',
    authenticatedAdmin,
    adminCouponController.getCoupon
  )
  app.put(
    '/admin/coupons/:id',
    authenticatedAdmin,
    adminCouponController.putCoupon
  )
  app.delete(
    '/admin/coupons/:id',
    authenticatedAdmin,
    adminCouponController.deleteCoupon
  )

  // 後台訂單
  app.get(
    '/admin/orders/search',
    authenticatedAdmin,
    adminOrderController.searchOrders
  )
  app.get('/admin/orders', authenticatedAdmin, adminOrderController.getOrders)
  app.get(
    '/admin/orders/edit/:id',
    authenticatedAdmin,
    adminOrderController.editOrder
  )
  /*app.post(
    '/admin/orders',
    authenticatedAdmin,
    adminOrderController.createOrder
  )*/
  app.get(
    '/admin/orders/edit/:id',
    authenticatedAdmin,
    adminOrderController.editOrder
  )
  app.put(
    '/admin/orders/change-shipping-status/:id',
    authenticatedAdmin,
    adminOrderController.changeShippingStatus
  )
  app.put(
    '/admin/orders/:id',
    authenticatedAdmin,
    adminOrderController.putOrder
  )
  app.delete(
    '/admin/orders/:id',
    authenticatedAdmin,
    adminOrderController.deleteOrder
  )

  // reply
  app.post('/admin/reply', authenticatedAdmin, adminReplyController.createReply)
  app.put(
    '/admin/replies/:id',
    authenticatedAdmin,
    adminReplyController.putReply
  )
  app.delete(
    '/admin/replies/:id',
    authenticatedAdmin,
    adminReplyController.deleteReply
  )

  // 後台種類
  app.get(
    '/admin/categories',
    authenticatedAdmin,
    adminCategoryController.getCategories
  )
  app.post(
    '/admin/categories',
    authenticatedAdmin,
    adminCategoryController.postCategory
  )
  app.get(
    '/admin/categories/search',
    authenticatedAdmin,
    adminCategoryController.searchCategories
  )
  app.get(
    '/admin/categories/:id',
    authenticatedAdmin,
    adminCategoryController.getCategories
  )
  app.put(
    '/admin/categories/:id',
    authenticatedAdmin,
    adminCategoryController.putCategory
  )
  app.delete(
    '/admin/categories/:id',
    authenticatedAdmin,
    adminCategoryController.deleteCategory
  )

  // 後台評論
  app.get(
    '/admin/comments',
    authenticatedAdmin,
    adminCommentController.getComments
  )
  app.delete(
    '/admin/comments/:id',
    authenticatedAdmin,
    adminCommentController.deleteComment
  )
  app.get(
    '/admin/comments/search',
    authenticatedAdmin,
    adminCommentController.searchComments
  )

  // 最後無法批配的，全部導向404畫面
  app.get('*', function(req, res) {
    res.render('404', { style: '404.css', js: 'refresh-to-index.js' })
  })
}
