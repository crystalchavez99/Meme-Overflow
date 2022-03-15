const  express = require('express');
const  router = express.Router();
const {User} = require("../db/models");
const {check,validationResult} = require("express-validator")
const {asyncHandler, handleValidationErrors,csrfProtection} = require("../utils")

const userValidators = [
  check('username')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for Username')
      .isLength({ max: 30 })
      .withMessage('Username must not be more than 30 characters long'),
  check('email')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for Email Address')
      .isLength({ max: 50 })
      .withMessage('Email Address must not be more than 50 characters long')
      .isEmail()
      .withMessage('Email Address is not a valid email')
      .custom((value) => {
          return User.findOne({
              where: {
                  email: value,
              }
          }).then((user) => {
              if (user) {
                  return Promise.reject('The provided Email Address is already in use by another account');
              }
          });
      }),
  check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for Password')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
      .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
  check('confirmPassword')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for Confirm Password')
      .custom((value, { req }) => {
          if (value !== req.body.password) {
              throw new Error('Confirm Password does not match Password');
          }
          return true;
      }),
];


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'a/A Express Skeleton Home' });
});

router.get(
  "/signup",
  csrfProtection,
  asyncHandler(async(req,res)=>{
    const user = User.build();
  res.render("sign-up",{
    title: 'Sign Up',
    user,
    csrfToken: req.csrfToken()
  })
}));

router.post(
  "/signup",
  csrfProtection,
  userValidators,
  asyncHandler(async(req,res)=>{
    const {username,email,password,confirmPassword} = req.body;

    const user = User.build({
      username,
      email
    });


  })

)



// router.get("/login",asyncHandler(async(req,res)=>{

// }));

module.exports = router;
