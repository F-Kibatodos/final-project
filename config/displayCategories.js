const db = require('../models')
const Category = db.Category
let outcome = {}
outcome.id = []
outcome.name = []
Category.findAll().then(categories => {
  for (let category of categories) {
    outcome.id.push(category.id)
    outcome.name.push(category.name)
  }
})

module.exports = categoryFilter => {
  if (categoryFilter) {
    for (let i = 0; i < outcome.id.length; i++) {
      if (Number(categoryFilter) === outcome.id[i]) return outcome.name[i]
    }
  }
}
