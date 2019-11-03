const db = require('../../models')
const Category = db.Category
const Sequelize = require('sequelize')
const Op = Sequelize.Op

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
  postCategory: async (req, res) => {
    let temp = await Category.findAll({ attributes: ['name'], raw: true })
    const categoryList = await temp.map(item => {
      return Object.values(item)[0]
    })
    if (!/^[^\s]+(\s+[^\s]+)*$/g.test(req.body.name)) {
      req.flash('error_messages', '請輸入新名稱')
      return res.redirect('back')
    } else if (categoryList.includes(req.body.name)) {
      req.flash('error_messages', '已有相同種類名稱，請重新輸入')
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
    if (!/^[^\s]+(\s+[^\s]+)*$/g.test(req.body.name)) {
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
  },
  searchCategories: (req, res) => {
    Category.findAll({
      order: [['id', 'ASC']],
      where: {
        name:
          { [Op.like]: '%' + req.query.q + '%' }
      }
    }).then(categories => {
      return res.render('admin/categories', { categories: categories })
    })
  }
}

module.exports = categoryController