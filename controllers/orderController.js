const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Product = db.Product
const crypto = require("crypto")
const Order = db.Order
const OrderItem = db.OrderItem
const Op = db.Sequelize.Op
const UserCoupon = db.UserCoupon
const User = db.User
const Coupon = db.Coupon
const Discount = db.Discount


// 第三方支付所需資料
const URL = process.env.URL
const MerchantID = process.env.MERCHANT_ID
const HashKey = process.env.HASH_KEY
const HashIV = process.env.HASH_IV
const PayGateWay = "https://ccore.spgateway.com/MPG/mpg_gateway"
const ReturnURL = URL + "/spgateway/callback?from=ReturnURL"
const NotifyURL = URL + "/spgateway/callback?from=NotifyURL"
const ClientBackURL = URL + "/order/shipping-info/"

function genDataChain(TradeInfo) {
  let results = [];
  for (let kv of Object.entries(TradeInfo)) {
    results.push(`${kv[0]}=${kv[1]}`);
  }
  return results.join("&");
}

function create_mpg_aes_encrypt(TradeInfo) {
  let encrypt = crypto.createCipheriv("aes256", HashKey, HashIV);
  let enc = encrypt.update(genDataChain(TradeInfo), "utf8", "hex");
  return enc + encrypt.final("hex");
}

function create_mpg_aes_decrypt(TradeInfo) {
  let decrypt = crypto.createDecipheriv("aes256", HashKey, HashIV);
  decrypt.setAutoPadding(false);
  let text = decrypt.update(TradeInfo, "hex", "utf8");
  let plainText = text + decrypt.final("utf8");
  let result = plainText.replace(/[\x00-\x20]+/g, "");
  return result;
}

