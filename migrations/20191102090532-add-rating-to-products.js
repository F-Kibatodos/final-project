'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Products', 'rating', {
      type: Sequelize.FLOAT
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Products', 'rating')
  }
}
