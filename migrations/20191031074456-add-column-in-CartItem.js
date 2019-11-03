'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'CartItems',
      'wantToCheckOut',
      {
        type: Sequelize.BOOLEAN
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('CartItems',
      'wantToCheckOut')
  }
};
