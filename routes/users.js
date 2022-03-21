var express = require('express');
var router = express.Router();
const db = require("../db/models");
const { asyncHandler, csrfProtection, styleResources, isAuthorized } = require("../utils");
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
          order: [['createdAt', 'DESC']],
          limit: 3,
        },
      ],
    });

    let answers = await db.Answer.findAll({
      where: {
        userId,
      },
      include: [db.Question, db.Comment, db.Upvote, db.Downvote],
    });

    answers.forEach((answer) => {
      answer.votes = answer.Upvotes.length - answer.Downvotes.length;
    });

    answers.sort((a, b) => {
      if (a.votes !== b.votes) {
        return b.votes - a.votes;
      } else {
        console.log(b.createdAt - a.createdAt);
        return b.createdAt - a.createdAt;
      }
    });

    answers = answers.slice(0, 3);

    let comments = await db.Comment.findAll({
      where: { userId },
      order: [['updatedAt', 'DESC']],
      limit: 3,
    });

    styleResources(user.Questions, 5);
    styleResources(answers, 5);
    styleResources(comments, 5);

    res.render('profile', {
      title: `${user.username}'s Profile`,
      user,
      questions: user.Questions.slice(0, 3),
      answers,
      comments,
      csrfToken: req.csrfToken(),
      isLoggedIn: req.session.auth,
      currentUser: res.locals.user ? res.locals.user : undefined,
    })
  }));

router.get(`/:userId(\\d+)/questions`, csrfProtection, asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const user = await db.User.findByPk(userId);
  const questions = await db.Question.findAll({
    where: {
      userId,
    },
    include: [db.User],
  });

  styleResources(questions, 5);

  if (req.session.auth) {
    questions.forEach((question) => {
      question.isAuthorized = isAuthorized(req, res, question);
    });
  }

  res.render('index', {
    title: `${user.username}'s Questions`,
    questions,
    isLoggedIn: req.session.auth,
    currentUser: res.locals.user ? res.locals.user : undefined,
  })

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
