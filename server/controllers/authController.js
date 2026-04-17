// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'All fields are required.' });

  try {
    console.log(`[AUTH] Registering user: ${email}`);
    const { rows: existingUsers } = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      console.log(`[AUTH] Registration failed: Email ${email} already exists.`);
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, password_hash]
    );
    
    // MySQL doesn't support RETURNING *, so fetch the user by insertId
    const { rows: userRows } = await query('SELECT * FROM users WHERE id = ?', [result.rows.insertId]);
    const user = userRows[0];

    if (!user) throw new Error('User not found after insertion.');

    console.log(`[AUTH] User registered successfully: ${email} (ID: ${user.id})`);
    const { password_hash: _, ...safeUser } = user;
    return res.status(201).json({ success: true, token: generateToken(user), user: safeUser });
  } catch (err) {
    console.error(`[AUTH ERROR] Register: ${err.message}`);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password are required.' });

  try {
    console.log(`[AUTH] Login attempt: ${email}`);
    const { rows } = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      console.log(`[AUTH] Login failed: User not found (${email})`);
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      console.log(`[AUTH] Login failed: Password mismatch for ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    console.log(`[AUTH] Login successful: ${email} (ID: ${user.id})`);
    const { password_hash, ...safeUser } = user;
    return res.json({ success: true, token: generateToken(user), user: safeUser });
  } catch (err) {
    console.error(`[AUTH ERROR] Login: ${err.message}`);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me  (protected)
const getMe = async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT id, name, email, streak, last_solved_date, reminder_time, notifications_enabled, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'User not found.' });
    return res.json({ success: true, user: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, getMe };
