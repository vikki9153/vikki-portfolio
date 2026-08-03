-- Portfolio Database Setup
-- Run this file in MySQL to create database and table

-- Create Database
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Create Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data (optional)
INSERT INTO contacts (name, email, phone, subject, message) VALUES
('Raj Kumar', 'raj@email.com', '9876543210', 'Test', 'Hello Vikki!');

-- View all contacts
SELECT * FROM contacts;
