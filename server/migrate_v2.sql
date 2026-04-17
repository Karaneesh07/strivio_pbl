-- migrate_v2.sql — Additional tables for Notifications, Reflections, and Goals
-- Run via: node server/migrate_v2.js

-- ── 7. Notifications ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INTEGER NOT NULL,
    title      VARCHAR(200) NOT NULL,
    body       TEXT NOT NULL,
    type       VARCHAR(50), -- 'reminder', 'streak', 'achievement', etc.
    is_read    TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── 8. Reflection Journal ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reflections (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INTEGER NOT NULL,
    title      VARCHAR(200) NOT NULL,
    topic      VARCHAR(100), -- 'Arrays', 'DP', etc.
    content    TEXT NOT NULL,
    insight    TEXT,
    confidence INT DEFAULT 3, -- 1-5 scale
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── 9. Weekly Goals ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weekly_goals (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INTEGER NOT NULL,
    title      VARCHAR(200) NOT NULL,
    sub_topic  VARCHAR(200),
    progress   INT DEFAULT 0, -- 0-100
    color      VARCHAR(20) DEFAULT '#4361ee',
    status     VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
