'use strict';
module.exports = (sequelize, DataTypes) => {
  const Meme = sequelize.define('Meme', {

    url: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    }
  }, {});
  Meme.associate = function (models) {
    // associations can be defined here
    Meme.belongsToMany(models.User, {
      through: "UserMeme",
      foreignKey: "memeId",
      otherKey: "userId"
    })
  };
  return Meme;
};
