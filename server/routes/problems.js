// routes/problems.js
const express = require('express');
const router = express.Router();
const { getProblems, getProblemById, getRandomProblems } = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getProblems);
router.get('/random', protect, getRandomProblems);
router.get('/:id', protect, getProblemById);

module.exports = router;
