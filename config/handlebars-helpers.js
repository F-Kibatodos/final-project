const moment = require('moment')

module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  ifExist: function (a, options) {
    if (!a) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  moment: function (time) {
    return moment(time).format('YYYY-MM-DD, HH:mm')
  },
  momentCoupons: function (time) {
    return moment(time).format('YYYY-MM-DD')
  },
  birthday: function (time) {
    return moment(time).format('YYYY-MM-DD')
  },
  multiplication: function (a, b, options) {
    return a * b
  }
}
