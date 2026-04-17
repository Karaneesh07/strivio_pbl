// controllers/leaderboardController.js
const { query } = require('../config/db');

// GET /api/leaderboard  — ranked by streak DESC, then total solved DESC
const getLeaderboard = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  try {
    const { rows } = await query(
      `SELECT
         u.id,
         u.name,
         u.streak,
         COUNT(s.id) AS total_solved,
         (COUNT(s.id) * 50) AS xp
       FROM users u
       LEFT JOIN submissions s ON u.id = s.user_id AND s.status IN ('Passed', 'solved')
       GROUP BY u.id
       ORDER BY u.streak DESC, total_solved DESC
       LIMIT ?`,
      [limit]
    );

    // Add rank
    const ranked = rows.map((r, idx) => ({ rank: idx + 1, ...r }));
    return res.json({ success: true, leaderboard: ranked });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getLeaderboard };
