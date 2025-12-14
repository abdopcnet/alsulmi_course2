# Site Commands Guide

## Overview

Bench commands for site management, deployment, maintenance, and troubleshooting in Frappe Framework.

## 📋 Table of Contents

1. [Site Basics](#site-basics)
2. [Site Creation & Removal](#site-creation--removal)
3. [App Management](#app-management)
4. [Database Operations](#database-operations)
5. [Development Commands](#development-commands)
6. [Maintenance Commands](#maintenance-commands)
7. [Troubleshooting](#troubleshooting)
8. [Production Deployment](#production-deployment)

---

## Site Basics

### List Sites

```bash
# List all sites
bench --site all list

# Or check sites directory
ls sites/
```

### Site Structure

```
sites/
├── [site_name]/
│   ├── site_config.json       # Site configuration
│   ├── locks/                 # Process locks
│   ├── logs/                  # Error/access logs
│   ├── private/               # Private files
│   │   ├── backups/          # Database backups
│   │   └── files/            # Uploaded files
│   └── public/                # Public files
└── common_site_config.json    # Shared config
```

---

## Site Creation & Removal

### Create New Site

```bash
# Create site with MariaDB
bench new-site [site_name]

# With specific database
bench new-site [site_name] --db-name [database_name]

# With specific database user
bench new-site [site_name] --db-user [user] --db-password [password]

# With admin password
bench new-site [site_name] --admin-password [password]

# Install specific apps
bench new-site [site_name] --install-app erpnext
```

### Remove Site

```bash
# Drop site (with confirmation)
bench drop-site [site_name]

# Force drop
bench drop-site [site_name] --force

# Drop without backup
bench drop-site [site_name] --no-backup
```

### Restore Site

```bash
# Restore from backup
bench --site [site_name] restore /path/to/backup.sql.gz

# Restore with files
bench --site [site_name] restore \
  --db-path /path/to/backup.sql.gz \
  --files-path /path/to/files.tar
```

---

## App Management

### Install Apps

```bash
# Install app
bench --site [site_name] install-app [app_name]

# Install multiple apps
bench --site [site_name] install-app erpnext hrms

# Force reinstall
bench --site [site_name] install-app [app_name] --force
```

### Uninstall Apps

```bash
# Uninstall app
bench --site [site_name] uninstall-app [app_name]

# Force uninstall
bench --site [site_name] uninstall-app [app_name] --force
```

### List Installed Apps

```bash
# List apps on site
bench --site [site_name] list-apps
```

### Get App from Git

```bash
# Get app from GitHub
bench get-app [app_name]

# From specific branch
bench get-app [app_name] --branch [branch_name]

# From URL
bench get-app https://github.com/[user]/[repo].git
```

---

## Database Operations

### Backup

```bash
# Database backup
bench --site [site_name] backup

# Backup with files
bench --site [site_name] backup --with-files

# Backup all sites
bench --site all backup

# Compress backup
bench --site [site_name] backup --compress

# Backup location:
# sites/[site_name]/private/backups/
```

### Migrate

```bash
# Run migrations
bench --site [site_name] migrate

# Migrate specific app
bench --site [site_name] migrate --app [app_name]

# Skip search index
bench --site [site_name] migrate --skip-search-index

# Check migration status
bench --site [site_name] migrate --status
```

### Console

```bash
# Python console
bench --site [site_name] console

# Example usage:
>>> import frappe
>>> frappe.get_doc('User', 'Administrator')
>>> frappe.db.get_list('Customer', limit=10)
>>> exit()
```

### MariaDB Access

```bash
# Access database
bench --site [site_name] mariadb

# Execute query
bench --site [site_name] mariadb -e "SELECT * FROM `tabUser` LIMIT 10;"

# Import SQL file
bench --site [site_name] mariadb < backup.sql
```

---

## Development Commands

### Build Assets

```bash
# Build all apps
bench build

# Build specific app
bench build --app [app_name]

# Build for production
bench build --production

# Force build
bench build --force
```

### Clear Cache

```bash
# Clear site cache
bench --site [site_name] clear-cache

# Clear website cache
bench --site [site_name] clear-website-cache

# Clear all caches
bench --site all clear-cache
```

### Restart Services

```bash
# Restart bench
bench restart

# Restart web only
supervisorctl restart frappe-bench-web:*

# Restart workers
supervisorctl restart frappe-bench-workers:*

# Check status
supervisorctl status
```

### Watch & Reload

```bash
# Watch and rebuild on changes (development)
bench watch

# Reload doctype
bench --site [site_name] reload-doctype "[DocType Name]"
```

### Run Tests

```bash
# Run all tests
bench --site [site_name] run-tests

# Run specific app tests
bench --site [site_name] run-tests --app [app_name]

# Run specific module
bench --site [site_name] run-tests --module [module_name]

# Run specific test
bench --site [site_name] run-tests --doctype "[DocType Name]"
```

---

## Maintenance Commands

### Set Config

```bash
# Set configuration value
bench --site [site_name] set-config [key] [value]

# Examples:
bench --site [site_name] set-config developer_mode 1
bench --site [site_name] set-config maintenance_mode 1
bench --site [site_name] set-config db_name custom_db_name

# Remove config
bench --site [site_name] remove-config [key]
```

### Scheduler

```bash
# Enable scheduler
bench --site [site_name] enable-scheduler

# Disable scheduler
bench --site [site_name] disable-scheduler

# List scheduled jobs
bench --site [site_name] schedule

# Run specific job
bench --site [site_name] run-job [job_name]
```

### Users

```bash
# Add user
bench --site [site_name] add-user [email]

# Set user password
bench --site [site_name] set-password [email]

# Remove user
bench --site [site_name] remove-user [email]

# List users
bench --site [site_name] console
>>> frappe.get_all('User', fields=['name', 'full_name'])
```

### Error Logs

```bash
# View error log
tail -f sites/[site_name]/logs/error.log

# View access log
tail -f sites/[site_name]/logs/access.log

# View bench logs
tail -f logs/bench.log
```

---

## Troubleshooting

### Common Issues

**Permission Issues:**
```bash
# Fix permissions
sudo chown -R frappe:frappe /home/frappe/frappe-bench

# Set execute permissions
chmod +x apps/[app]/[script]
```

**Port Conflicts:**
```bash
# Check port usage
sudo lsof -i :8000
sudo lsof -i :9000

# Kill process
kill -9 [PID]
```

**Database Connection:**
```bash
# Test database connection
bench --site [site_name] mariadb -e "SELECT 1;"

# Check site_config.json
cat sites/[site_name]/site_config.json
```

**Cache Issues:**
```bash
# Clear all caches
bench --site [site_name] clear-cache
bench restart

# Remove cache files
rm -rf sites/[site_name]/.cache
```

### Rebuild Search Index

```bash
# Rebuild for site
bench --site [site_name] build-search-index

# Rebuild for all sites
bench --site all build-search-index
```

### Fix Database

```bash
# Check database integrity
bench --site [site_name] mariadb -e "CHECK TABLE \`tabDocType\`;"

# Repair table
bench --site [site_name] mariadb -e "REPAIR TABLE \`tabDocType\`;"
```

---

## Production Deployment

### Setup Production

```bash
# Setup production environment
sudo bench setup production [user]

# Setup Nginx
sudo bench setup nginx

# Setup Supervisor
sudo bench setup supervisor

# Enable site for production
sudo bench setup production [site_name]
```

### SSL Certificate

```bash
# Setup Let's Encrypt SSL
sudo bench setup lets-encrypt [site_name]

# Renew certificate
sudo certbot renew
```

### Update Bench

```bash
# Update bench
bench update

# Update specific app
bench update --app [app_name]

# Update without building assets
bench update --no-build

# Pull latest changes
bench update --pull

# Update only bench framework
bench update --bench
```

### Migrate Production

```bash
# Backup before migration
bench --site [site_name] backup --with-files

# Put site in maintenance mode
bench --site [site_name] set-config maintenance_mode 1

# Run migration
bench --site [site_name] migrate

# Build assets
bench build --app [app_name]

# Restart services
bench restart

# Disable maintenance mode
bench --site [site_name] set-config maintenance_mode 0
```

---

## Useful Scripts

### Batch Operations

```bash
# Run command on all sites
bench --site all [command]

# Examples:
bench --site all backup
bench --site all migrate
bench --site all clear-cache
```

### Site Info

```bash
# Get site info
bench --site [site_name] console

>>> frappe.local.site
>>> frappe.conf
>>> frappe.get_installed_apps()
```

### Performance Monitoring

```bash
# Check slow queries
bench --site [site_name] mariadb -e "
SELECT * FROM mysql.slow_log 
ORDER BY query_time DESC 
LIMIT 10;
"

# Monitor process
top -u frappe
htop
```

---

## Quick Reference

### Essential Commands

```bash
# Site management
bench new-site [site]
bench drop-site [site]
bench --site [site] list-apps

# App management
bench get-app [app]
bench --site [site] install-app [app]

# Database
bench --site [site] backup
bench --site [site] migrate
bench --site [site] mariadb

# Development
bench build
bench restart
bench --site [site] clear-cache
bench watch

# Production
bench update
sudo bench setup production [user]
bench --site [site] set-config maintenance_mode 1
```

---

*Always backup before major operations. Test commands in development before production.*
