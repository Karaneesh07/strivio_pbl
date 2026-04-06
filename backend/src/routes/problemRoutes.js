const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');

router.get('/', problemController.getAllProblems);
router.get('/daily', problemController.getDailyProblem);
router.get('/:id', problemController.getProblemById);

module.exports = router;
