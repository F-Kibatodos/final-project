const db = require('../models')
const Comment = db.Comment
const Product = db.Product

const commentController = {
  createComment: (req, res) => {
    if (!req.body.ranking) {
      req.flash('error_messages', '請評分')
      return res.redirect('back')
    }
    Comment.create({
      content: req.body.content,
      ProductId: req.body.productId,
      ranking: req.body.ranking,
      UserId: req.user.id
    }).then(comment => {
      Comment.findAll({ where: { ProductId: req.body.productId } }).then(
        comments => {
          console.log(comments.length)
          Product.findByPk(req.body.productId).then(product => {
            console.log(typeof product.rating)
            product.update({
              rating:
                (((product.rating / 20) * (comments.length - 1) +
                  Number(req.body.ranking)) /
                  comments.length) *
                20
            })
          })
        }
      )
      res.redirect(`/product/${req.body.productId}`)
    })
  },
  putComment: (req, res) => {
    Comment.findByPk(req.body.commentId).then(comment => {
      comment
        .update({
          content: req.body.content
        })
        .then(comment => {
          res.redirect(`/product/${req.body.productId}`)
        })
    })
  }
}

module.exports = commentController
