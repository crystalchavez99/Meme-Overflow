'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      validate: {
        notEmpty: true
      },
      type: DataTypes.STRING(30)
    },
    hashedPassword: {
      validate: {
        notEmpty: true
      },
      type: DataTypes.STRING.BINARY
    },
    email: {
      validate: {
        notEmpty: true
      },
      type: DataTypes.STRING(50)
    },
    avatarUrl: DataTypes.STRING,
    maxLikes: DataTypes.INTEGER,
    currentLikes: DataTypes.INTEGER
  }, {});
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};
