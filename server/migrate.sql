-- migrate.sql — Strivio Full Schema (Aiven MySQL)
-- Clean migration: CREATE TABLE IF NOT EXISTS, no seed/mock data.
-- Run via: node server/migrate.js

-- ── 1. Users ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id                    INT AUTO_INCREMENT PRIMARY KEY,
    name                  VARCHAR(100)  NOT NULL,
    email                 VARCHAR(150)  UNIQUE NOT NULL,
    password_hash         VARCHAR(255)  NOT NULL,
    fcm_token             TEXT,
    streak                INTEGER       DEFAULT 0,
    last_solved_date      DATE,
    reminder_time         TIME,
    notifications_enabled TINYINT(1)    DEFAULT 1,
    created_at            TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ── 2. Problems ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS problems (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    description TEXT         NOT NULL,
    difficulty  ENUM('Easy', 'Medium', 'Hard'),
    tags        JSON,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ── 3. Test Cases ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS test_cases (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    problem_id      INTEGER,
    input           TEXT        NOT NULL,
    expected_output TEXT        NOT NULL,
    is_hidden       TINYINT(1)  DEFAULT 0,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
);

-- ── 4. Submissions ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS submissions (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INTEGER,
    problem_id     INTEGER,
    code           TEXT         NOT NULL,
    language       VARCHAR(50)  NOT NULL,
    status         VARCHAR(50)  NOT NULL,
    passed_count   INTEGER      DEFAULT 0,
    total_count    INTEGER      DEFAULT 0,
    execution_time DECIMAL(10,3),
    memory         INTEGER,
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
);

-- ── 5. Daily Problem ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_problem (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    problem_id INTEGER,
    date       DATE UNIQUE NOT NULL,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
);

-- ── 6. Activity Log (Focus Sessions) ─────────────────────────────
CREATE TABLE IF NOT EXISTS activity_log (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INTEGER    NOT NULL,
    time_spent INTEGER    NOT NULL,   -- seconds
    date       DATE       NOT NULL,
    created_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
