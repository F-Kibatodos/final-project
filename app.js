const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const session = require('express-session')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')


app.use(express.static('public'))
app.engine('handlebars', exphbs({ defaultLayout: 'main', helpers: require('./config/handlebars-helpers') }))
app.set('view engine', 'handlebars')
app.use(session({
  secret: 'drink',
  name: 'acaaa',
  cookie: { maxAge: 80000 },
  resave: false,
  saveUninitialized: true,
}))
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))


require('./routes')(app)
app.listen(3000)
