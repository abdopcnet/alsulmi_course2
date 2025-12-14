# Setup How-To Guide

This guide explains how to set up and run the Edumate Education HTML Template website.

## Prerequisites

- Linux server (Ubuntu/Debian/CentOS)
- Web server (Apache or Nginx)
- PHP 7.0+ (optional, only for contact form)
- Root or sudo access

## Option 1: Apache Setup

### Step 1: Install Apache

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install apache2

# CentOS/RHEL
sudo yum install httpd
```

### Step 2: Install PHP (Optional - for contact form)

```bash
# Ubuntu/Debian
sudo apt install php libapache2-mod-php php-cli

# CentOS/RHEL
sudo yum install php php-cli
```

### Step 3: Configure Apache

1. **Set Document Root** (if needed):
   ```bash
   # Edit Apache configuration
   sudo nano /etc/apache2/sites-available/000-default.conf
   # or
   sudo nano /etc/httpd/conf/httpd.conf
   ```

2. **Update DocumentRoot** to point to `/var/www/edumate`:
   ```apache
   DocumentRoot /var/www/edumate
   <Directory /var/www/edumate>
       Options Indexes FollowSymLinks
       AllowOverride All
       Require all granted
   </Directory>
   ```

3. **Enable mod_rewrite** (if needed):
   ```bash
   # Ubuntu/Debian
   sudo a2enmod rewrite
   
   # CentOS/RHEL (usually enabled by default)
   ```

4. **Restart Apache**:
   ```bash
   # Ubuntu/Debian
   sudo systemctl restart apache2
   
   # CentOS/RHEL
   sudo systemctl restart httpd
   ```

### Step 4: Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/edumate
sudo chmod -R 755 /var/www/edumate
```

## Option 2: Nginx Setup

### Step 1: Install Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

### Step 2: Install PHP-FPM (Optional - for contact form)

```bash
# Ubuntu/Debian
sudo apt install php-fpm

# CentOS/RHEL
sudo yum install php-fpm
```

### Step 3: Configure Nginx

1. **Create Nginx configuration**:
   ```bash
   sudo nano /etc/nginx/sites-available/edumate
   ```

2. **Add configuration**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;
       root /var/www/edumate;
       index index.html index.php;

       # Static files
       location / {
           try_files $uri $uri/ =404;
       }

       # PHP support (optional)
       location ~ \.php$ {
           include snippets/fastcgi-php.conf;
           fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
           # Adjust PHP version as needed
       }

       # Deny access to hidden files
       location ~ /\. {
           deny all;
       }
   }
   ```

3. **Enable the site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/edumate /etc/nginx/sites-enabled/
   sudo nginx -t  # Test configuration
   sudo systemctl restart nginx
   ```

### Step 4: Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/edumate
sudo chmod -R 755 /var/www/edumate
```

## Option 3: Simple Python HTTP Server (Development Only)

For quick testing/development:

```bash
cd /var/www/edumate
python3 -m http.server 8000
```

Access at: `http://localhost:8000`

**Note**: This method does NOT support PHP contact form.

## Configure Contact Form (Optional)

If you want the contact form to work:

1. **Edit contact.php**:
   ```bash
   nano /var/www/edumate/assets/contact.php
   ```

2. **Update recipient email** (line 23):
   ```php
   $recipient = "your-email@example.com";
   ```

3. **Ensure PHP mail is configured**:
   - For production, consider using SMTP (requires additional PHP mail library)
   - Test the form after configuration

## Using Systemd Service (Recommended)

A systemd service file is provided for easy management. See the service file documentation for details.

### Start the service:
```bash
sudo systemctl start edumate-website
```

### Enable on boot:
```bash
sudo systemctl enable edumate-website
```

### Check status:
```bash
sudo systemctl status edumate-website
```

## SSL/HTTPS Setup (Production)

### Using Let's Encrypt (Free SSL)

1. **Install Certbot**:
   ```bash
   # Ubuntu/Debian
   sudo apt install certbot python3-certbot-apache
   # or for Nginx
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain certificate**:
   ```bash
   # For Apache
   sudo certbot --apache -d your-domain.com
   
   # For Nginx
   sudo certbot --nginx -d your-domain.com
   ```

3. **Auto-renewal** (usually set up automatically):
   ```bash
   sudo certbot renew --dry-run
   ```

## Firewall Configuration

### Ubuntu/Debian (UFW)

```bash
sudo ufw allow 'Apache Full'
# or
sudo ufw allow 'Nginx Full'
```

### CentOS/RHEL (firewalld)

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Testing the Setup

1. **Access the website**:
   - Local: `http://localhost` or `http://your-server-ip`
   - Domain: `http://your-domain.com`

2. **Test pages**:
   - Homepage: `/index.html`
   - Courses: `/our-courses.html`
   - Contact: `/contact.html`

3. **Test contact form** (if PHP enabled):
   - Fill out the form on `/contact.html`
   - Check if email is received

## Troubleshooting

### Apache/Nginx won't start
- Check configuration syntax: `sudo apache2ctl configtest` or `sudo nginx -t`
- Check error logs: `/var/log/apache2/error.log` or `/var/log/nginx/error.log`

### Permission denied errors
- Ensure proper ownership: `sudo chown -R www-data:www-data /var/www/edumate`
- Check file permissions: `sudo chmod -R 755 /var/www/edumate`

### Contact form not working
- Verify PHP is installed and enabled
- Check PHP error logs: `/var/log/php-errors.log`
- Ensure `mail()` function is enabled in PHP
- Check file permissions on `contact.php`

### 404 errors
- Verify DocumentRoot points to `/var/www/edumate`
- Check that files exist in the directory
- Ensure mod_rewrite is enabled (Apache)

## Maintenance

### Update files
```bash
# Backup first
sudo cp -r /var/www/edumate /var/www/edumate-backup

# Update files
cd /var/www/edumate
# ... make your changes ...
```

### Log monitoring
```bash
# Apache
sudo tail -f /var/log/apache2/access.log
sudo tail -f /var/log/apache2/error.log

# Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Performance Optimization

1. **Enable Gzip compression** (Nginx example):
   ```nginx
   gzip on;
   gzip_types text/css application/javascript image/svg+xml;
   ```

2. **Enable browser caching**:
   ```nginx
   location ~* \.(jpg|jpeg|png|gif|ico|css|js|webp)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **Use CDN** for static assets (optional)

## Next Steps

- Customize content in HTML files
- Update images in `assets/images/`
- Modify styles in `assets/css/style.css` or `assets/scss/`
- Configure contact form email
- Set up SSL certificate
- Configure domain DNS