function create_mpg_sha_encrypt(TradeInfo) {

  let sha = crypto.createHash("sha256");
  let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`

  return sha.update(plainText).digest("hex").toUpperCase();
}
function getTradeInfo(Amt, Desc, email) {

  console.log('===== getTradeInfo =====')
  console.log(Amt, Desc, email)
  console.log('==========')

  data = {
    'MerchantID': MerchantID, // 商店代號
    'RespondType': 'JSON', // 回傳格式
    'TimeStamp': Date.now(), // 時間戳記
    'Version': 1.5, // 串接程式版本
    'MerchantOrderNo': Date.now(), // 商店訂單編號
    'LoginType': 0, // 智付通會員
    'Amt': Amt, // 訂單金額
    'ItemDesc': Desc, // 產品名稱
    'Email': email, // 付款人電子信箱
    'ReturnURL': ReturnURL, // 支付完成返回商店網址
    'NotifyURL': NotifyURL, // 支付通知網址/每期授權結果通知
    'ClientBackURL': ClientBackURL, // 支付取消返回商店網址
  }

  console.log('===== getTradeInfo: data =====')
  console.log(data)


  mpg_aes_encrypt = create_mpg_aes_encrypt(data)
  mpg_sha_encrypt = create_mpg_sha_encrypt(mpg_aes_encrypt)

  console.log('===== getTradeInfo: mpg_aes_encrypt, mpg_sha_encrypt =====')
  console.log(mpg_aes_encrypt)
  console.log(mpg_sha_encrypt)

  tradeInfo = {
    'MerchantID': MerchantID, // 商店代號
    'TradeInfo': mpg_aes_encrypt, // 加密後參數
    'TradeSha': mpg_sha_encrypt,
    'Version': 1.5, // 串接程式版本
    'PayGateWay': PayGateWay,
    'MerchantOrderNo': data.MerchantOrderNo,
  }

  console.log('===== getTradeInfo: tradeInfo =====')
  console.log(tradeInfo)

  return tradeInfo
}

const orderController = {
  getOrders: (req, res) => {
    Order.findAll({ where: { UserId: req.user.id, payment_status: '1' } }).then(orders => {
      return res.render('orders', {
        orders
      })
    })
  },
  getOrder: (req, res) => {
    const rank = [1, 2, 3, 4, 5]
    Order.findByPk(req.params.orderId).then(
      order => {
        if (!req.user.role && order.UserId !== req.user.id) {
          req.flash('error_messages', '無權限查看')
          return res.redirect('/')
        }
        if (!req.user.role && order.payment_status !== '1') {
          req.flash('error_messages', '無權限查看')
          return res.redirect('/')
        }
        return OrderItem.sum('quantity', { where: { OrderId: order.id || 0 } }).then(totalQuantity => {
          totalQuantity = totalQuantity || 0
          OrderItem.findAll({ where: { OrderId: order.id || 0 }, include: 'Product' }).then(items => {
            let totalPrice = items.length > 0 ? items.map(d => d.price * d.quantity).reduce((a, b) => a + b) : 0
            return res.render('order', {
              totalPrice,
              items,
              order,
              totalQuantity,
              rank,
              style: 'order.css',
              js: 'comment.js',
            }
            )
          })
        })
      }
    )
  },
  createOrder: (req, res) => {
    if (!req.body.name || !req.body.phone || !req.body.address) {
      req.flash('error_messages', '資料皆須填')
      return res.redirect('back')
    }
    return CartItem.findAll({ where: { [Op.and]: [{ wantToCheckOut: true }, { CartId: req.session.cartId }] }, include: 'Product' }).then(items => {
      return Order.create({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        shipping_status: req.body.shipping_status,
        shipping_method: req.body.shipping_method,
        payment_status: req.body.payment_status,
        amount: req.body.amount,
        UserId: req.user.id,
        CouponId: req.body.couponId
      }).then(order => {
        var results = [];
        for (var i = 0; i < items.length; i++) {
          console.log(order.id, items[i].id)
          results.push(
            OrderItem.create({
              OrderId: order.id,
              ProductId: items[i].ProductId,
              price: items[i].Product.price,
              quantity: items[i].quantity,
              sugar: items[i].sugar,
              ice: items[i].ice
            })
          )
        }
        return Promise.all(results).then(() => {
          console.log('===== getPayment =====')
          console.log(order.id)
          console.log('==========')

          return Order.findByPk(order.id, { include: 'User' }).then(order => {
            const tradeInfo = getTradeInfo(order.amount, '飲料', order.User.email)
            order.update({
              sn: tradeInfo.MerchantOrderNo,
            }).then(order => {
              OrderItem.sum('quantity', { where: { OrderId: order.id || 0 } }).then(totalQuantity => {
                totalQuantity = totalQuantity || 0
                OrderItem.findAll({ where: { OrderId: order.id || 0 }, include: 'Product' }).then(items => {
                  let totalPrice = items.length > 0 ? items.map(d => d.Product.price * d.quantity).reduce((a, b) => a + b) : 0
                  return res.render('payment', {
                    totalPrice,
                    items,
                    order,
                    tradeInfo,
                    totalQuantity,
                    discountPrice: req.body.discountPrice === "no-discount" ? false : req.body.discountPrice
                  }
                  )
                })
              })
            })
          })
        }
        )
      })
    })
  },
  checkCoupon: (req, res) => {
    // 確認折扣券是否符合
    User.findByPk(req.user.id, { include: [{ model: Coupon, as: 'OwnCoupons', include: [Discount] }] })
      .then(user => {
        let couponCode = Array.from(user.OwnCoupons, coupon => { return coupon.code })
        couponIndex = couponCode.indexOf(req.query.coupon)
        let data = {}
        if (couponIndex < 0) {
          data.checkResult = 'invalid'
        }
        else {
          data.checkResult = 'valid'
          data.description = user.OwnCoupons[couponIndex].Discount.description
          data.limit = user.OwnCoupons[couponIndex].Discount.limit
          data.figure = user.OwnCoupons[couponIndex].Discount.figure
        }
        return res.json(data)
      })
  },
  getOrderShippingInfo: (req, res) => {
    let coupon
    let discountPrice = false
    const useCouponCode = req.query.useCoupon
    if (useCouponCode) {
      User.findByPk(req.user.id, { include: [{ model: Coupon, as: 'OwnCoupons', include: [Discount] }] })
        .then(user => {
          let couponCode = Array.from(user.OwnCoupons, coupon => { return coupon.code })
          couponIndex = couponCode.indexOf(useCouponCode)
          if (couponIndex > -1) {
            coupon = user.OwnCoupons[couponIndex].Discount || false
          }
        })
    }
    const itemIds = Object.keys(req.query)
    itemIds.splice(itemIds.indexOf('useCoupon'), 1)
    console.log('==========ee=====', itemIds)
    if (itemIds.length === 0) {
      req.flash('error_messages', '請至少選擇一項結帳商品')
      return res.redirect('/cart')
    }
    let itemIdSet = []
    for (let i = 0; i < itemIds.length; i++) {
      let item = { id: Number(itemIds[i]) }
      itemIdSet.push(item)
    }
    CartItem.update({ wantToCheckOut: false }, { where: { CartId: req.session.cartId } }).then(() => {

      return CartItem.findAll({ where: { [Op.and]: [{ [Op.or]: itemIdSet }, { CartId: req.session.cartId }] }, include: [{ model: Product }] }).then(items => {
        let totalPrice = items.length > 0 ? items.map(d => d.Product.price * d.quantity).reduce((a, b) => a + b) : 0
        let totalQuantity = items.length > 0 ? items.map(d => d.quantity).reduce((a, b) => a + b) : 0
        CartItem.update({
          wantToCheckOut: true
        }, { where: { [Op.and]: [{ [Op.or]: itemIdSet }, { CartId: req.session.cartId }] } }).then(() => {
          if (coupon) {
            console.log("---coupon---", coupon)
            if (totalPrice >= coupon.limit) {
              if (coupon.description === "% off") {
                discountPrice = Math.round(totalPrice * (1 - (coupon.figure / 100)))
              }
              else if (coupon.description === "滿折") {
                discountPrice = totalPrice - coupon.figure
              }
            }
          }
          return res.render('order-shipping-info', {
            cartId: req.session.cartId,
            items,
            totalPrice,
            totalQuantity,
            discountPrice,
            coupon,
            js: 'order-shipping-info.js',
          })
        })
      })
    })
  },
  spgatewayCallback: (req, res) => {
    console.log('===== spgatewayCallback =====')
    console.log(req.method)
    console.log(req.query)
    console.log(req.body)
    console.log('==========')

    console.log('===== spgatewayCallback: TradeInfo =====')
    console.log(req.body.TradeInfo)


    const data = JSON.parse(create_mpg_aes_decrypt(req.body.TradeInfo))

    console.log('===== spgatewayCallback: create_mpg_aes_decrypt、data =====')
    console.log(data)

    return Order.findOne({ where: { sn: data['Result']['MerchantOrderNo'] } }).then(order => {
      order.update({
        ...req.body,
        payment_status: '1',
      }).then(order => {
        CartItem.destroy({ where: { [Op.and]: [{ wantToCheckOut: true }, { CartId: req.session.cartId }] }, include: 'Product' })
        return res.redirect(`/orders/${order.id}`)
      })
    })
  }
}

module.exports = orderController
