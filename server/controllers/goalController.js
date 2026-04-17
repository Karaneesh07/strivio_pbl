// controllers/goalController.js
const { query } = require('../config/db');

// GET /api/goals
const getGoals = async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT * FROM weekly_goals WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, goals: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/goals
const createGoal = async (req, res) => {
  const { title, sub_topic, progress, color } = req.body;
  try {
    await query(
      'INSERT INTO weekly_goals (user_id, title, sub_topic, progress, color) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, title, sub_topic, progress || 0, color || '#4361ee']
    );
    res.status(201).json({ success: true, message: 'Goal created.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/goals/:id
const updateGoal = async (req, res) => {
  const { progress, status } = req.body;
  try {
    await query(
      'UPDATE weekly_goals SET progress = COALESCE(?, progress), status = COALESCE(?, status) WHERE id = ? AND user_id = ?',
      [progress, status, req.params.id, req.user.id]
    );
    res.json({ success: true, message: 'Goal updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getGoals, createGoal, updateGoal };
