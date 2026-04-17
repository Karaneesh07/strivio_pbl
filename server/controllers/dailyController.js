// controllers/dailyController.js
const { query } = require('../config/db');

// GET /api/daily  — returns today's problem
const getDailyChallenge = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const userId = req.user?.id;

  try {
    // 1. Check if a daily challenge exists for today
    let { rows } = await query(
      `SELECT p.* FROM daily_problem dp 
       JOIN problems p ON dp.problem_id = p.id 
       WHERE dp.date = ?`,
      [today]
    );

    // 2. If not, pick a random problem and set it as today's challenge
    if (rows.length === 0) {
      const { rows: allProbs } = await query('SELECT id FROM problems');
      if (allProbs.length > 0) {
        const randomProbId = allProbs[Math.floor(Math.random() * allProbs.length)].id;
        await query('INSERT IGNORE INTO daily_problem (problem_id, date) VALUES (?, ?)', [randomProbId, today]);
        
        // Re-fetch
        const { rows: newRows } = await query(
          `SELECT p.* FROM daily_problem dp 
           JOIN problems p ON dp.problem_id = p.id 
           WHERE dp.date = ?`,
          [today]
        );
        rows = newRows;
      }
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No challenges available.' });
    }

    const problem = rows[0];

    // 3. Check if current user has solved it (if logged in)
    let solved = false;
    if (userId) {
      const { rows: subRows } = await query(
        "SELECT status FROM submissions WHERE user_id = ? AND problem_id = ? AND status IN ('Passed', 'solved')",
        [userId, problem.id]
      );
      solved = subRows.length > 0;
    }

    return res.json({ success: true, daily: { ...problem, solved } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDailyChallenge };
