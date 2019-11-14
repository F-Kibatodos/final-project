const db = require('../../models')
const Comment = db.Comment
const User = db.User
const Product = db.Product
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const commentController = {
  getComments: (req, res) => {
    Comment.findAll({ include: [User, Product] }).then(comments => {
      const data = comments.map(comment => {
        return {
          ...comment.dataValues
        }
      })
      res.render('admin/comments', { comments: data })
    })
  },
  deleteComment: (req, res) => {
    Comment.findByPk(req.params.id)
      .then(comment => {
        comment.destroy()
          .then(comment => {
            req.flash('error_messages', `${comment.content} 已被刪除`)
            res.redirect('/admin/comments')
          })
      })
  },
  searchComments: (req, res) => {
    Comment.findAll({
      include: [User, Product],
      order: [['ranking', 'DESC']],
      where: {
        [Op.or]: {
          ranking:
            { [Op.like]: '%' + req.query.q + '%' }
          ,
          content:
            { [Op.like]: '%' + req.query.q + '%' }
          ,
          '$User.name$':
            { [Op.like]: '%' + req.query.q + '%' }
          ,
          '$Product.name$':
            { [Op.like]: '%' + req.query.q + '%' }
        }
      }
    }).then(comments => {
      const data = comments.map(comment => {
        return {
          ...comment.dataValues
        }
      })
      res.render('admin/comments', { comments: data })
    })
  }
}

module.exports = commentController
