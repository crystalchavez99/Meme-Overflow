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
    isLoggedIn: req.session.auth,
    currentUserAvatarUrl: res.locals.user ? res.locals.user.avatarUrl : undefined,
    currentUsername: res.locals.user ? res.locals.user.username : "",
  })

}))

router.get('/:userId(\\d+)/answers', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.userId, 10);

  const answers = await db.Answer.findAll({
    include: db.Comment,
    where: { userId: id }
  })
  if (req.session.auth) {
    answers.forEach((answer, i) => {
      if ((answer.userId === req.session.auth.userId)) {
        answer.isAuthorized = true;
      }

      answer.colorIndex = i % 5;

    });
  }
  console.log(answers)
  res.render("./answers/my-answers.pug", {
    answers,
    isLoggedIn: req.session.auth,
    currentUserAvatarUrl: res.locals.user ? res.locals.user.avatarUrl : undefined,
    currentUsername: res.locals.user ? res.locals.user.username : "",
  })

}))


module.exports = router;
