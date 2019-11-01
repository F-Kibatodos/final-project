// routes/authsFB.js
const passport = require('passport')

module.exports = app => {
  app.get(
    '/auth/facebook',
    passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
  )
  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/signin',
    })
  )
}

