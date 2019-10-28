const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Product = db.Product
const crypto = require("crypto")
const Order = db.Order
const OrderItem = db.OrderItem

// 第三方支付所需資料
const URL = process.env.URL
const MerchantID = process.env.MERCHANT_ID
const HashKey = process.env.HASH_KEY
const HashIV = process.env.HASH_IV
const PayGateWay = "https://ccore.spgateway.com/MPG/mpg_gateway"
const ReturnURL = URL + "/spgateway/callback?from=ReturnURL"
const NotifyURL = URL + "/spgateway/callback?from=NotifyURL"
const ClientBackURL = URL + "/orders/1"

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
    'OrderComment': 'OrderComment', // 商店備註
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
    res.render('orders')
  },
  getOrder: (req, res) => {
    res.render('order')
  },
  createOrder: (req, res) => {
    return CartItem.findAll({ where: { CartId: req.body.cartId || 0 }, include: 'Product' }).then(items => {
      return Order.create({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        shipping_status: req.body.shipping_status,
        shipping_method: req.body.shipping_method,
        payment_status: req.body.payment_status,
        amount: req.body.amount,
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

          return Order.findByPk(order.id, {}).then(order => {
            const tradeInfo = getTradeInfo(order.amount, '飲料', order.email)
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
  },
  getOrderShippingInfo: (req, res) => {
    req.session.cartId = 9
    return CartItem.findAll({ where: { CartId: req.session.cartId || 0 }, include: [{ model: Product }] }).then(items => {
      let totalPrice = items.length > 0 ? items.map(d => d.Product.price * d.quantity).reduce((a, b) => a + b) : 0
      CartItem.sum('quantity', { where: { CartId: req.session.cartId || 0 } }).then(totalQuantity => {
        totalQuantity = totalQuantity || 0
        return res.render('order-shipping-info', {
          cartId: req.session.cartId,
          items,
          totalPrice,
          totalQuantity,
          js: 'order-shipping-info.js',
        })
      })
    })
  }

}

module.exports = orderController
