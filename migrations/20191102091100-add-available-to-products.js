'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Products', 'available', {
      type: Sequelize.BOOLEAN
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Products', 'available')
  }
}
