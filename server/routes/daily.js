// routes/daily.js
const express = require('express');
const router = express.Router();
const { getDailyChallenge } = require('../controllers/dailyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getDailyChallenge);

module.exports = router;
