const db = require('../models')
const BranchAddress = db.BranchAddress

const contactController = {
  getContact: (req, res) => {
    BranchAddress.findAll().then(branches => {
      const data = branches.map(branch => {
        return {
          ...branch.dataValues
        }
      })
      res.render('contact', { style: 'contact.css', branches: data })
    })
  }
}

module.exports = contactController
