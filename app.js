const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('./models')
const CartItem = db.CartItem
const passport = require('./config/passport')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
    helpers: require('./config/handlebars-helpers')
  })
)
app.set('view engine', 'handlebars')
app.use(methodOverride('_method'))
app.use(
  session({
    secret: 'drink',
    name: 'acaaa',
    cookie: { maxAge: 86400000 },
    resave: false,
    saveUninitialized: true
  })
)
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  CartItem.sum('quantity', { where: { CartId: req.session.cartId || 0 } }).then(
    quantity => {
      quantity = quantity || 0
      res.locals.cart_number = quantity || 0
    }
  )
  next()
})

require('./routes/authsFB')(app)
require('./routes/authsGoogle')(app)
require('./routes')(app, passport)
app.listen(process.env.PORT || 3000)
