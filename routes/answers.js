const express = require('express')
const router = express.Router()
const { requireAuth } = require('../auth')
const db = require('../db/models')
const { check, validationResult } = require('express-validator')
const { asyncHandler, handleValidationErrors, csrfProtection } = require('../utils')
// const { route } = require('.')
//const modal = document.getElementById("modal")




const answerValidators = [
    check('memeUrl')
        .exists({ checkFalsy: true })
        .withMessage('Please put a meme for the answer')
]

router.get('/', asyncHandler(async (req, res) => {
    const answers = await db.Answer.findAll({
        order: [["createdAt", "DESC"]]

    })
    //console.log(answers)
    res.render("./answers/answer", { answers })
}))

router.post('/new', requireAuth, csrfProtection, answerValidators, asyncHandler(async (req, res) => {
    console.log("IN ANSWER POST ROUTE ======================================================")
    //parse in the string of the questionId into integer
    //const answerId = parseInt(req.params.answerId)
    //const answer = await db.Answer.findByPk(answerId)
    const { title, memeUrl } = req.body
    const { userId } = req.session.auth
    const answer = db.Answer.build({
        //answerId,
        questionId: questionId,
        title,
        userId,
        //memeId,
        memeUrl
    })


    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        console.log("CHECK HERE ---------------------")
        await answer.save()
        res.redirect(`/questions/${answer.questionId}`);
    } else {
        console.log("LOOK HERE +++++++++++++++")
        const errors = validatorErrors.array().map((err) => err.msg);
        res.render('./answers/answer-form', {
            title,
            memeUrl,
            errors,
            csrfToken: req.csrfToken()
        });
    }

})
)

//TESTING MIDDLEWARE
// router.use((req,res,next) => {
//     console.log("REQUEST GET UP TO THIS POINT +++++++++++++++++++++++++++++++")
//     next();

// })

router.get('/new', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    console.log("GET WORKS ===============")
    const url = req.url;
    console.log(url);
    const answerId = parseInt(req.params.answerId, 10)
    //const answer = await db.Answer.findByPk(answerId)
    //console.log("CHECK HERE =============", question)
    const answer = db.Answer.build();
    res.render('./answers/answer-form', { answer, csrfToken: req.csrfToken() })
}
)
)


router.get('/:answerId/edit', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const answerId = parseInt(req.params.answerId, 10)
    const answer = await db.Answer.findByPk(answerId)
    const { title, memeUrl } = req.body

    if (!res.locals.authenticated) {
        return res.redirect('/login');
    }

    if (req.session.auth.userId !== answer.userId) {
        res.status = 403;
        return res.redirect('/');
    }


    res.render('./answers/answer-edit', { answer, csrfToken: req.csrfToken(), isLoggedIn: res.locals.authenticated, })



}))




router.post('/:answerId/edit', requireAuth, csrfProtection, answerValidators, asyncHandler(async (req, res) => {
    const answerId = parseInt(req.params.answerId, 10)
    const answerUpdate = await db.Answer.findByPk(answerId)
    const { title, memeUrl } = req.body
    const answer = { title, memeUrl }

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        //console.log("CHECK HERE ---------------------")
        await answerUpdate.update(answer)
        res.redirect(`/questions/${answerUpdate.questionId}`);
    } else {
        //console.log("LOOK HERE +++++++++++++++")
        const errors = validatorErrors.array().map((err) => err.msg);
        res.render('./answers/answer-form', {
            title,
            memeUrl,
            errors,
            csrfToken: req.csrfToken()
        });
    }
}))


router.get('/:answerId/delete', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const answerId = parseInt(req.params.answerId, 10)
    const answer = await db.Answer.findByPk(answerId)

    if (!res.locals.authenticated) {
        return res.redirect('/login');
    }

    if (req.session.auth.userId !== answer.userId) {
        res.status = 403;
        return res.redirect('/');
    }

    res.render('./answers/answer-delete', { answer, csrfToken: req.csrfToken() })
}))



router.post('/:answerId/delete', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    console.log("CHECK =============================================")
    const answerId = parseInt(req.params.answerId, 10)
    const answer = await db.Answer.findByPk(answerId)
    if(answer){
        await answer.destroy()
        console.log("DESTROY =============================================")
        res.json({message: "Success"})
        //res.redirect(`/questions/${answer.questionId}`)
    }else{
        res.json({message: "Failure"})
    }
    //await answer.destroy();


}))


router.post('/:answerId(\\d+)/upvote', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const answerId = parseInt(req.params.answerId, 10);
    const { userId: voterId } = req.session.auth;
    let voteCount = 0;

    const answer = await db.Answer.findByPk(answerId, {
        include: [User, Upvote, Downvote],
    });
    console.log(JSON.stringify(answer, null, 2));

    if (answer.Upvote.length) {
        // originally had upvote, user clicks it and gets rid of upvote
        const upvote = await db.Upvote.findOne({
            where: {
                answerId,
                userId: voterId,
            }
        });

        await upvote.destroy();
        res.json({ voteCount: voteCount - 1 });
    } else if (answer.Downvote.length) {
        // originally had downvote, user clicks it and changes downvote to upvote
        const downvote = await db.Downvote.findOne({
            where: {
                answerId,
                userId: voterId,
            }
        });

        await downvote.destroy();

        await db.Upvote.create({
            answerId,
            userId: voterId,
        });

        res.json({ voteCount: voteCount + 2 });
    } else {
        // user clicks upvote, just do upvote

        await db.Upvote.create();
        await db.Upvote.create({
            answerId,
            userId: voterId,
        });

        res.json({ voteCount: voteCount + 1 });
    }
}
))

module.exports = router;
