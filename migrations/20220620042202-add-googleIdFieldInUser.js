"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("Users", "googleId", {
      type: Sequelize.STRING,
      after: "password",
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("Users", "googleId");
  },
};
