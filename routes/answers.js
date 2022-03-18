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

router.get('/',asyncHandler(async(req,res)=>{
    const answers = await db.Answer.findAll({
        order:[["createdAt","DESC"]]

    })
    //console.log(answers)
    res.render('questions/question-display.pug', {
        title: question.title,
        question,
        answers,
        // comments,
        csrfToken: req.csrfToken(),
        isLoggedIn: res.locals.authenticated,
    });
}))

router.post('/',requireAuth,asyncHandler(async(req,res)=>{
  const { title, memeUrl, questionId} = req.body
  console.log("====== POST ANSWER IS RUNNING ======")
  const { userId } = req.session.auth
  const answer = await db.Answer.create({
      title,
      memeUrl,
      questionId,
      userId
  })

  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
      console.log("CHECK HERE ---------------------")
      await answer.save()
      res.redirect(`/questions/${questionId}`);
  } else {
      console.log("LOOK HERE +++++++++++++++")
      const errors = validatorErrors.array().map((err) => err.msg);
      res.render('answers/answer-form', {
          title,
          memeUrl,
          errors,
          csrfToken: req.csrfToken()
      });
  }
  res.json({message:"success"} )
})
)



//create = build + save

// // router.get('/new', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
// //     console.log("GET WORKS ===============")
// //     const url = req.url;
// //     console.log(url);
// //     const answerId = parseInt(req.params.answerId, 10)
// //     //const answer = await db.Answer.findByPk(answerId)
// //     //console.log("CHECK HERE =============", question)
// //     const answer = db.Answer.build();
// //     res.render('./answers/answer-form', {answer,csrfToken:req.csrfToken()})
// // }
// // )
// // )

// router.post('/new', requireAuth, csrfProtection, answerValidators, asyncHandler(async (req, res) => {
//     console.log("IN ANSWER POST ROUTE ======================================================")
//     //parse in the string of the questionId into integer
//     //const answerId = parseInt(req.params.answerId)
//     //const answer = await db.Answer.findByPk(answerId)
//     const { title, memeUrl, questionId } = req.body
//     const { userId } = req.session.auth
//     const answer = await db.Answer.create({
//         //answerId,
//         questionId,
//         title,
//         userId,
//         //memeId,
//         memeUrl
//     })


//     const validatorErrors = validationResult(req);

//     if (validatorErrors.isEmpty()) {
//         console.log("CHECK HERE ---------------------")
//         await answer.save()
//         res.redirect(`/questions/${questionId}`);
//     } else {
//         console.log("LOOK HERE +++++++++++++++")
//         const errors = validatorErrors.array().map((err) => err.msg);
//         res.render('answers/answer-form', {
//             title,
//             memeUrl,
//             errors,
//             csrfToken: req.csrfToken()
//         });
//     }
//     res.json({message:"success"} )
// })
// )

//TESTING MIDDLEWARE
// router.use((req,res,next) => {
//     console.log("REQUEST GET UP TO THIS POINT +++++++++++++++++++++++++++++++")
//     next();

// })

// router.get('/:answerId(\\d+)',requireAuth,csrfProtection,asyncHandler(async(req,res)=>{
//     const answerId = parseInt(req.params.answerId,10);
//     const answer = await db.Answer.findByPk(answerId);
//     const comments= await db.Comment.findAll({
//         where:{
//             answerId: answer.id
//         },
//         order: [["createdAt", "DESC"]]
//     })
//     //const { content } = req.body

//     if (!res.locals.authenticated) {
//         return res.redirect('/login');
//     }

//     if (req.session.auth) {
//         comments.forEach(async (comment) => {
//           if ((comment.userId === req.session.auth.userId)) {
//             comment.unlocked = true;
//           }
//         });
//       }
//     res.render('questions/question-display.pug', {
//         title: question.title,
//         question,
//         answers,
//         // comments,
//         csrfToken: req.csrfToken(),
//         isLoggedIn: res.locals.authenticated,
//     });



// }))

router.get('/:answerId(\\d+)/edit',requireAuth,csrfProtection,asyncHandler(async(req,res)=>{
    const answerId = parseInt(req.params.answerId,10)
    const answer = await db.Answer.findByPk(answerId)
    //const { title, memeUrl } = req.body

    if (!res.locals.authenticated) {
        return res.redirect('/login');
    }

    if (req.session.auth.userId !== answer.userId) {
        res.status = 403;
        return res.redirect('/');
    }


    res.render('answers/answer-edit',{
        answer,
        csrfToken:req.csrfToken(),
        isLoggedIn: res.locals.authenticated,})
}))




router.post('/:answerId(\\d+)/edit',requireAuth,csrfProtection,answerValidators,asyncHandler(async(req,res)=>{
    const answerId = parseInt(req.params.answerId,10)
    const answerUpdate = await db.Answer.findByPk(answerId)
    //const { userId } = req.session.auth;
    const { title, memeUrl } = req.body
    const answer = {title,memeUrl}

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        //console.log("CHECK HERE ---------------------")
        await answerUpdate.update(answer)
        res.redirect(`/`);
    } else {
        //console.log("LOOK HERE +++++++++++++++")
        const errors = validatorErrors.array().map((err) => err.msg);
        res.render('answers/answer-form', {
            title,
            memeUrl,
            errors,
            csrfToken: req.csrfToken()
        });
    }
}))


router.get('/:answerId(\\d+)/delete',
    requireAuth,
    csrfProtection,
    asyncHandler(async(req,res)=>{
    const answerId = parseInt(req.params.answerId,10)
    const answer = await db.Answer.findByPk(answerId)

    if (!res.locals.authenticated) {
        return res.redirect('/login');
    }

    if (req.session.auth.userId !== answer.userId) {
        res.status = 403;
        return res.redirect('/');
    }

    res.render('answers/answer-delete',{
        answer,
        csrfToken:req.csrfToken()})
}))



router.post('/:answerId(\\d+)/delete',
requireAuth,
csrfProtection,
asyncHandler(async(req,res)=>{
    console.log("CHECK =============================================")
    const answerId = parseInt(req.params.answerId,10)
    const answer = await db.Answer.findByPk(answerId)

    if (!res.locals.authenticated) {
        return res.redirect('/login');
    }

    if (req.session.auth.userId !== question.userId) {
        res.status = 403;
        return res.redirect('/');
    }


    await answer.destroy();
    console.log("DESTROY =============================================")
    res.redirect('/');
}))



module.exports = router;
