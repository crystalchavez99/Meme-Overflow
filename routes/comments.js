const express = require('express')
const router = express.Router()
const { requireAuth } = require('../auth')
const db = require('../db/models')
const { check, validationResult } = require('express-validator')
const { asyncHandler, handleValidationErrors, csrfProtection } = require('../utils')

const commentValidators = [
    check('content')
        .exists({ checkFalsy: true })
        .withMessage('Please put the content for the comment')
]

router.get('/', asyncHandler(async (req, res) => {
    const comments = await db.Comment.findAll({
        order: [["createdAt", "DESC"]]
    })
    res.render("./comments/comment", { comments })
}))

router.get('/new', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const commentId = parseInt(req.params.commentId, 10)
    const comment = db.Comment.build()
    res.render('./comments/comment-form', { comment, csrfToken: req.csrfToken() })
}))



router.post('/new', requireAuth, csrfProtection, commentValidators, asyncHandler(async (req, res) => {
    const { content } = req.body
    const { userId } = req.session.auth
    const comment = db.Comment.build({
        answerId,
        content,
        userId
    })

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        await comment.save()
        res.redirect(`/comments`);
    } else {
        const errors = validatorErrors.array().map((err) => err.msg)
        res.render('./comments/comment-form', {
            content,
            errors,
            csrfToken: req.csrfTplken()
        })
    }

}))


router.get('/:commentId/edit', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const commentId = parseInt(req.params.commentId, 10)
    const comment = await db.Comment.findByPk(commentId);
    const answer = await db.Answer.findByPk(comment.answerId)
    const { content } = req.body

    if (!res.locals.authenticated) {
        return res.redirect('/login')
    }

    if (req.session.auth.userId !== comment.userId) {
        res.status = 403;
        return res.redirect('/');
    }

    res.render('./comments/comment-edit', {
        comment,
        answer,
        csrfToken: req.csrfToken(),
        isLoggedIn: res.locals.authenticated,
        sessionUser: res.locals.user ? res.locals.user : undefined,
    })

}))


router.post('/:commentId/edit', requireAuth, csrfProtection, commentValidators, asyncHandler(async (req, res) => {
    const commentId = parseInt(req.params.commentId, 10)
    const commentUpdate = await db.Comment.findByPk(commentId, {
        include: {
            model: db.Answer
        }
    });
    const answer = await db.Answer.findByPk(commentUpdate.answerId);
    const { content } = req.body
    const comment = { content }

    const validatorErrors = validationResult(req)

    if (validatorErrors.isEmpty()) {
        await commentUpdate.update(comment)
        res.redirect(`/questions/${answer.questionId}`);
    } else {
        const errors = validatorErrors.array().map((err) => err.msg)
        res.render('./comments/comment-form', {
            content,
            errors,
            csrfToken: req.csrfToken()
        })
    }
}))

router.get('/:commentId/delete', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const commentId = parseInt(req.params.commentId, 10)
    const comment = await db.Comment.findByPk(commentId)

    if (!res.locals.authenticated) {
        return res.redirect('/login')
    }

    if (req.session.auth.userId !== comment.userId) {
        res.status = 403;
        return res.redirect('/')
    }

    res.render('./comments/comment-delete', { comment, csrfToken: req.csrfToken() })
}))

router.post('/:commentId/delete', requireAuth, asyncHandler(async (req, res) => {
    const commentId = parseInt(req.params.commentId, 10)
    const comment = await db.Comment.findByPk(commentId)
    const answer = await db.Answer.findByPk(comment.answerId);
    await comment.destroy()
    res.redirect(`/questions/${answer.questionId}`)
}))

module.exports = router;
