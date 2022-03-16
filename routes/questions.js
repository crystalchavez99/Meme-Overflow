const express = require('express');
const router = express.Router();
const { Question } = require("../db/models");
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
        });
    }
}));

router.get(
    'questions/:questionId(\\d+)/delete',
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
        });
    }));

module.exports = router;
