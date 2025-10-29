# Production Deployment Guide - SIPELAN

## 🚀 Panduan Deploy ke Production

### 📋 Prerequisites

**Server Requirements:**
- Node.js 18.x atau lebih tinggi
- PostgreSQL 14.x atau lebih tinggi
- Nginx (recommended) atau Apache
- SSL Certificate (Let's Encrypt recommended)
- Minimum 2GB RAM
- Minimum 20GB Storage

**Domain & DNS:**
- Domain: `sipelan.patikab.go.id`
- SSL Certificate installed
- DNS A Record pointing to server IP

---

## 🔧 Step 1: Server Setup

### 1.1 Update System

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y git curl build-essential
```

### 1.2 Install Node.js

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 1.3 Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE sipelan_production;
CREATE USER sipelan_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE sipelan_production TO sipelan_user;
\q
```

### 1.4 Install PM2 (Process Manager)

```bash
sudo npm install -g pm2

# Setup PM2 to start on boot
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
```

---

## 📦 Step 2: Application Setup

### 2.1 Clone Repository

```bash
# Create application directory
sudo mkdir -p /var/www/sipelan
sudo chown $USER:$USER /var/www/sipelan

# Clone repository
cd /var/www/sipelan
git clone https://github.com/disnaker-pati/sipelan.git .

# Or upload files via SFTP/SCP
```

### 2.2 Install Dependencies

```bash
cd /var/www/sipelan

# Install production dependencies
npm ci --only=production

# Or install all dependencies
npm install
```

### 2.3 Configure Environment

```bash
# Copy production environment file
cp .env.production .env

# Edit environment variables
nano .env
```

**Important Environment Variables:**

```env
# Database
DATABASE_URL="postgresql://sipelan_user:your_secure_password@localhost:5432/sipelan_production"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your_generated_secret_key_here"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_USER="noreply@sipelan.patikab.go.id"
SMTP_PASS="your_app_password"

# Application URL
NEXT_PUBLIC_APP_URL="https://sipelan.patikab.go.id"

# Node Environment
NODE_ENV="production"
```

### 2.4 Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

### 2.5 Create Admin User

```bash
# Create seed script or use Prisma Studio
npx prisma studio

# Or create via SQL
psql -U sipelan_user -d sipelan_production

# In psql:
INSERT INTO users (id, email, password, nama, nip, role, is_active)
VALUES (
  gen_random_uuid(),
  'admin@sipelan.patikab.go.id',
  '$2a$10$...',  -- Hash password with bcrypt
  'Administrator SIPELAN',
  '198501012010011001',
  'ADMINISTRATOR',
  true
);
```

### 2.6 Build Application

```bash
# Build Next.js application
npm run build

# Test build locally
npm start
```

---

## 🌐 Step 3: Nginx Configuration

### 3.1 Install Nginx

```bash
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3.2 Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/sipelan
```

**Nginx Configuration:**

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name sipelan.patikab.go.id www.sipelan.patikab.go.id;
    
    return 301 https://$server_name$request_uri;
}

