// routes/focus.js
const express = require('express');
const router = express.Router();
const { startFocus, endFocus, getFocusHistory } = require('../controllers/focusController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startFocus);
router.post('/end', protect, endFocus);
router.get('/history', protect, getFocusHistory);

module.exports = router;
