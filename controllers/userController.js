const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Product = db.Product
const WishItem = db.WishItem
const Category = db.Category
const { validationResult } = require('express-validator')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    // confirm email 
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash('error_messages', errors.array()[0].msg)
      return res.redirect('/signup')
    }
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10),
              null
            )
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  signInPage: (req, res) => {
    const originURL = req.header('Referer')
    req.session.originURL = originURL
    return res.render('signin', { style: 'signin.css' })
  },

  signIn: (req, res) => {
    console.log("======", req.session.originURL)
    req.flash('success_messages', '成功登入！')
    res.redirect(req.session.originURL ? req.session.originURL.includes('/signin') ? '/' : req.session.originURL : '/')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    req.session.destroy()
    res.redirect('back')
  },
  // ========使用者========
  getUser: (req, res) => {
    if (Number(req.params.id) !== req.user.id) {
      return res.redirect(`/user/${req.user.id}`)
    }
    User.findByPk(req.params.id).then(profile => {
      res.render('profile', { profile, style: 'profile.css' })
    })
  },
  editUser: (req, res) => {
    if (Number(req.params.id) !== req.user.id) {
      return res.redirect(`/user/${req.user.id}/edit`)
    } else {
      return User.findByPk(req.params.id).then(user => {
        return res.render('edit-profile', { style: 'profile.css' })
      })
    }
  },
  putUser: (req, res) => {
    const errors = validationResult(req)
    let errorMsgs = []
    if (!errors.isEmpty()) {
      for (let errormessage of errors.errors) {
        errorMsgs.push({ message: errormessage.msg })
      }
      for (let errorMsg of errorMsgs) {
        req.flash('error_messages', errorMsg.message)
      }
      return res.redirect('back')
    }
    if (Number(req.params.id) !== Number(req.user.id)) {
      return res.redirect(`/user/${req.params.id}`)
    }
    if (!req.body.name) {
      req.flash('error_messages', '請輸入名稱')
      return res.redirect('back')
    }
    User.findByPk(req.params.id).then(user => {
      const { name, email, birthday, phone, address } = req.body
      user
        .update({
          name,
          email,
          phone,
          birthday,
          address
        })
        .then(user => {
          req.flash('success_messages', '成功修改個人資訊')
          res.redirect(`/user/${req.params.id}`)
        })
    })
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
    if (Number(req.params.userId) !== req.user.id) {
      return res.redirect(`/wishlist/${req.user.id}`)
    }
    WishItem.findAll({
      include: [Product, { model: Product, include: [Category] }],
      where: { UserId: req.params.userId }
    }).then(wishItems => {
      res.render('wishlist', { wishItems })
    })
  },
  putWishlist: (req, res) => {
    // 更改願望清單
  },
  addWish: (req, res) => {
    WishItem.create({
      UserId: req.user.id,
      ProductId: req.params.id
    }).then(wishItem => {
      req.flash('success_messages', '已加至願望清單')
      res.redirect('back')
    })
  },
  removeWish: (req, res) => {
    WishItem.findOne({
      where: { UserId: req.user.id, ProductId: req.params.id }
    }).then(wishItem => {
      wishItem.destroy().then(deletedItem => {
        req.flash('success_messages', '已從願望清單移除')
        res.redirect('back')
      })
    })
  }
}

module.exports = userController
