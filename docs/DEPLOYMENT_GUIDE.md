# ODPP Tech Support Portal - Deployment Guide

**Version:** 1.0
**Date:** April 14, 2026

---

## Prerequisites

### Server Requirements

- **OS:** Ubuntu 22.04 LTS (recommended) or similar Linux distribution
- **Web Server:** Nginx or Apache
- **PHP:** 8.2 or higher
- **Node.js:** 18.x or higher
- **MySQL:** 8.0 or higher
- **Composer:** 2.x

### Development Requirements

- Docker (optional, for containerized development)
- Git

---

## Environment Setup

### 1. Server Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx php8.2-fpm php8.2-cli php8.2-mysql php8.2-xml php8.2-mbstring \
  php8.2-curl php8.2-zip php8.2-gd php8.2-bcmath php8.2-intl php8.2-redis

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### 2. Database Setup

```bash
# Install MySQL
sudo apt install -y mysql-server

# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql
```

```sql
CREATE DATABASE odpp_tech_support CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'odpp_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON odpp_tech_support.* TO 'odpp_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Backend Deployment

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/your-org/odpp-tech-support-portal.git
cd odpp-tech-support-portal/backend

# Install dependencies
composer install --no-dev --optimize-autoloader

# Copy environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

### 2. Configure .env

```env
APP_NAME="ODPP Tech Support"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY
APP_DEBUG=false
APP_URL=https://support.odpp.go.ke

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=odpp_tech_support
DB_USERNAME=odpp_user
DB_PASSWORD=your_secure_password

CACHE_DRIVER=file
QUEUE_CONNECTION=database
SESSION_DRIVER=file
MAIL_MAILER=smtp
MAIL_HOST=mail.odpp.go.ke
MAIL_PORT=587
MAIL_USERNAME=noreply@odpp.go.ke
MAIL_PASSWORD=your_mail_password
MAIL_FROM_ADDRESS=noreply@odpp.go.ke
MAIL_FROM_NAME="ODPP Tech Support"
```

### 3. Generate Key and Run Migrations

```bash
# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate --force

# Seed demo data (optional but recommended for testing)
php artisan db:seed --force

# Create storage link
php artisan storage:link

