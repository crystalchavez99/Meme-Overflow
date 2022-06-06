const express = require('express');
const router = express.Router();
const db = require("../db/models");
const { asyncHandler, csrfProtection } = require("../utils");
const { check, validationResult } = require('express-validator');
const { User, Question, Answer, Comment } = require("../db/models");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


//GET SEARCH PAGE
router.get(
    '/',
    // asyncHandler(async (req, res) => {
    //     //console.log(req.params.search_keyword);

    //   const questions = await Question.findAll({
    //     include: [Answer, User],
    //     order: [['createdAt', 'DESC']],
    //   });

    asyncHandler(async (req, res) => {
        const keywords = req.query.search_keyword.split(" ");

        //handle question
        let questionArr = []
        //let answerArr = []
        //let commentArr = []
        for(let keyword of keywords){
            //(async (keyword) => {
                const questionTitles = await Question.findAll({
                    include: [Answer, User],
                    where: {
                        title: {
                            [Op.iLike]: '%' + keyword + '%'
                        }
                    },
                    limit: 15,
                    order: [['createdAt', 'DESC']],
                });
                questionArr = [...questionArr, ...questionTitles]

                const questionContents = await Question.findAll({
                    include: [Answer, User],
                    where: {
                        description: {
                            [Op.iLike]: '%' + keyword + '%'
                        }
                    },
                    limit: 15,
                    order: [['createdAt', 'DESC']],
                });
                questionArr = [...questionArr, ...questionContents]


                // const answerTitle = await Answer.findAll({
                //     include: [Question, Comment, User],
                //     where: {
                //         title: {
                //             [Op.iLike]: '%' + keyword + '%'
                //         }
                //     },
                //     limit: 15,
                //     order: [['createdAt', 'DESC']],
                // });
                // questionArr = [...questionArr, ...answerTitle]


                // const commentcontent = await Comment.findAll({
                //     include: [Answer, User],
                //     where: {
                //         content: {
                //             [Op.iLike]: '%' + keyword + '%'
                //         }
                //     },
                //     limit: 15,
                //     order: [['createdAt', 'DESC']],
                // });
                // questionArr = [...questionArr, ...commentcontent]
        }
        //console.log(commentArr)
        // for (let comment of commentArr) {
        //     const temp_answer = await db.Answer.findByPk(comment.answerId)
        //     //answerArr.add(comment.Answer)
        //     //console.log(comment)
        //         answerArr=[...answerArr, ...[temp_answer]]
        // }

        //console.log(answerArr)

        // for (let answer of answerArr) {
        //     //questionArr.add(answer.Question)
        //     const temp_question = await db.Question.findByPk(answer.questionId);
        //     console.log(answer.questionId)
        //     questionArr=[...questionArr, ...[temp_question]]
        // }

        //console.log(questionArr)

        //const uniqueQuestion = Array.from(new Set(questionArr))
        // const uniqueQuestion = Array.from(new Set(questionArr)).filter(function( element ) {
        //     return element !== undefined;
        //  });

        const user = await User.findByPk(req.session.auth.userId)
        //console.log(questionArr.length)
        //console.log(uniqueQuestion.length)
        if (req.session.auth) {
            questionArr.forEach((question, i) => {
                if ((question.userId === req.session.auth.userId)) {
                    question.isAuthorized = true;
                }

                question.colorIndex = i % 5;

            });
        }
        //if (uniqueQuestion.length > 0) {
            res.render('search', {
                title: 'Meme Overflow',
                questions:questionArr,
                user,
                isLoggedIn: req.session.auth,
                sessionUser: res.locals.user ? res.locals.user : undefined,
            });
    }));

// router.post(
//     '/',
//     asyncHandler(async (req, res) => {
//       const questions = await Question.findAll({
//         include: [Answer, User],
//         order: [['createdAt', 'DESC']],
//       });
//       //add search result function
//       questions.find().toArray(function(searchResults){
//         res.send(searchResults)
//       })

//       const user = await User.findByPk(req.session.auth.userId)
//       //console.log(user)
//       if (req.session.auth) {
//         questions.forEach((question, i) => {
//           if ((question.userId === req.session.auth.userId)) {
//             question.isAuthorized = true;
//           }

//           question.colorIndex = i % 5;

//         });
//       }
//       res.render('index', {
//         title: 'Meme Overflow',
//         questions,
//         user,
//         isLoggedIn: req.session.auth,
//         currentUser: res.locals.user ? res.locals.user : undefined,
//       });
//     }));


module.exports = router;
