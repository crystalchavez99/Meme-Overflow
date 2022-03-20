var express = require('express');
var router = express.Router();
const db = require("../db/models");
const { asyncHandler, csrfProtection } = require("../utils");
const { check, validationResult } = require('express-validator');
/* GET users listing. */

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
///hello
router.get('/:userId(\\d+)/questions', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.userId, 10);
  const user = await db.User.findByPk(req.session.auth.userId)
  const questions = await db.Question.findAll({
    where: { userId: id }
  })
  if (req.session.auth) {
    questions.forEach((question, i) => {
      if ((question.userId === req.session.auth.userId)) {
        question.isAuthorized = true;
      }

      question.colorIndex = i % 5;

    });
  }

  res.render("./questions/question-user-display", {
    questions,
    user,
    isLoggedIn: req.session.auth,
    currentUserAvatarUrl: res.locals.user ? res.locals.user.avatarUrl : undefined,
    currentUsername: res.locals.user ? res.locals.user.username : "",
  })

}))

router.get('/:userId(\\d+)/answers', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.userId, 10);

  const answers = await db.Answer.findAll({
    include: [db.Comment, db.Question],
    // include: db.Question,
    where: { userId: id }
  })


  if (req.session.auth) {
    answers.forEach((answer, i) => {
      if ((answer.userId === req.session.auth.userId)) {
        answer.isAuthorized = true;
      }

      answer.colorIndex = i % 5;
      console.log("index", answer.colorIndex)
    });
  }

  res.render("./answers/my-answers.pug", {
    answers,
    isLoggedIn: req.session.auth,
    currentUserAvatarUrl: res.locals.user ? res.locals.user.avatarUrl : undefined,
    currentUsername: res.locals.user ? res.locals.user.username : "",
  })

}))

router.get('/:userId(\\d+)/comments', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.userId, 10);

  const comments = await db.Comment.findAll({
    where: { userId: id }
  })


  if (req.session.auth) {
    comments.forEach((comment, i) => {
      if ((comment.userId === req.session.auth.userId)) {
        comment.isAuthorized = true;
      }

      comment.colorIndex = i % 5;


    });
  }


  res.render("./comments/my-commets-display.pug", {
    comments,
    isLoggedIn: req.session.auth,
    currentUserAvatarUrl: res.locals.user ? res.locals.user.avatarUrl : undefined,
    currentUsername: res.locals.user ? res.locals.user.username : "",
  })

}))




router.get(`/:userId/questions`, csrfProtection, asyncHandler(async (req, res) => {
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

router.get(`/:userId/answers`, csrfProtection, asyncHandler(async (req, res) => {
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

router.get(`/:userId/comments`, csrfProtection, asyncHandler(async (req, res) => {
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
