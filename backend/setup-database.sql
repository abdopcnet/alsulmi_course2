-- Edumate Database Setup Script
-- Run this script as MySQL root user to create the database and user

-- Create database
CREATE DATABASE IF NOT EXISTS edumate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (change password in production)
CREATE USER IF NOT EXISTS 'edumate_user'@'localhost' IDENTIFIED BY 'edumate123';

-- Grant privileges
GRANT ALL PRIVILEGES ON edumate_db.* TO 'edumate_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Show databases to verify
SHOW DATABASES;

-- Show users
SELECT User, Host FROM mysql.user WHERE User = 'edumate_user';

-- Use the database
USE edumate_db;

-- The tables will be created automatically by Sequelize when the server starts
-- But you can verify the database is ready
SELECT 'Database edumate_db is ready!' as Status;
