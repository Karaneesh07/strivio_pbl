-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_submission_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Problems Table
CREATE TABLE problems (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    starter_code_java TEXT,
    starter_code_cpp TEXT,
    test_cases JSONB NOT NULL, -- Array of {input, expected_output}
    hidden_test_cases JSONB NOT NULL, -- Array of {input, expected_output}
    daily_date DATE UNIQUE, -- For the daily problem system
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Submissions Table
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    problem_id INT REFERENCES problems(id),
    code TEXT NOT NULL,
    language VARCHAR(20) NOT NULL, -- 'java', 'cpp'
    status VARCHAR(20), -- 'ACCEPTED', 'REJECTED'
    passed_count INT DEFAULT 0,
    total_count INT DEFAULT 0,
    execution_time FLOAT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reminders (FCM token)
CREATE TABLE user_reminders (
    user_id INT REFERENCES users(id) PRIMARY KEY,
    fcm_token TEXT,
    reminder_time TIME DEFAULT '09:00:00',
    is_enabled BOOLEAN DEFAULT TRUE
);

-- Journal Features
CREATE TABLE journals (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    submission_id INT REFERENCES submissions(id),
    title VARCHAR(255),
    notes TEXT,
    improvement_tag VARCHAR(50), -- e.g., 'Optimized Time', 'Better Variable Naming'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
