const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/me/stats', authMiddleware, userController.getUserStats);
router.get('/me/submissions', authMiddleware, userController.getSubmissionHistory);

module.exports = router;
