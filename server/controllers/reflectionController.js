// controllers/reflectionController.js
const { query } = require('../config/db');

// GET /api/reflections
const getReflections = async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT * FROM reflections WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, reflections: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/reflections
const createReflection = async (req, res) => {
  const { title, topic, content, insight, confidence } = req.body;
  try {
    await query(
      'INSERT INTO reflections (user_id, title, topic, content, insight, confidence) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, title, topic, content, insight, confidence || 3]
    );
    res.status(201).json({ success: true, message: 'Reflection saved.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/reflections/:id
const deleteReflection = async (req, res) => {
  try {
    await query('DELETE FROM reflections WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Reflection deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getReflections, createReflection, deleteReflection };
