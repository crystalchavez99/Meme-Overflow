'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      },
    }
  }, {});
  Tag.associate = function (models) {
    // associations can be defined here
    Tag.belongsToMany(models.Question, {
      through: "QuestionTag",
      otherKey: "questionId",
      foreignKey: "tagId"
    })
  };
  return Tag;
};
