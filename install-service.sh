#!/bin/bash
# Installation script for Edumate website systemd service

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Copy service file
echo "Installing systemd service..."
cp /var/www/edumate-website.service /etc/systemd/system/

# Reload systemd
systemctl daemon-reload

# Enable service
echo "Enabling service..."
systemctl enable edumate-website.service

# Start service
echo "Starting service..."
systemctl start edumate-website.service

# Check status
echo ""
echo "Service status:"
systemctl status edumate-website.service --no-pager

echo ""
echo "Installation complete!"
echo "The website should now be accessible at http://localhost:8000"
echo ""
echo "Useful commands:"
echo "  sudo systemctl start edumate-website    # Start the service"
echo "  sudo systemctl stop edumate-website     # Stop the service"
echo "  sudo systemctl restart edumate-website   # Restart the service"
echo "  sudo systemctl status edumate-website    # Check service status"
echo "  sudo journalctl -u edumate-website -f    # View logs"

