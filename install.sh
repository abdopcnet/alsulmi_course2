#!/bin/bash

# Edumate Complete Installation Script
# This script installs all required dependencies and sets up the system

set -e

echo "========================================"
echo "Edumate Installation Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo -e "${YELLOW}Warning: Running as root${NC}"
fi

# Update system
echo -e "${GREEN}Step 1: Updating system packages...${NC}"
sudo apt-get update

# Install Node.js and npm
echo -e "${GREEN}Step 2: Installing Node.js and npm...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "Node.js $(node --version) installed"
    echo "npm $(npm --version) installed"
else
    echo "Node.js is already installed: $(node --version)"
    echo "npm is already installed: $(npm --version)"
fi

# Install MySQL Server
echo -e "${GREEN}Step 3: Installing MySQL Server...${NC}"
if ! command -v mysql &> /dev/null; then
    sudo apt-get install -y mysql-server
    sudo systemctl start mysql
    sudo systemctl enable mysql
    echo "MySQL installed and started"
else
    echo "MySQL is already installed"
    sudo systemctl start mysql || echo "MySQL is already running"
fi

# Install backend dependencies
echo -e "${GREEN}Step 4: Installing backend dependencies...${NC}"
cd /var/www/backend
npm install
echo "Backend dependencies installed"

# Setup database
echo -e "${GREEN}Step 5: Setting up database...${NC}"
echo "Creating database and user..."

# Create database setup SQL
sudo mysql -e "CREATE DATABASE IF NOT EXISTS edumate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || echo "Database might already exist"
sudo mysql -e "CREATE USER IF NOT EXISTS 'edumate_user'@'localhost' IDENTIFIED BY 'edumate123';" 2>/dev/null || echo "User might already exist"
sudo mysql -e "GRANT ALL PRIVILEGES ON edumate_db.* TO 'edumate_user'@'localhost';" 2>/dev/null
sudo mysql -e "FLUSH PRIVILEGES;" 2>/dev/null

echo "Database setup complete"

# Test database connection
echo -e "${GREEN}Step 6: Testing database connection...${NC}"
cd /var/www/backend
node -e "
const { sequelize, testConnection } = require('./src/config/database');
testConnection().then(async (success) => {
  if (success) {
    console.log('Testing database sync...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables created/updated successfully!');
    process.exit(0);
  } else {
    console.error('❌ Database connection failed');
    process.exit(1);
  }
}).catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
"

echo ""
echo -e "${GREEN}========================================"
echo "Installation Complete! 🎉"
echo "========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Start the backend server:"
echo "   cd /var/www/backend"
echo "   npm start"
echo ""
echo "2. Access the application:"
echo "   Login:    http://localhost:8000/login.html"
echo "   Register: http://localhost:8000/register.html"
echo ""
echo "3. API Endpoint: http://localhost:3000/api/v1"
echo ""
echo -e "${YELLOW}Default Database Credentials:${NC}"
echo "   Database: edumate_db"
echo "   User: edumate_user"
echo "   Password: edumate123"
echo ""
echo -e "${RED}⚠️  Remember to change passwords in production!${NC}"
echo ""
