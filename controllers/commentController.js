const db = require('../models')
const Comment = db.Comment

const commentController = {
  createComment: (req, res) => {
    Comment.create({
      content: req.body.content,
      ProductId: req.body.productId,
      ranking: req.body.ranking,
      UserId: req.user.id
    }).then(comment => {
      res.redirect(`/product/${req.body.productId}`)
    })
  },
  putComment: (req, res) => {
    // 修改評論
  }
}

module.exports = commentController