# HTTPS Configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name sipelan.patikab.go.id www.sipelan.patikab.go.id;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/sipelan.patikab.go.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sipelan.patikab.go.id/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Logging
    access_log /var/log/nginx/sipelan_access.log;
    error_log /var/log/nginx/sipelan_error.log;

    # Client Max Body Size (for file uploads)
    client_max_body_size 10M;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }

    # Public files
    location /uploads {
        alias /var/www/sipelan/public/uploads;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

### 3.3 Enable Site

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/sipelan /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔒 Step 4: SSL Certificate (Let's Encrypt)

### 4.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 4.2 Obtain Certificate

```bash
# Get certificate
sudo certbot --nginx -d sipelan.patikab.go.id -d www.sipelan.patikab.go.id

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose to redirect HTTP to HTTPS
```

### 4.3 Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up cron job for renewal
```

---

## 🔄 Step 5: PM2 Process Management

### 5.1 Start Application with PM2

```bash
cd /var/www/sipelan

# Start application
pm2 start npm --name "sipelan" -- start

# Or use ecosystem file
pm2 start ecosystem.config.js
```

### 5.2 Create Ecosystem File

```bash
nano ecosystem.config.js
```

**ecosystem.config.js:**

```javascript
module.exports = {
  apps: [{
    name: 'sipelan',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/sipelan',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

### 5.3 PM2 Commands

```bash
# Start
pm2 start ecosystem.config.js

# Stop
pm2 stop sipelan

# Restart
pm2 restart sipelan

# Reload (zero-downtime)
pm2 reload sipelan

# View logs
pm2 logs sipelan

# Monitor
pm2 monit

# List processes
pm2 list

# Save process list
pm2 save

# Startup script
pm2 startup
```

---

## 📊 Step 6: Monitoring & Logging

### 6.1 Setup PM2 Monitoring

```bash
# Install PM2 Plus (optional)
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

### 6.2 Application Logging

Create log directory:

```bash
mkdir -p /var/www/sipelan/logs
```

### 6.3 Database Backup

```bash
# Create backup script
nano /var/www/sipelan/scripts/backup.sh
```

**backup.sh:**

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/sipelan"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="sipelan_production"
DB_USER="sipelan_user"

mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make executable
chmod +x /var/www/sipelan/scripts/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e

# Add line:
0 2 * * * /var/www/sipelan/scripts/backup.sh >> /var/www/sipelan/logs/backup.log 2>&1
```

---

## 🔄 Step 7: Deployment Workflow

### 7.1 Update Application

```bash
cd /var/www/sipelan

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --only=production

# Run migrations
npx prisma migrate deploy

# Build application
npm run build

# Reload PM2 (zero-downtime)
pm2 reload sipelan
```

### 7.2 Automated Deployment Script

```bash
nano /var/www/sipelan/scripts/deploy.sh
```

**deploy.sh:**

```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

cd /var/www/sipelan

# Backup database
echo "📦 Creating database backup..."
./scripts/backup.sh

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Generate Prisma Client
echo "⚙️ Generating Prisma Client..."
npx prisma generate

# Build application
echo "🔨 Building application..."
npm run build

# Reload PM2
echo "🔄 Reloading application..."
pm2 reload sipelan

echo "✅ Deployment completed successfully!"
```

```bash
chmod +x /var/www/sipelan/scripts/deploy.sh
```

---

## 🔒 Step 8: Security Hardening

### 8.1 Firewall Configuration

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP & HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow PostgreSQL (only from localhost)
sudo ufw allow from 127.0.0.1 to any port 5432

# Check status
sudo ufw status
```

### 8.2 Fail2Ban (Optional)

```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Configure
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Start service
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### 8.3 Secure PostgreSQL

```bash
# Edit PostgreSQL config
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Ensure only local connections:
local   all             all                                     peer
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## ✅ Step 9: Post-Deployment Checklist

### 9.1 Verification

- [ ] Application accessible at https://sipelan.patikab.go.id
- [ ] SSL certificate valid and working
- [ ] Database migrations applied
- [ ] Admin user can login
- [ ] Email notifications working
- [ ] File uploads working
- [ ] All API endpoints responding
- [ ] Charts and dashboard loading
- [ ] Mobile responsive working

### 9.2 Performance Testing

```bash
# Test response time
curl -w "@curl-format.txt" -o /dev/null -s https://sipelan.patikab.go.id

# Load testing (optional)
npm install -g artillery
artillery quick --count 10 -n 20 https://sipelan.patikab.go.id
```

### 9.3 Monitoring Setup

- [ ] Setup uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error tracking (Sentry)
- [ ] Setup analytics (Google Analytics)
- [ ] Configure log monitoring
- [ ] Setup backup verification

---

## 🆘 Troubleshooting

### Application Not Starting

```bash
# Check PM2 logs
pm2 logs sipelan

# Check Nginx logs
sudo tail -f /var/log/nginx/sipelan_error.log

# Check application logs
tail -f /var/www/sipelan/logs/err.log
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -U sipelan_user -d sipelan_production -h localhost

# Check PostgreSQL status
sudo systemctl status postgresql

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### SSL Certificate Issues

```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test Nginx config
sudo nginx -t
```

---

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/docs/)

---

**Deployment Guide Version**: 1.0  
**Last Updated**: 27 Oktober 2025  
**Contact**: male.deeant@gmail.com
