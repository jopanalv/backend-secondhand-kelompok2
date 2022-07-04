'use strict';

const categoryName = [
  "Hobi",
  "Kendaraan",
  "Baju",
  "Elektronik",
  "Kesehatan"
]

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     const categories = [];

     categories.push(
       ...categoryName.map((name) => {
         const timestamp = new Date();
         return ({
           name: name,
           createdAt: timestamp,
           updatedAt: timestamp,
         })
       })
     )
   await queryInterface.bulkInsert('Categories', categories, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     return queryInterface.bulkDelete('categories', null, {});
  }
};
