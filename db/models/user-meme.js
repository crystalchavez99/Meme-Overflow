'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserMeme = sequelize.define('UserMeme', {
    userId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      },
    },
    memeId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      },
    }
  }, {});
  UserMeme.associate = function (models) {
    // associations can be defined here

  };
  return UserMeme;
};
