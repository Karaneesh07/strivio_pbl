// controllers/submissionController.js
const { query } = require('../config/db');

// Helper — update streak on the users table
const updateStreak = async (userId) => {
  const { rows } = await query('SELECT streak, last_solved_date FROM users WHERE id = ?', [userId]);
  if (!rows.length) return;

  const user = rows[0];
  const lastSolved = user.last_solved_date ? new Date(user.last_solved_date) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (lastSolved) {
    lastSolved.setHours(0, 0, 0, 0);
    if (lastSolved.getTime() === today.getTime()) return; // Already solved today
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let newStreak = 1;
  if (lastSolved && lastSolved.getTime() === yesterday.getTime()) {
    newStreak = (user.streak || 0) + 1;
  }

  await query(
    'UPDATE users SET streak = ?, last_solved_date = ? WHERE id = ?',
    [newStreak, today.toISOString().slice(0, 10), userId]
  );
};

// Helper — handle success (streak + notification)
const handleSuccess = async (userId, problemId) => {
  await updateStreak(userId);
  
  // Auto-generate a notification
  const { rows: probRows } = await query('SELECT title FROM problems WHERE id = ?', [problemId]);
  const probTitle = probRows[0]?.title || 'Challenge';
  await query(
      'INSERT INTO notifications (user_id, title, body, type) VALUES (?, ?, ?, ?)',
      [userId, 'Problem Solved! ✅', `Congratulations! You successfully solved "${probTitle}".`, 'achievement']
  );
};

// POST /api/submissions
const createSubmission = async (req, res) => {
  const { problem_id, code, language, status, passed_count, total_count, execution_time, memory } = req.body;
  
  if (!problem_id || !status)
    return res.status(400).json({ success: false, message: 'problem_id and status are required.' });

  try {
    const result = await query(
      `INSERT INTO submissions 
       (user_id, problem_id, code, language, status, passed_count, total_count, execution_time, memory) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, 
        problem_id, 
        code || '', 
        language || 'unknown', 
        status, 
        passed_count || 0, 
        total_count || 0, 
        execution_time || 0, 
        memory || 0
      ]
    );

    const { rows: subRows } = await query('SELECT * FROM submissions WHERE id = ?', [result.rows.insertId]);
    const submission = subRows[0];

    if (status === 'Passed' || status === 'solved') {
      await handleSuccess(req.user.id, problem_id);
    }

    return res.status(201).json({ success: true, submission });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/submissions/me
const getMySubmissions = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT s.*, p.title AS problem_title, p.difficulty
       FROM submissions s
       JOIN problems p ON s.problem_id = p.id
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC`,
      [req.user.id]
    );
    return res.json({ success: true, total: rows.length, submissions: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createSubmission, getMySubmissions, updateStreak, handleSuccess };
