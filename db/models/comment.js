'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    userId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      },
    },
    answerId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      },
    },
    content: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true
      },
    }
  }, {});
  Comment.associate = function (models) {
    // associations can be defined here
    Comment.belongsTo(models.User, { foreignKey: 'userId' })
    Comment.belongsTo(models.Answer, { foreignKey: "answerId" })
  };
  return Comment;
};
