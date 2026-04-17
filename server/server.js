// server.js — Strivio Express Server Entry Point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { startCronJobs } = require('./utils/cronJobs');
// ── Route Modules ──────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problems');
const dailyRoutes = require('./routes/daily');
const submissionRoutes = require('./routes/submissions');
const analyticsRoutes = require('./routes/analytics');
const focusRoutes = require('./routes/focus');
const leaderboardRoutes = require('./routes/leaderboard');
const notificationRoutes = require('./routes/notifications');
const settingsRoutes = require('./routes/settings');
const codeRoutes = require('./routes/code');

const app = express();


// ── Middleware ─────────────────────────────────────────────────
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', // Vite default
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ success: true, message: 'Strivio API is running 🚀' }));

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/daily', dailyRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/focus', focusRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/code', codeRoutes);

// ── 404 catchall ───────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

// ── Global Error Handler ───────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.stack);
    res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ── Start ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const { testConnection } = require('./config/db');

async function startServer() {
    const isDbConnected = await testConnection();
    if (!isDbConnected) {
        console.error('🛑 Critical failure: Could not connect to database. Server may not function correctly.');
    }

    app.listen(PORT, () => {
        console.log(`\n🚀 Strivio server running at http://localhost:${PORT}`);
        console.log('📄 API base: /api\n');
        startCronJobs();
    });
}

startServer();
