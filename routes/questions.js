const express = require('express');
const router = express.Router();
const { Question } = require("../db/models")

router.get('/', async (req, res) => {
    const questions = await Question.findAll({
        order: [['createdAt', 'DESC']]
    });

})
