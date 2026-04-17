// controllers/notificationController.js
const { query } = require('../config/db');
const { sendNotification } = require('../services/notificationService');

// POST /api/notifications/register-token
const registerToken = async (req, res) => {
  const { fcm_token } = req.body;
  if (!fcm_token)
    return res.status(400).json({ success: false, message: 'fcm_token is required.' });

  try {
    await query('UPDATE users SET fcm_token = ? WHERE id = ?', [fcm_token, req.user.id]);
    return res.json({ success: true, message: 'FCM token registered.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/notifications/send-reminder  (admin / cron use)
// Sends reminder to users who have not solved today's problem and have notifications enabled
const sendReminders = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  try {
    // Get users who have FCM token, notifications on, and haven't solved today
    const { rows: users } = await query(
      `SELECT u.id, u.name, u.fcm_token
       FROM users u
       WHERE u.notifications_enabled = TRUE
         AND u.fcm_token IS NOT NULL
         AND u.id NOT IN (
           SELECT s.user_id FROM submissions s
           WHERE s.status = 'Passed' AND DATE(s.created_at) = ?
         )`,
      [today]
    );

    const results = await Promise.allSettled(
      users.map((u) =>
        sendNotification(
          u.fcm_token,
          "⚡ Don't break your streak, " + u.name + '!',
          "Today's DSA challenge is waiting. Keep your consistency going!"
        )
      )
    );

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    return res.json({ success: true, sent, failed, total: users.length });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { registerToken, sendReminders };
