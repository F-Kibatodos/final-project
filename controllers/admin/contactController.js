const contactController = {
  editContact: (req, res) => {
    res.render('admin/edit-contact')
  },
  putContact: (req, res) => {
    // 修改聯絡資訊
  }
}

module.exports = contactController
