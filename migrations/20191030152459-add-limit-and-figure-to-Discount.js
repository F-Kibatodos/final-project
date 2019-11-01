'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Discounts', 'limit', {
      type: Sequelize.INTEGER,
      allowNull: false
    })
    return queryInterface.addColumn('Discounts', 'figure', {
      type: Sequelize.INTEGER,
      allowNull: false
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Discounts', 'limit')
    return queryInterface.removeColumn('Discounts', 'figure')
  }
};
