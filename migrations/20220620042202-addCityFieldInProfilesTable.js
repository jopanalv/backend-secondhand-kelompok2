"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("Profiles", "city", {
      type: Sequelize.STRING,
      after: "name",
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("Profiles", "city");
  },
};
