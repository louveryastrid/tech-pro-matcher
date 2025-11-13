-- JobBoard Database Setup
-- Run this in phpMyAdmin on your Synology NAS

CREATE DATABASE IF NOT EXISTS jobboard_db;
USE jobboard_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email)
);

-- Saved jobs table
CREATE TABLE saved_jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_id VARCHAR(255) NOT NULL,
    job_title VARCHAR(500),
    company VARCHAR(255),
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_save (user_id, job_id),
    INDEX idx_user (user_id)
);

-- Create API user with limited permissions
CREATE USER IF NOT EXISTS 'jobboard_api'@'localhost' IDENTIFIED BY 'ChangeThisPassword123!';
GRANT SELECT, INSERT, UPDATE, DELETE ON jobboard_db.* TO 'jobboard_api'@'localhost';
FLUSH PRIVILEGES;

-- Insert test user (password: password123)
INSERT INTO users (email, password_hash, name) VALUES 
('test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test User');