# Clear and cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 4. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/odpp-tech-support
```

```nginx
server {
    listen 80;
    server_name support.odpp.go.ke;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name support.odpp.go.ke;

    root /var/www/odpp-tech-support-portal/backend/public;
    index index.php;

    ssl_certificate /etc/ssl/certs/odpp.crt;
    ssl_certificate_key /etc/ssl/private/odpp.key;

    client_max_body_size 10M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Serve static assets with long cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/odpp-tech-support /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Frontend Deployment

### 1. Build for Production

```bash
cd /var/www/odpp-tech-support-portal/frontend

# Create production environment file
echo "VITE_API_URL=https://support.odpp.go.ke/api" > .env.production

# Build
npm install
npm run build
```

### 2. Serve Frontend

Option A: Serve with Nginx (recommended for same domain)

```bash
sudo nano /etc/nginx/sites-available/odpp-tech-frontend
```

```nginx
server {
    listen 80;
    server_name support.odpp.go.ke;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name support.odpp.go.ke;

    root /var/www/odpp-tech-support-portal/frontend/dist;
    index index.html;

    ssl_certificate /etc/ssl/certs/odpp.crt;
    ssl_certificate_key /etc/ssl/private/odpp.key;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/odpp-tech-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Option B: Serve static files from backend public folder

```bash
# Copy frontend build to backend public folder
cp -r /var/www/odpp-tech-support-portal/frontend/dist/* /var/www/odpp-tech-support-portal/backend/public/
```

Then add to backend Nginx config:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## SSL Certificate Setup

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d support.odpp.go.ke

# Auto-renewal is configured automatically
```

---

## Queue Worker Setup

For background job processing (email notifications):

```bash
# Create systemd service
sudo nano /etc/systemd/system/odpp-queue-worker.service
```

```ini
[Unit]
Description=ODPP Tech Support Queue Worker
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/odpp-tech-support-portal/backend
Restart=always
RestartSec=10s
ExecStart=/usr/bin/php8.2 artisan queue:work database --sleep=3 --tries=3 --max-time=3600

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable odpp-queue-worker
sudo systemctl start odpp-queue-worker
sudo systemctl status odpp-queue-worker
```

---

## Scheduled Tasks

Add to crontab:

```bash
crontab -e
```

```
* * * * * cd /var/www/odpp-tech-support-portal/backend && php artisan schedule:run >> /dev/null 2>&1
```

---

## Security Checklist

### Backend
- [x] Set `APP_DEBUG=false` in production
- [x] Use strong `APP_KEY`
- [x] Configure HTTPS only
- [x] Set proper file permissions: `chmod -R 755 storage bootstrap/cache`
- [x] Use environment variables for secrets
- [x] Disable unused PHP functions
- [x] Configure firewall (ufw)

### Frontend
- [x] Build with `npm run build`
- [x] Set correct API URL
- [x] Enable HSTS headers in Nginx
- [x] Configure CSP headers

### Database
- [x] Use strong passwords
- [x] Limit user privileges
- [x] Enable SSL for MySQL connections
- [x] Regular backups

---

## Backup Strategy

### Database Backup

```bash
# Create backup script
sudo nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/var/backups/odpp
mkdir -p $BACKUP_DIR

mysqldump -u odpp_user -p odpp_tech_support | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Keep last 30 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete
```

```bash
sudo chmod +x /usr/local/bin/backup-db.sh

# Add to crontab
echo "0 2 * * * /usr/local/bin/backup-db.sh" | crontab -
```

### Files Backup

```bash
sudo nano /usr/local/bin/backup-files.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/var/backups/odpp
mkdir -p $BACKUP_DIR

tar -czf $BACKUP_DIR/files_$DATE.tar.gz \
    /var/www/odpp-tech-support-portal/backend/storage/app \
    /var/www/odpp-tech-support-portal/backend/storage/attachments

find $BACKUP_DIR -name "files_*.tar.gz" -mtime +30 -delete
```

---

## Troubleshooting

### Common Issues

**1. 500 Internal Server Error**
```bash
# Check Laravel logs
tail -f storage/logs/laravel.log

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

**2. Database Connection Failed**
- Verify credentials in `.env`
- Check MySQL is running: `sudo systemctl status mysql`
- Test connection: `mysql -u odpp_user -p odpp_tech_support`

**3. API Returns 401**
- Check Sanctum token is being sent
- Verify token not expired
- Check `APP_URL` matches frontend request origin

**4. Queue Worker Not Processing**
- Check worker is running: `sudo systemctl status odpp-queue-worker`
- Check jobs table exists: `php artisan queue:failed-table` then migrate
- View failed jobs: `php artisan queue:failed`

### Useful Commands

```bash
# Clear all caches
php artisan optimize:clear

# Check routes
php artisan route:list

# Test database connection
php artisan db

# Check PHP-FPM status
sudo systemctl status php8.2-fpm

# View running processes
ps aux | grep php
```

---

## Monitoring

### Health Check Endpoint

Access `https://support.odpp.go.ke/api/health` (add this endpoint to your routes if needed):

```php
// In routes/api.php
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'time' => now()->toISOString(),
    ]);
});
```

### Log Rotation

```bash
sudo nano /etc/logrotate.d/laravel
```

```
/var/www/odpp-tech-support-portal/backend/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 640 www-data www-data
}
```

---

## Support

For technical support, contact:
- **Email:** ict-support@odpp.go.ke
- **Phone:** +254 700 100 100
- **Hours:** Monday-Friday, 8:00 AM - 5:00 PM EAT