const express = require('express')
const exphbs = require('express-handlebars')
const app = express()

app.use(express.static('public'))
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
    helpers: require('./config/handlebars-helpers')
  })
)
app.set('view engine', 'handlebars')

require('./routes')(app)
app.listen(3000)
