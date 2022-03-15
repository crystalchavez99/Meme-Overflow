'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkInsert('Answers', [{
      questionId: 1,
      title: "Title",
      userId: 1,
      memeUrl: 'https://theviraler.com/wp-content/uploads/2019/12/funny-awkward-moments-15-3.jpg'
    }], {});

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkDelete('Answers', null, {});

  }
};
