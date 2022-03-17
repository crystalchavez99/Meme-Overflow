'use strict';
module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    questionId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      },
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      },
    },
    memeId: {

      type: DataTypes.INTEGER,
    },
    memeUrl: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      },

    }
  }, {});
  Answer.associate = function (models) {
    // associations can be defined here
    Answer.belongsTo(models.User, { foreignKey: "userId" });
    Answer.belongsTo(models.Question, { foreignKey: "questionId" });
    Answer.belongsTo(models.Meme, { foreignKey: "memeId" });
    Answer.hasMany(models.Comment, { foreignKey: "answerId" });
    Answer.hasMany(models.Upvote, {
      foreignKey: "answerId",
    });
    Answer.hasMany(models.Downvote, {
      foreignKey: "answerId",
    });
    Answer.belongsToMany(models.User, {
      through: "Upvote",
      otherKey: "userId",
      foreignKey: "answerId"
    });
    Answer.belongsToMany(models.User, {
      through: "Downvote",
      otherKey: "userId",
      foreignKey: "answerId"
    });

  };
  return Answer;
};
