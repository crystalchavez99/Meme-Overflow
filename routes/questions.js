const express = require('express');
const router = express.Router();
const db = require("../db/models");
const { asyncHandler, csrfProtection } = require("../utils");
const { check, validationResult } = require('express-validator');

router.get('/new', csrfProtection, asyncHandler(async (req, res) => {
    const question = await db.Question.build();

    if (!res.locals.authenticated) {
        return res.redirect('/login');
    }

    res.render('questions/question-form', {
        title: 'Ask A Question',
        question,
        csrfToken: req.csrfToken(),
        isLoggedIn: res.locals.authenticated,
        action: `/questions/new`
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

    const question = db.Question.build({
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
        const question = await db.Question.findByPk(id, {
            include: {
                model: db.Answer,
                include: [db.Comment, db.Upvote, db.Downvote],
            },
        });
        if(req.session.auth){
            question.Answers.forEach(async(answer)=>{
                if(answer.userId===req.session.auth.userId){
                    answer.unlocked = true;
                }
                answer.Comments.forEach(async(comment)=>{
                    if(comment.userId===req.session.auth.userId){
                        comment.unlocked = true;
                    }
                })
            })
        }

        for (let answer of question.Answers) {
            answer.voteCount = answer.Upvotes.length - answer.Downvotes.length;
            const upvote = await db.Upvote.findOne({
                where: {
                    userId: req.session.auth.userId,
                    answerId: answer.id
                }
            })
            answer.upvoted = !!upvote;
            const downvote = await db.Downvote.findOne({
                where: {
                    userId: req.session.auth.userId,
                    answerId: answer.id
                }
            })
            answer.downvoted = !!downvote;
        }
        if ((question.userId === req.session.auth.userId)) {
            question.isAuthorized = true;
        }
        res.render('questions/question-display.pug', {
            title: question.title,
            question,
            answers: question.Answers,
            comments: question.Answers.Comments,
            csrfToken: req.csrfToken(),
            isLoggedIn: res.locals.authenticated,
        });
    }));

router.post(
    '/:questionId(\\d+)',
    csrfProtection,
    asyncHandler(async (req, res) => {
        const questionId = parseInt(req.params.questionId, 10);
        const question = await db.Question.findByPk(questionId);
        const { title, memeUrl } = req.body
        const { userId } = req.session.auth
        const answer = await db.Answer.build({
            //answerId,
            questionId: questionId,
            title,
            userId,
            //memeId,
            memeUrl
        });

        const validatorErrors = validationResult(req);

        if (validatorErrors.isEmpty()) {
            console.log("CHECK HERE ---------------------")
            await answer.save()
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
        const question = await db.Question.findByPk(id);

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
            action: `/questions/${id}/edit`
        });
    }));

router.post('/:questionId(\\d+)/edit', csrfProtection, questionValidators, asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const { userId } = req.session.auth;
    const questionId = parseInt(req.params.questionId, 10)
    const question = await db.Question.findByPk(questionId)


    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        question.update({
            title,
            description,
            userId,

        });

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
        const question = await db.Question.findByPk(id);

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
        const question = await db.Question.findByPk(id);

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
