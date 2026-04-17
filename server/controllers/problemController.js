// controllers/problemController.js
const { query } = require('../config/db');

// GET /api/problems  — optional ?difficulty=Easy|Medium|Hard
const getProblems = async (req, res) => {
  const { difficulty } = req.query;
  try {
    let sql = 'SELECT * FROM problems';
    const params = [];
    if (difficulty) {
      sql += ' WHERE difficulty = ?';
      params.push(difficulty);
    }
    sql += ' ORDER BY id ASC';
    const { rows } = await query(sql, params);
    return res.json({ success: true, total: rows.length, problems: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/problems/:id
const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await query('SELECT * FROM problems WHERE id = ?', [id]);
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    return res.json({ success: true, problem: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/problems/random — returns 3 random problems
const getRandomProblems = async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM problems ORDER BY RAND() LIMIT 3');
    return res.json({ success: true, problems: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProblems, getProblemById, getRandomProblems };
