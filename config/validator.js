const { body } = require('express-validator')

module.exports = {
  registerValidator: [
    body('email')
      .exists()
      .isEmail()
      .withMessage('email 格式錯誤'),
  ]
}