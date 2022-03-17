const express = require('express');
const router = express.Router();
const { Question, Answer, Comment} = require("../db/models");
const { asyncHandler, csrfProtection } = require("../utils");
const { check, validationResult } = require('express-validator');


router.get('/new', csrfProtection, asyncHandler(async (req, res) => {
    const question = await Question.build();

    if (!res.locals.authenticated) {
        return res.redirect('/login');
    }

    res.render('questions/question-form', {
        title: 'Ask A Question',
        question,
        csrfToken: req.csrfToken(),
        isLoggedIn: res.locals.authenticated,
    });
}));

const questionValidators = [
    check('title')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Title'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for description'),
];

router.post('/new', csrfProtection, questionValidators, asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const { userId } = req.session.auth;

    const question = Question.build({
        title,
        description,
        userId,
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        await question.save();
        res.redirect('/');
    } else {
        const errors = validatorErrors.array().map((err) => err.msg);
        res.render('questions/question-form', {
            title: 'Ask A Question',
            question,
            csrfToken: req.csrfToken(),
            errors,
            isLoggedIn: res.locals.authenticated,
        });
    }
}));

router.get(
    '/:questionId(\\d+)',
    csrfProtection,
    asyncHandler(async (req, res) => {
        const id = parseInt(req.params.questionId, 10);
        const question = await Question.findByPk(id);
        const answers = await Answer.findAll({
            where: {
                questionId: question.id
            },
            include:[Comment],
            order: [["createdAt", "DESC"]]

        })
        // const comments= await Comment.findAll({
        //     where:{
        //         answerId: answers.id
        //     },
        //     order: [["createdAt", "DESC"]]
        // })
        // const comment = await Comment.findAll({
        //     where: {
        //         questionId: question.id,
        //         answerId: answers.id
        //     },
        //     order: [["createdAt", "DESC"]]
        // })


        if (req.session.auth) {
            answers.forEach(async (answer) => {
              if ((answer.userId === req.session.auth.userId) && (!answer.Comments.length)) {
                answer.unlocked = true;
              }
            });
            // comments.forEach(async (comment) => {
            //     if ((comment.userId === req.session.auth.userId)) {
            //       comment.unlocked = true;
            //     }
            //   });
          }


        res.render('questions/question-display.pug', {
            title: question.title,
            question,
            answers,
            // comments,
            csrfToken: req.csrfToken(),
            isLoggedIn: res.locals.authenticated,
        });
    }));

router.post(
    '/:questionId(\\d+)',
    csrfProtection,
    asyncHandler(async (req, res) => {
        const questionId = parseInt(req.params.questionId, 10);
        const question = await Question.findByPk(questionId);
        const { title, memeUrl } = req.body
        const { userId } = req.session.auth
        const answer = await Answer.build({
        //answerId,
        questionId: questionId,
        title,
        userId,
        //memeId,
        memeUrl
        });
        // const comment = await Comment.build({
        //     userId: 1,
        //     answerId: 1,
        //     content
        // })
        const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        console.log("CHECK HERE ---------------------")
        await answer.save()
        // await comment.save()
        res.redirect(`/questions/${question.id}`);
    } else {
        console.log("LOOK HERE +++++++++++++++")
        const errors = validatorErrors.array().map((err) => err.msg);
        res.render('./questions/question-display', {
            title,
            memeUrl,
            errors,
            csrfToken: req.csrfToken()
        });
    }
    }));






router.get(
    '/:questionId(\\d+)/edit',
    csrfProtection,
    asyncHandler(async (req, res) => {
        const id = parseInt(req.params.questionId, 10);
        const question = await Question.findByPk(id);

        if (!res.locals.authenticated) {
            return res.redirect('/login');
        }

        if (req.session.auth.userId !== question.userId) {
            res.status = 403;
            return res.redirect('/');
        }

        res.render('questions/question-form', {
            title: 'Edit Question',
            question,
            csrfToken: req.csrfToken(),
            isLoggedIn: res.locals.authenticated,
        });
    }));

router.post('/:questionId(\\d+)/edit', csrfProtection, questionValidators, asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const { userId } = req.session.auth;

    const question = Question.build({
        title,
        description,
        userId,
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        await question.save();
        res.redirect('/');
    } else {
        const errors = validatorErrors.array().map((err) => err.msg);
        res.render('questions/question-form', {
            title: 'Ask A Question',
            question,
            csrfToken: req.csrfToken(),
            errors,
            isLoggedIn: res.locals.authenticated,
        });
    }
}));

router.get(
    '/:questionId(\\d+)/delete',
    csrfProtection,
    asyncHandler(async (req, res) => {
        const id = parseInt(req.params.questionId, 10);
        const question = await Question.findByPk(id);

        if (!res.locals.authenticated) {
            return res.redirect('/login');
        }

        if (req.session.auth.userId !== question.userId) {
            res.status = 403;
            return res.redirect('/');
        }

        res.render('questions/question-delete', {
            title: 'Delete Question',
            question,
            csrfToken: req.csrfToken(),
            isLoggedIn: res.locals.authenticated,
        });
    }));

router.post(
    '/:questionId(\\d+)/delete',
    csrfProtection,
    asyncHandler(async (req, res) => {
        const id = parseInt(req.params.questionId, 10);
        const question = await Question.findByPk(id);

        if (!res.locals.authenticated) {
            return res.redirect('/login');
        }

        if (req.session.auth.userId !== question.userId) {
            res.status = 403;
            return res.redirect('/');
        }

        await question.destroy();
        res.redirect('/');
    })
)

module.exports = router;
