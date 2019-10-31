const db = require('../../models')
const Reply = db.Reply

const replyController = {
  createReply: (req, res) => {
    Reply.create({
      content: req.body.adminReply,
      UserId: req.user.id,
      CommentId: req.body.commentId
    })
    res.redirect(`/product/${req.body.productId}`)
  },
  putReply: (req, res) => {
    // 修改回應
  },
  deleteReply: (req, res) => {
    Reply.destroy({ where: { id: req.params.id } }).then(reply => {
      res.redirect(`/product/${req.body.productId}`)
    })
  }
}

module.exports = replyController
