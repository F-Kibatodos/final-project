// 引進後台 controllers
const adminCouponController = require('../controllers/admin/couponController')
const adminOrderController = require('../controllers/admin/orderController')
const adminReplyController = require('../controllers/admin/replyController')
const adminContactController = require('../controllers/admin/contactController')
const adminCommentController = require('../controllers/admin/commentController')
const adminProductController = require('../controllers/admin/productController')
const adminUserController = require('../controllers/admin/userController')

// 引進前台 controllers
const userController = require('../controllers/userController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
const commentController = require('../controllers/commentController')
const productController = require('../controllers/productController')
const contactController = require('../controllers/contactController')
const db = require('../models')
const Category = db.Category
const Product = db.Product
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const displayCategory = require('../config/displayCategories')
const displayPriceMenu = require('../config/displayPriceMenu')

module.exports = app => {
  // 首頁
  app.get('/', (req, res) => {
    const priceRange = [[0, 30], [31, 40], [41, 50], [51, 60], [61, 100]]
    let sortKey = req.query.sortKey || 'price'
    let sortValue = req.query.sortValue || 'DESC'
    let categoryFilter = req.query.category
    let where = {}
    if (categoryFilter) where.CategoryId = categoryFilter
    let price = req.query.priceRange
    let priceFilterMenu = displayPriceMenu(price)
    if (price) {
      price = JSON.parse('[' + price + ']')
      where.price = { [Op.between]: price }
    }
    let search = req.query.search
    if (search) where.name = { [Op.like]: '%' + search + '%' }
    let categoryFilterMenu = displayCategory(categoryFilter)
    const rating = 90
    Product.findAll({
      include: [Category],
      order: [[sortKey, sortValue]],
      where
    }).then(products => {
      const drinks = products.map(drink => ({
        ...drink.dataValues,
        description: drink.dataValues.description
          ? drink.dataValues.description.substring(0, 50)
          : ''
      }))
      Category.findAll().then(category => {
        res.render('index', {
          drinks,
          category,
          price,
          categoryFilter,
          priceRange,
          search,
          categoryFilterMenu: categoryFilterMenu || '所有分類',
          priceFilterMenu: priceFilterMenu || '所有價格'
        })
      })
    })
  })
  // 使用者
  app.get('/user/:id', userController.getUser)
  app.get('/user/:id/edit', userController.editUser)
  app.put('/user/:id', userController.putUser)
  // 單一商品詳情
  app.get('/product/:id', productController.getProduct)
  // 評論
  app.post('/comment', commentController.createComment)
  app.put('/comments/:id', commentController.putComment)
  // 訂單
  app.get('/orders/:userId', orderController.getOrders)
  app.get('/orders/:userId/:orderId', orderController.getOrder)
  app.post('/order/:userId', orderController.createOrder)
  // 直接購買(query string)
  app.post('/cart', orderController.buyNow)
  // 出貨資訊
  app.get('/shipping-info/:userId', userController.getShippingInfos)
  app.post('/shipping-info/:userId', userController.createShippingInfo)
  app.put('/shipping-info/:userId/:id', userController.putShippingInfo)
  // 購物車
  app.get('/cart', cartController.getCart)
  app.put('/cart', cartController.putCart)
  app.delete('/cartItem/:id', cartController.deleteCartItem)
  //願望清單
  app.get('/wishlist/:userId', userController.getWishlist)
  // app.put('/wishlist/:userId', userController.putWishlist)
  app.post('/product/:id/wish', userController.addWish)
  app.post('/product/:id/unwish', userController.removeWish)

  app.get('/contact', contactController.getContact)
  // 使用折扣券
  app.post('/check-coupon', orderController.checkCoupon)

  // 後台
  app.get('/admin/users', adminUserController.getUsers)
  // 後台商品
  app.get('/admin/products', adminProductController.getProducts)
  app.get('/admin/products/create', adminProductController.createProducts)
  app.get('/admin/products/:id/edit', adminProductController.editProduct)
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
  // 移除不當評論
  app.put('/admin/comments/:id', adminCommentController.putComment)
  // 聯絡資訊
  app.put('/admin/contact', adminContactController.putContact)
  app.get('/admin/contact/edit', adminContactController.editContact)
  // 後台折價券
  app.get('/admin/coupons', adminCouponController.getCoupons)
  app.post('/admin/coupons', adminCouponController.createCoupon)
  app.put('/admin/coupons/:id', adminCouponController.putCoupon)
  app.delete('/admin/coupons/:id', adminCouponController.deleteCoupon)
  // 後台訂單
  app.get('/admin/orders', adminOrderController.getOrders)
  app.post('/admin/orders', adminOrderController.createOrder)
  app.put('/admin/orders/:id', adminOrderController.putOrder)
  app.delete('/admin/orders/:id', adminOrderController.deleteOrder)
  // reply
  app.post('/admin/replies/:id', adminReplyController.createReply)
  app.put('/admin/replies/:id', adminReplyController.putReply)
  app.delete('/admin/replies/:id', adminReplyController.deleteReply)
}
