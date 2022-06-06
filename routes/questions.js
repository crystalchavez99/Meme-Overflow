const express = require('express');
const router = express.Router();
const db = require("../db/models");
const { check, validationResult } = require('express-validator');
const { asyncHandler, csrfProtection, isAuthorized } = require("../utils");
const { requireAuth } = require('../auth');

router.get('/new', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
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

router.post('/new', requireAuth, csrfProtection, questionValidators, asyncHandler(async (req, res) => {
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
            isLoggedIn: res.locals.authenticated,
            csrfToken: req.csrfToken(),
            errors,
        });
    }
}));


router.get(
    '/:questionId(\\d+)',
    csrfProtection,
    asyncHandler(async (req, res) => {
        const id = parseInt(req.params.questionId, 10);
        const question = await db.Question.findByPk(id, {
            include: [
                db.User,
                {
                    model: db.Answer,
                    include: [db.Comment, db.Upvote, db.Downvote],
                },
            ]
        });

        question.isAuthorized = isAuthorized(req, res, question);

        // if user is logged in
        if (req.session.auth) {
            // check if any answers are owned by current user
            question.Answers.forEach(async (answer) => {
                answer.isAuthorized = isAuthorized(req, res, answer);

                // check if any comments are owned by current user
                answer.Comments.forEach(async (comment) => {
                    comment.isAuthorized = isAuthorized(req, res, comment);
                })
            });
        }

        for (let answer of question.Answers) {
            answer.voteCount = answer.Upvotes.length - answer.Downvotes.length;

            // check if current user has upvoted/downvoted any answers
            if (req.session.auth) {
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
        }

        res.render('questions/question-display.pug', {
            title: question.title,
            question,
            answers: question.Answers,
            comments: question.Answers.Comments,
            isLoggedIn: res.locals.authenticated,
            sessionUser: res.locals.user ? res.locals.user : undefined,
            csrfToken: req.csrfToken(),
        });
    }));

router.post(
    '/:questionId(\\d+)',
    requireAuth,
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
    requireAuth,
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
            sessionUser: res.locals.user ? res.locals.user : undefined,
            action: `/questions/${id}/edit`
        });
    }));

router.post('/:questionId(\\d+)/edit', requireAuth, csrfProtection, questionValidators, asyncHandler(async (req, res) => {
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
            sessionUser: res.locals.user ? res.locals.user : undefined,
        });
    }
}));

router.get(
    '/:questionId(\\d+)/delete',
    requireAuth,
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
            sessionUser: res.locals.user ? res.locals.user : undefined,
        });
    }));

router.post(
    '/:questionId(\\d+)/delete',
    requireAuth,
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
