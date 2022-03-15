const express = require('express');
const router = express.Router();
const { Question } = require("../db/models")
const { asyncHandler, csrfProtection } = require("../utils")

router.get('/new', csrfProtection, asyncHandler(async (req, res) => {
    const question = await Question.build();

    if (!res.locals.authenticated) {
        return res.redirect('/login');
    }

    res.render('questions/questions-new', {
        title: 'Ask A Question',
        question,
        csrfToken: csrfToken(),
    });
}));


module.exports = router;
