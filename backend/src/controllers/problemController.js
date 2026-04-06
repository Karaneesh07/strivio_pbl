const db = require('../config/db');

const getAllProblems = async (req, res) => {
  try {
    const result = await db.query('SELECT id, title, difficulty, description FROM problems');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDailyProblem = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const result = await db.query('SELECT * FROM problems WHERE daily_date = $1', [today]);
    if (result.rows.length === 0) {
      const randomResult = await db.query('SELECT * FROM problems ORDER BY RANDOM() LIMIT 1');
      return res.json(randomResult.rows[0]);
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM problems WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Problem not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllProblems, getDailyProblem, getProblemById };
