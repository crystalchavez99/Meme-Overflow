'use strict';
module.exports = (sequelize, DataTypes) => {
  const Downvote = sequelize.define('Downvote', {
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
  Downvote.associate = function (models) {
    // associations can be defined here
    Downvote.belongsTo(models.Answer, { foreignKey: "answerId" });
  };
  return Downvote;
};
