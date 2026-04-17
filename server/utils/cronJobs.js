// utils/cronJobs.js — Scheduled jobs using node-cron
const cron = require('node-cron');
const { query } = require('../config/db');

/**
 * Midnight cron: reset streak to 0 for users who missed yesterday.
 */
const startCronJobs = () => {
  // Streak reset — 00:05 every day
  cron.schedule('5 0 * * *', async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);

    try {
      const { rows: result } = await query(
        `UPDATE users
         SET streak = 0
         WHERE streak > 0
           AND (last_solved_date IS NULL OR last_solved_date < ?)`,
        [yStr]
      );
      console.log(`[CRON] Streak reset: ${result.affectedRows} user(s) at midnight.`);
    } catch (err) {
      console.error('[CRON] Streak reset error:', err.message);
    }
  });

  // Daily Reminders — Every hour, check who needs a reminder
  cron.schedule('0 * * * *', async () => {
    const today = new Date().toISOString().slice(0, 10);
    const currentHour = new Date().getHours() + ":00:00"; // Simple match for reminder_time

    try {
      // Find users who have reminders enabled, matching current hour, and haven't solved today
      const { rows: usersToNotify } = await query(
        `SELECT u.id, u.fcm_token 
         FROM users u
         LEFT JOIN submissions s ON u.id = s.user_id AND s.problem_id = (SELECT problem_id FROM daily_problem WHERE date = ?) AND s.status = 'Passed'
         WHERE u.notifications_enabled = TRUE 
           AND u.reminder_time = ?
           AND u.fcm_token IS NOT NULL
           AND s.id IS NULL`, 
        [today, currentHour]
      );

      if (usersToNotify.length > 0) {
        const { sendNotification } = require('../services/notificationService');
        for (const user of usersToNotify) {
          await sendNotification(user.fcm_token, "Solve today's problem 🔥", "Don't break your streak! Today's challenge is waiting.");
        }
        console.log(`[CRON] Sent reminders to ${usersToNotify.length} user(s).`);
      }
    } catch (err) {
      console.error('[CRON] Reminder error:', err.message);
    }
  });

  console.log('⏰ Cron jobs scheduled.');
};

module.exports = { startCronJobs };
