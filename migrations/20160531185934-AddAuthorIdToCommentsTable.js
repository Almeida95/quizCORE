'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return  queryInterface.addColumn( 'Comments', 
                                        'AuthorId', 
                                        { type: Sequelize.INTEGER,
                                          allowNull: false}
                                      );
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('Comments','username');
  }
};
