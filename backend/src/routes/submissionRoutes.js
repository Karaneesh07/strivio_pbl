const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middlewares/authMiddleware');

// Auth required for run and submit
router.post('/run', authMiddleware, submissionController.runCode);
router.post('/submit', authMiddleware, submissionController.submitCode);

module.exports = router;
