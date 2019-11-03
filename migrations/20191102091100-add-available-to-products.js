'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Products', 'available', {
      type: Sequelize.BOOLEAN,
      defaultValue: '1'
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Products', 'available')
  }
}
