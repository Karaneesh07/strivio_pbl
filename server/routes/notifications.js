// routes/notifications.js
const express = require('express');
const router = express.Router();
const { registerToken, sendReminders, getNotifications, markRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.patch('/:id/read', protect, markRead);
router.post('/register-token', protect, registerToken);
router.post('/send-reminders', protect, sendReminders); // ideally called by a cron or admin

module.exports = router;
