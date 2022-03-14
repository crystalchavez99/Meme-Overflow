'use strict';
module.exports = (sequelize, DataTypes) => {
  const QuestionTag = sequelize.define('QuestionTag', {
    questionId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      },
    },
    tagId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      },
    }
  }, {});
  QuestionTag.associate = function (models) {
    // associations can be defined here
  };
  return QuestionTag;
};
