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
         (SELECT COUNT(*) FROM submissions s
          WHERE s.user_id = u.id AND s.status = 'Passed') AS total_solved
       FROM users u
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
