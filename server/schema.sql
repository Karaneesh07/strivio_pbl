-- schema.sql — MySQL Database Schema

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fcm_token TEXT,
    streak INTEGER DEFAULT 0,
    last_solved_date DATE,
    reminder_time TIME,
    notifications_enabled TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Problems Table
CREATE TABLE IF NOT EXISTS problems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard'),
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Test Cases Table (Hidden & Sample)
CREATE TABLE IF NOT EXISTS test_cases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    problem_id INTEGER,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_hidden TINYINT(1) DEFAULT 0,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
);

-- 4. Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER,
    problem_id INTEGER,
    code TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'Passed', 'Failed', 'Runtime Error', etc.
    passed_count INTEGER DEFAULT 0,
    total_count INTEGER DEFAULT 0,
    execution_time DECIMAL(10, 3), -- in seconds
    memory INTEGER, -- in KB
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
);

-- 5. Daily Problem Table
CREATE TABLE IF NOT EXISTS daily_problem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    problem_id INTEGER,
    date DATE UNIQUE NOT NULL,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
);

-- Seed Data (Optional - Example Problems)
INSERT INTO problems (title, description, difficulty, tags) VALUES 
('Two Sum', 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', 'Easy', '["array", "hash-table"]'),
('Reverse Integer', 'Given a signed 32-bit integer x, return x with its digits reversed.', 'Medium', '["math"]'),
('Median of Two Sorted Arrays', 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.', 'Hard', '["array", "binary-search"]');

INSERT INTO test_cases (problem_id, input, expected_output, is_hidden) VALUES
(1, '2 7 11 15\n9', '0 1', 0),
(1, '3 2 4\n6', '1 2', 1);
