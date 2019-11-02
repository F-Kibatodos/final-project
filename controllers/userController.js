const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const WishItem = db.WishItem

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
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
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('back')
  },
  // ========使用者========
  getUser: (req, res) => {
    if (Number(req.params.id) !== req.user.id) {
      return res.redirect(`/user/${req.user.id}`)
    }
    User.findByPk(req.params.id).then(profile => {
      res.render('profile', { profile })
    })
  },
  editUser: (req, res) => {
    if (Number(req.params.id) !== req.user.id) {
      req.flash('error_messages', '您無權編輯他人檔案')
      return res.redirect(`/user/${req.params.id}`)
    } else {
      return User.findByPk(req.params.id).then(user => {
        return res.render('edit-profile')
      })
    }
  },
  putUser: (req, res) => {
    if (Number(req.params.id) !== Number(req.user.id)) {
      req.flash('error_messages', '您無權編輯他人檔案')
      return res.redirect(`/user/${req.params.id}`)
    }
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
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
          req.flash('success_messages', 'user was successfully to update')
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
    res.render('wishlist')
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
