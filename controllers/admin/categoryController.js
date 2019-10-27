const db = require('../../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    Category.findAll().then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then(category => {
            return res.render('admin/categories', { categories: categories, category: category })
          })
      } else {
        return res.render('admin/categories', { categories: categories })
      }
    })
  },
  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '請輸入新名稱')
      return res.redirect('back')
    } else {
      return Category.create({
        name: req.body.name
      }).then(category => {
        req.flash('success_messages', '新增成功')
        res.redirect('/admin/categories')
      })
    }
  },
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '請輸入新名稱')
      return res.redirect('back')
    } else {
      Category.findByPk(req.params.id)
        .then(category => {
          category.update(req.body).then(category => {
            res.redirect('/admin/categories')
          })
        })
    }
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        category.destroy()
          .then(category => {
            req.flash('error_messages', `${category.name} 已被刪除`)
            res.redirect('/admin/categories')
          })
      })
  }
}

module.exports = categoryController