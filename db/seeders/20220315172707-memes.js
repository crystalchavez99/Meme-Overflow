'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkInsert('Memes', [
      { url: 'http://i0.kym-cdn.com/photos/images/original/001/050/209/b01.png' },
      { url: 'http://i2.kym-cdn.com/photos/images/original/000/928/982/c1e.jpg' },
      { url: 'https://i.pinimg.com/736x/8d/ee/1d/8dee1dd7ed557b97be47270521eb841e--naruto-funny-anime-naruto.jpg' },
      { url: 'https://i.pinimg.com/originals/3c/c7/21/3cc7211d716a14e665cfab5e0d833390.jpg' },
      { url: 'https://i.pinimg.com/originals/b7/b9/45/b7b9451cc7b72eacfeb1a0af1959ae89.jpg' },
      { url: 'https://images.firstpost.com/fpimages/1200x800/fixed/jpg/2016/05/Barney-380.jpg' },
      { url: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2019/09/phoebe-feature.jpg' },
      { url: 'https://financerewind.com/wp-content/uploads/2020/06/7b790c831c72c5dd3b3275833df09f29.jpg' },
      { url: 'https://theviraler.com/wp-content/uploads/2019/12/funny-awkward-moments-04-3.jpg' },
      { url: 'https://theviraler.com/wp-content/uploads/2019/12/funny-awkward-moments-15-3.jpg' },
    ], {});

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
*/

    return queryInterface.bulkDelete('Memes', null, {});

  }
};
