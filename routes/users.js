const express = require('express');
const router = express.Router();
const db = require("../db/models");
const { asyncHandler, csrfProtection } = require("../utils");
const { check, validationResult } = require('express-validator');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
///hello


router.get(`/:userId/questions`,csrfProtection,asyncHandler(async (req, res) => {
  const user = parseInt(req.params.userId, 10);
  console.log(user,"USER")
  const questions = await db.Question.findAll({
    where:{
      userId:user
    },
    include: [db.User]
  })
  console.log(questions,"Question")
  res.render('questions',{questions})
}));

router.get(`/:userId/answers`,csrfProtection,asyncHandler(async (req, res) => {
  const user = parseInt(req.params.userId, 10);
  console.log(user,"USER")
  const answers = await db.Answer.findAll({
    where:{
      userId:user
    },
    include: [db.User,db.Comment]
  })
  console.log(answers,"Question")
  res.render('./answers/answer',{answers})
}));

router.get(`/:userId/comments`,csrfProtection,asyncHandler(async (req, res) => {
  const user = parseInt(req.params.userId, 10);
  console.log(user,"USER")
  const comments = await db.Comment.findAll({
    where:{
      userId:user
    },
    include: [db.User,db.Answer]
  })
  console.log(comments,"Question")
  res.render('./comments/comment',{comments})
}));
module.exports = router;
