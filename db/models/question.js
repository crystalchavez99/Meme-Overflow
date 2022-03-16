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
    Question.hasMany(models.Answer, { foreignKey: "questionId" });
    Question.belongsTo(models.User, { foreignKey: 'userId' });
    Question.belongsToMany(models.Tag, {
      through: "QuestionTag",
      otherKey: "tagId",
      foreignKey: "questionId"
    })
  };
  return Question;
};
