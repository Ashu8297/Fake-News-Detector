-- TruthLens AI Production SQL Database Schema
-- Compatible with SQLite and PostgreSQL

-- 1. Users Table (Authentication & Profile Management)
CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    provider VARCHAR(50) DEFAULT 'email',
    profile_image TEXT,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Index for fast user lookup by email
CREATE INDEX IF NOT EXISTS idx_users_email ON Users(email);


-- 2. Prediction History Table (Audit Log)
CREATE TABLE IF NOT EXISTS PredictionHistory (
    id SERIAL PRIMARY KEY,
    news_text TEXT NOT NULL,
    prediction VARCHAR(50) NOT NULL,
    confidence NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for searching prediction content
CREATE INDEX IF NOT EXISTS idx_history_prediction ON PredictionHistory(prediction);


-- 3. Feedback Table (Model Fine-Tuning Evaluations)
CREATE TABLE IF NOT EXISTS Feedback (
    id SERIAL PRIMARY KEY,
    prediction_id INTEGER REFERENCES PredictionHistory(id) ON DELETE CASCADE,
    user_email VARCHAR(255),
    is_accurate BOOLEAN NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 4. Bookmarks Table (User Saved Analysis Reports)
CREATE TABLE IF NOT EXISTS Bookmarks (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    news_text TEXT NOT NULL,
    prediction VARCHAR(50) NOT NULL,
    confidence NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for user bookmarks lookup
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON Bookmarks(user_email);
