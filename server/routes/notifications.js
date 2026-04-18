// routes/notifications.js
const express = require('express');
const router = express.Router();
const { registerToken, sendReminders, getNotifications, markRead, markAllRead, getUnreadCount } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',               protect, getNotifications);
router.get('/unread-count',   protect, getUnreadCount);
router.patch('/:id/read',     protect, markRead);
router.patch('/read-all',     protect, markAllRead);
router.post('/register-token',protect, registerToken);
router.post('/send-reminders',protect, sendReminders);

module.exports = router;
