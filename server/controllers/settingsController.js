// controllers/settingsController.js
const { query } = require('../config/db');

// GET /api/settings
const getSettings = async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT reminder_time, notifications_enabled FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found.' });
    return res.json({ success: true, settings: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/settings
const updateSettings = async (req, res) => {
  const { reminder_time, notifications_enabled, fcm_token } = req.body;
  const fields = [];
  const values = [];

  if (reminder_time !== undefined) {
    fields.push('reminder_time = ?');
    values.push(reminder_time);
  }
  if (notifications_enabled !== undefined) {
    fields.push('notifications_enabled = ?');
    values.push(notifications_enabled);
  }
  if (fcm_token !== undefined) {
    fields.push('fcm_token = ?');
    values.push(fcm_token);
  }

  if (!fields.length)
    return res.status(400).json({ success: false, message: 'No fields to update.' });

  values.push(req.user.id);
  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  
  try {
    await query(sql, values);
    return res.json({ success: true, message: 'Settings updated.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getSettings, updateSettings };
