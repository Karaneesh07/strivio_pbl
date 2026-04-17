// routes/submissions.js
const express = require('express');
const router = express.Router();
const { createSubmission, getMySubmissions } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSubmission);
router.get('/me', protect, getMySubmissions);

module.exports = router;
