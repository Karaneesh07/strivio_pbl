const cron = require('node-cron');
const db = require('../config/db');

const init = () => {
  // Midnight Job: Assign daily problem
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily problem assignment...');
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await db.query('SELECT id FROM problems ORDER BY RANDOM() LIMIT 1');
      if (result.rows.length > 0) {
        await db.query('UPDATE problems SET daily_date = $1 WHERE id = $2', [today, result.rows[0].id]);
        console.log(`Problem ${result.rows[0].id} assigned for ${today}`);
      }
    } catch (error) {
      console.error('Daily problem assignment failed:', error);
    }
  });

  // Morning Job: Push Notifications (9 AM)
  cron.schedule('0 9 * * *', async () => {
    console.log('Sending daily reminders...');
    // In a real app, you'd fetch users who haven't solved today's problem
    // and send FCM notifications.
  });
};

module.exports = { init };
