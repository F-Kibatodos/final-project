const db = require('../../models')
const BranchAddress = db.BranchAddress

const contactController = {
  editContact: (req, res) => {
    BranchAddress.findAll().then(branches => {
      const data = branches.map(branch => {
        return {
          ...branch.dataValues
        }
      })
      oddOrEven = data.length % 2
      res.render('admin/edit-contact', { style: "admin_edit-contact.css", branches: data, oddOrEven: oddOrEven })
    })
  },
  putContact: (req, res) => {
    // 修改聯絡資訊
    BranchAddress.findByPk(req.params.id).then((branch) => {
      branch.update(req.body)
        .then(branch => {
          req.flash('success_messages', '已成功更新！')
          res.redirect('back')
        })
    })
  }
}

module.exports = contactController
