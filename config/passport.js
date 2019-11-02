const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Product = db.Product

// setup passport strategy
passport.use(
  new LocalStrategy(
    // customize user field
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    // authenticate user
    (req, username, password, cb) => {
      User.findOne({ where: { email: username } }).then(user => {
        if (!user)
          return cb(
            null,
            false,
            req.flash('error_messages', '帳號或密碼輸入錯誤')
          )
        if (!bcrypt.compareSync(password, user.password))
          return cb(
            null,
            false,
            req.flash('error_messages', '帳號或密碼輸入錯誤！')
          )
        return cb(null, user)
      })
    }
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ['email', 'displayName']
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ where: { email: profile._json.email } }).then(user => {
        if (!user) {
          var randomPassword = Math.random()
            .toString(36)
            .slice(-8)
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(randomPassword, salt, (err, hash) => {
              var newUser = new User({
                name: profile._json.name,
                email: profile._json.email,
                password: hash,
                role: 0
              })
              newUser
                .save()
                .then(user => {
                  return done(null, user)
                })
                .catch(err => {
                  console.log(err)
                })
            })
          })
        } else {
          return done(null, user)
        }
      })
    }
  )
)

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: { model: db.Product, as: 'WishProducts' }
  }).then(user => {
    return cb(null, user)
  })
})

module.exports = passport
