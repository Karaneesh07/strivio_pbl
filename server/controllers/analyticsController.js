// controllers/analyticsController.js
const { query } = require('../config/db');

// GET /api/analytics/me
const getMyAnalytics = async (req, res) => {
  const userId = req.user.id;
  try {
    // Total problems solved
    const { rows: totalRows } = await query(
      "SELECT COUNT(*) AS total_solved FROM submissions WHERE user_id = ? AND status = 'Passed'",
      [userId]
    );
    const total_solved = parseInt(totalRows[0].total_solved || '0');

    // Accuracy rate = solved / total attempts
    const { rows: attemptsRows } = await query(
      'SELECT COUNT(*) AS total_attempts FROM submissions WHERE user_id = ?',
      [userId]
    );
    const total_attempts = parseInt(attemptsRows[0].total_attempts || '0');
    const accuracy = total_attempts > 0
      ? ((total_solved / total_attempts) * 100).toFixed(1)
      : '0.0';

    // Average time taken (only solved submissions with a time)
    const { rows: avgRows } = await query(
      "SELECT AVG(execution_time) AS avg_time FROM submissions WHERE user_id = ? AND status = 'Passed' AND execution_time > 0",
      [userId]
    );
    const avg_time = avgRows[0].avg_time ? Math.round(parseFloat(avgRows[0].avg_time)) : 0;

    // Skill level
    let skill_level = 'Beginner';
    if (total_solved >= 50) skill_level = 'Advanced';
    else if (total_solved >= 15) skill_level = 'Intermediate';

    // Current streak from users table
    const { rows: userRows } = await query('SELECT streak FROM users WHERE id = ?', [userId]);
    const streak = userRows[0]?.streak || 0;

    // Weekly activity — problems solved in last 7 days per day
    const { rows: weeklyRows } = await query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS count
       FROM submissions
       WHERE user_id = ? AND status = 'Passed' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [userId]
    );

    // Total focus time this week (Placeholder as activity_log is custom)
    let total_focus_seconds = 0;
    try {
        const { rows: focusRows } = await query(
            `SELECT SUM(time_spent) AS total_focus
             FROM activity_log
             WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)`,
            [userId]
          );
          total_focus_seconds = focusRows[0].total_focus || 0;
    } catch (e) {
        // Table might not exist yet
    }

    return res.json({
      success: true,
      analytics: {
        total_solved,
        total_attempts,
        accuracy_rate: `${accuracy}%`,
        avg_time_seconds: avg_time,
        skill_level,
        streak,
        weekly_activity: weeklyRows,
        total_focus_seconds,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getMyAnalytics };
