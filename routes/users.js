const express = require('express');
const router = express.Router();
const db = require("../db/models");
const { asyncHandler, csrfProtection } = require("../utils");
const { requireAuth } = require('../auth');
const { check, validationResult } = require('express-validator');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get(
  '/:userId(\\d+)/profile',
  requireAuth,
  csrfProtection,
  asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;

    const user = await db.User.findByPk(userId, {
      include: [
        {
          model: db.Question,
          include: [
            {
              model: db.Answer,
              include: [db.Comment, db.Upvote, db.Downvote],
            },
          ],
        },
      ],
    })

    res.render('profile', {
      title: `${user.username}'s Profile`,
      user,
      csrfToken: req.csrfToken(),
    })
  }));

router.get(`/:userId(\\d+)/questions`, csrfProtection, asyncHandler(async (req, res) => {
  const user = parseInt(req.params.userId, 10);
  console.log(user, "USER")
  const questions = await db.Question.findAll({
    where: {
      userId: user
    },
    include: [db.User]
  })
  console.log(questions, "Question")
  res.render('questions', { questions })
}));

router.get(`/:userId(\\d+)/answers`, csrfProtection, asyncHandler(async (req, res) => {
  const user = parseInt(req.params.userId, 10);
  console.log(user, "USER")
  const answers = await db.Answer.findAll({
    where: {
      userId: user
    },
    include: [db.User, db.Comment]
  })
  console.log(answers, "Question")
  res.render('./answers/answer', { answers })
}));

router.get(`/:userId(\\d+)/comments`, csrfProtection, asyncHandler(async (req, res) => {
  const user = parseInt(req.params.userId, 10);
  console.log(user, "USER")
  const comments = await db.Comment.findAll({
    where: {
      userId: user
    },
    include: [db.User, db.Answer]
  })
  console.log(comments, "Question")
  res.render('./comments/comment', { comments })
}));
module.exports = router;
