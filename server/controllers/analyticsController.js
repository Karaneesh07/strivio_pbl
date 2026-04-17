// controllers/analyticsController.js
const { query } = require('../config/db');

// GET /api/analytics/me
const getMyAnalytics = async (req, res) => {
  const userId = req.user.id;
  try {
    // 1. Core stats (Roundtrip 1)
    const { rows: statsRows } = await query(
      `SELECT 
        u.streak,
        COUNT(s.id) AS total_attempts,
        SUM(CASE WHEN s.status IN ('Passed', 'solved') THEN 1 ELSE 0 END) AS total_solved,
        AVG(CASE WHEN s.status IN ('Passed', 'solved') AND s.execution_time > 0 THEN s.execution_time ELSE NULL END) AS avg_time
       FROM users u
       LEFT JOIN submissions s ON u.id = s.user_id
       WHERE u.id = ?
       GROUP BY u.id`,
      [userId]
    );

    const stats = statsRows[0] || { streak: 0, total_attempts: 0, total_solved: 0, avg_time: 0 };
    const total_solved = parseInt(stats.total_solved || 0);
    const total_attempts = parseInt(stats.total_attempts || 0);
    const avg_time = stats.avg_time ? Math.round(parseFloat(stats.avg_time)) : 0;
    const streak = stats.streak || 0;

    const accuracy = total_attempts > 0
      ? ((total_solved / total_attempts) * 100).toFixed(1)
      : '0.0';

    // Skill level logic
    let skill_level = 'Beginner';
    if (total_solved >= 50) skill_level = 'Advanced';
    else if (total_solved >= 15) skill_level = 'Intermediate';

    // 2. Weekly activity & Focus log in PARALLEL (Roundtrip 2)
    const [weeklyRes, focusRes] = await Promise.all([
      query(
        `SELECT DATE(created_at) AS date, COUNT(*) AS count
         FROM submissions
         WHERE user_id = ? AND status IN ('Passed', 'solved') AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
         GROUP BY DATE(created_at)
         ORDER BY date ASC`,
        [userId]
      ),
      query(
        `SELECT SUM(time_spent) AS total_focus
         FROM activity_log
         WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)`,
        [userId]
      ).catch(() => ({ rows: [{ total_focus: 0 }] })) // Handle missing table
    ]);

    const weekly_activity = weeklyRes.rows;
    const total_focus_seconds = focusRes.rows[0]?.total_focus || 0;

    return res.json({
      success: true,
      analytics: {
        total_solved,
        total_attempts,
        accuracy_rate: `${accuracy}%`,
        avg_time_seconds: avg_time,
        skill_level,
        streak,
        weekly_activity,
        total_focus_seconds,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getMyAnalytics };
