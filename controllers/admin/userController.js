const db = require('../../models')
const User = db.User
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const userController = {
  getUsers: (req, res) => {
    User.findAll()
      .then((users) => {
        const data = users.map(user => {
          return {
            ...user.dataValues
          }
        })
        return res.render('admin/users', { style: 'admin_users.css', users: data })
      })
  },
  putUser: (req, res) => {
    User.findByPk(req.params.id).then(user => {
      const { role } = user
      if (role) {
        user.update({ role: 0 })
          .then(user => {
            req.flash('success_messages', `${user.email} 已更改為一般用戶`)
            return res.redirect('/admin/users')
          })
      } else {
        user.update({ role: 1 })
          .then(user => {
            req.flash('success_messages', `${user.email} 已更改為管理員`)
            return res.redirect('/admin/users')
          })
      }
    })
  },
  searchUsers: (req, res) => {
    User.findAll({
      where: {
        [Op.or]: {
          name:
            { [Op.like]: '%' + req.query.q + '%' },
          email:
            { [Op.like]: '%' + req.query.q + '%' }
        }
      }
    }).then(users => {
      const data = users.map(user => {
        return {
          ...user.dataValues
        }
      })
      return res.render('admin/users', { style: 'admin_users.css', users: data })
    })
  }
}

module.exports = userController
