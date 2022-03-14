'use strict';

const { useColors } = require("debug/src/browser");

module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    title: {
      validate: {
        notEmpty: true
      },
      type: DataTypes.STRING(255)
    },
    description: {
      validate: {
        notEmpty: true
      },
      type: DataTypes.TEXT
    },
    userId: {
      validate: {
        notEmpty: true
      },
      type: DataTypes.INTEGER
    },
  }, {});
  Question.associate = function (models) {
    // associations can be defined here
    Question.belongsTo(models.User, { foreignKey: 'userId' })
  };
  return Question;
};
