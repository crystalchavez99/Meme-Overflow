const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User, Question, Answer } = require("../db/models");
const { check, validationResult } = require("express-validator")
const { asyncHandler, handleValidationErrors, csrfProtection } = require("../utils")
const { loginUser, restoreUser, requireAuth, logoutUser } = require('../auth');

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
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const questions = await Question.findAll({
      include: [Answer],
      order: [['createdAt', 'DESC']],
    });
    if (req.session.auth) {
      questions.forEach(async (question) => {
        if ((question.userId === req.session.auth.userId)) {
          question.unlocked = true;
        }
      });
    }

    res.render('index', {
      title: 'Meme Overflow',
      questions,
      isLoggedIn: req.session.auth,
    });
  }));

router.get(
  "/signup",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const user = User.build();

    res.render("sign-up", {
      title: 'Sign Up',
      user,
      csrfToken: req.csrfToken(),
      isLoggedIn: res.locals.authenticated,
    })
  }));

router.post(
  "/signup",
  csrfProtection,
  userValidators,
  asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const user = User.build({
      username,
      email,
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      const hashedPassword = await bcrypt.hash(password, 12);
      user.hashedPassword = hashedPassword;

      await user.save();
      loginUser(req, res, user);
    } else {
      const errors = validatorErrors.array().map((err) => err.msg);
      res.render('sign-up', {
        title: 'Sign Up',
        user,
        errors,
        csrfToken: req.csrfToken(),
        isLoggedIn: res.locals.authenticated,
      });
    }
  }));

router.get(
  "/login",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const user = User.build();
    res.render('login', {
      title: 'Login',
      user,
      csrfToken: req.csrfToken(),
      isLoggedIn: res.locals.authenticated,
    });
  }));

const loginValidators = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password'),
];

router.post(
  "/login",
  csrfProtection,
  loginValidators,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    let errors = [];
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (user !== null) {
        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword.toString());

        if (passwordMatch) {
          return loginUser(req, res, user);
        }
      }

      errors.push('Login failed for the provided email address and password');
    } else {
      errors = validatorErrors.array().map((err) => err.msg);
    }

    res.render('login', {
      title: 'Log In',
      email,
      errors,
      csrfToken: req.csrfToken(),
      isLoggedIn: res.locals.authenticated,
    });
  }));

router.post('/login-demo', csrfProtection, asyncHandler(async (req, res) => {
  const user = await User.findByPk(1);

  return loginUser(req, res, user);
}));

router.post("/logout", (req, res) => logoutUser(req, res));

module.exports = router;
