// controllers/focusController.js
// Focus sessions: start/end — duration stored in activity_log
const { query } = require('../config/db');

// In-memory store for active sessions per user (for a single-instance server)
const activeSessions = {};

// POST /api/focus/start
const startFocus = async (req, res) => {
  try {
    const userId = req.user.id;

    if (activeSessions[userId]) {
      return res.status(400).json({
        success: false,
        message: 'Focus session already active.',
      });
    }

    activeSessions[userId] = Date.now();

    return res.json({
      success: true,
      message: 'Focus session started.',
      started_at: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// POST /api/focus/end
const endFocus = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!activeSessions[userId]) {
      return res.status(400).json({
        success: false,
        message: 'No active focus session found.',
      });
    }

    const elapsed = Math.round(
        (Date.now() - activeSessions[userId]) / 1000
    ); // seconds

    delete activeSessions[userId];

    const today = new Date().toISOString().slice(0, 10);

    // Using a simple insert for activity_log
    await query(
        'INSERT INTO activity_log (user_id, time_spent, date) VALUES (?, ?, ?)',
        [userId, elapsed, today]
    );

    return res.json({
      success: true,
      message: 'Focus session ended.',
      duration_seconds: elapsed,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET /api/focus/history
const getFocusHistory = async (req, res) => {
  try {
    const { rows } = await query(
        `SELECT date, SUM(time_spent) AS total_seconds 
       FROM activity_log 
       WHERE user_id = ? 
       GROUP BY date 
       ORDER BY date DESC 
       LIMIT 30`,
        [req.user.id]
    );

    return res.json({
      success: true,
      history: rows,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { startFocus, endFocus, getFocusHistory };