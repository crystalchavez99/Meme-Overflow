'use strict';
module.exports = (sequelize, DataTypes) => {
  const Upvote = sequelize.define('Upvote', {
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
  }, {});
  Upvote.associate = function (models) {
    // associations can be defined here
    Upvote.belongsTo(models.Answer, { foreignKey: "answerId" });
  };
  return Upvote;
};
