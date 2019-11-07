const db = require('../../models')
const BranchAddress = db.BranchAddress

const contactController = {
  getContacts: (req, res) => {
    BranchAddress.findAll().then(branches => {
      const data = branches.map(branch => {
        return {
          ...branch.dataValues
        }
      })
      res.render('admin/edit-contact', { style: "admin_edit-contact.css", branches: data })
    })
  },
  editContact: (req, res) => {
    BranchAddress.findByPk(req.params.id).then(branch => {
      res.render('admin/edit-contact', { style: "admin_edit-contact.css", branch: branch })
    })
  },
  postContact: (req, res) => {
    let { name, phone, county, district, zipcode, address, facebook, line, email } = req.body
    if (!/^[^\s]+(\s+[^\s]+)*$/g.test(req.body.name)) {
      req.flash('error_messages', '請輸入新名稱')
      return res.redirect('back')
    } else {
      if (!county || !district || !zipcode) {
        req.flash('error_messages', '請選擇縣市鄉鎮市區')
        return res.redirect('/admin/contacts')
      }
      BranchAddress.create({
        name: name,
        phone: phone,
        address: zipcode + ' ' + county + district + address,
        facebook_site: facebook,
        line_site: line,
        email_site: email,
        UserId: req.user.id
      }).then(branch => {
        req.flash('success_messages', '已成功新增！')
        res.redirect('/admin/contacts')
      })
    }
  },
  putContact: (req, res) => {
    let { name, phone, address, facebook, line, email } = req.body
    if (!phone || !address) {
      req.flash('error_messages', '請輸入電話和地址')
      return res.redirect('back')
    }
    if (!/^[^\s]+(\s+[^\s]+)*$/g.test(name)) {
      req.flash('error_messages', '請輸入新名稱')
      return res.redirect('back')
    } else {
      BranchAddress.findByPk(req.params.id).then((branch) => {
        branch.update(req.body)
          .then(branch => {
            req.flash('success_messages', '已成功更新！')
            res.redirect('/admin/contacts')
          })
      })
    }
  },
  deleteContact: (req, res) => {
    BranchAddress.findByPk(req.params.id).then(branch => {
      branch.destroy()
        .then(branch => {
          req.flash('error_messages', `${branch.name} 門市已被刪除`)
          res.redirect('/admin/contacts')
        })
    })
  }
}

module.exports = contactController
