const express = require('express');
const router = express.Router();
const db = require("../db/models");
const { asyncHandler, csrfProtection } = require("../utils");
const { check, validationResult } = require('express-validator');
const { User, Question, Answer } = require("../db/models");
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
        const keyword = req.query.search_keyword;
        const questions = await Question.findAll({
            include: [Answer, User],
            where: {
                title: {
                    [Op.iLike]: '%' + keyword + '%'

                }
            },
            limit: 15,
            order: [['createdAt', 'DESC']],
        });
        //console.log(questions);
        //console.log(JSON.stringify(questions,null,2))

        //add the search results function

        //   questions.find().toArray(function(searchResults){
        //     res.send(searchResults)
        //   })

        const user = await User.findByPk(req.session.auth.userId)
       // console.log(user)
       // console.log(req.session.auth.userId);
        if (req.session.auth) {
            questions.forEach((question, i) => {
                if ((question.userId === req.session.auth.userId)) {
                    question.isAuthorized = true;
                }

                question.colorIndex = i % 5;

            });
        }
        res.render('search', {
            title: 'Meme Overflow',
            questions,
            //user
            isLoggedIn: false,
            currentUser: undefined
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
