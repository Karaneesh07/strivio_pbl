// routes/code.js
const express = require('express');
const router = express.Router();
const { runCode, submitCode } = require('../controllers/codeController');
const { protect } = require('../middleware/authMiddleware');

// Public route for running (optional choice, but user usually wants to test before login)
// However, protect is better to avoid API abuse.
router.post('/run', protect, runCode);
router.post('/submit', protect, submitCode);

module.exports = router;
