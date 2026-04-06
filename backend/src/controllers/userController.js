const db = require('../config/db');

const getUserStats = async (req, res) => {
  const userId = req.userId; 
  try {
    const user = await db.query(`
      SELECT 
        username, 
        current_streak, 
        longest_streak,
        (SELECT COUNT(*) FROM submissions WHERE user_id = $1 AND status = 'ACCEPTED') as total_solved,
        (SELECT COUNT(*) FROM submissions WHERE user_id = $1) as total_attempts
      FROM users WHERE id = $1
    `, [userId]);

    if (user.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const stats = user.rows[0];
    const accuracy = stats.total_attempts > 0 
      ? Math.round((stats.total_solved / stats.total_attempts) * 100) 
      : 0;

    res.json({
      username: stats.username,
      currentStreak: stats.current_streak,
      longestStreak: stats.longest_streak,
      totalProblemsSolved: stats.total_solved,
      accuracyRate: accuracy
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubmissionHistory = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await db.query(`
      SELECT s.*, p.title 
      FROM submissions s 
      JOIN problems p ON s.problem_id = p.id 
      WHERE s.user_id = $1 
      ORDER BY s.created_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUserStats, getSubmissionHistory };
