# Production Deployment Checklist - SIPELAN

## 📋 Pre-Deployment Checklist

### Environment Setup
- [ ] Server provisioned (minimum 2GB RAM, 20GB storage)
- [ ] Node.js 18.x installed
- [ ] PostgreSQL 14.x installed
- [ ] Nginx installed
- [ ] PM2 installed globally
- [ ] Domain DNS configured (sipelan.patikab.go.id)
- [ ] SSL certificate obtained (Let's Encrypt)

### Application Configuration
- [ ] `.env.production` configured with production values
- [ ] `DATABASE_URL` set to production database
- [ ] `JWT_SECRET` generated (use: `openssl rand -base64 32`)
- [ ] SMTP credentials configured
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] File upload directory created (`/var/www/sipelan/public/uploads`)
- [ ] Log directory created (`/var/www/sipelan/logs`)

### Database Setup
- [ ] Production database created
- [ ] Database user created with proper permissions
- [ ] Prisma migrations applied
- [ ] Prisma Client generated
- [ ] Admin user created
- [ ] Database backup script configured
- [ ] Backup cron job scheduled

### Security
- [ ] Firewall configured (UFW)
- [ ] Only necessary ports open (22, 80, 443)
- [ ] PostgreSQL only accessible from localhost
- [ ] Strong passwords used for all accounts
- [ ] SSH key authentication enabled
- [ ] Root login disabled
- [ ] Fail2Ban installed (optional)
- [ ] Security headers configured in Nginx

### Application Build
- [ ] Dependencies installed (`npm ci --only=production`)
- [ ] Application built successfully (`npm run build`)
- [ ] Build tested locally (`npm start`)
- [ ] No TypeScript errors
- [ ] No ESLint errors

### Nginx Configuration
- [ ] Nginx config file created
- [ ] Site enabled in Nginx
- [ ] Nginx configuration tested (`nginx -t`)
- [ ] HTTP to HTTPS redirect working
- [ ] SSL certificate valid
- [ ] Security headers present
- [ ] Gzip compression enabled
- [ ] Static file caching configured

### PM2 Configuration
- [ ] PM2 ecosystem file created
- [ ] Application started with PM2
- [ ] PM2 startup script configured
- [ ] PM2 process saved
- [ ] Log rotation configured
- [ ] Process monitoring working

---

## 🚀 Deployment Steps

### 1. Initial Deployment
```bash
# Clone repository
cd /var/www/sipelan
git clone <repository-url> .

# Install dependencies
npm ci --only=production

# Configure environment
cp .env.production .env
nano .env

# Setup database
npx prisma generate
npx prisma migrate deploy

# Build application
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save

# Configure Nginx
sudo cp nginx.conf /etc/nginx/sites-available/sipelan
sudo ln -s /etc/nginx/sites-available/sipelan /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. Post-Deployment
- [ ] Application accessible at https://sipelan.patikab.go.id
- [ ] SSL certificate working (green padlock)
- [ ] Admin login working
- [ ] Create test pengaduan
- [ ] Email notifications working
- [ ] File upload working
- [ ] Dashboard charts loading
- [ ] Mobile responsive working
- [ ] All API endpoints responding

---

## ✅ Testing Checklist

### Functionality Testing
- [ ] **Homepage**
  - [ ] Hero section loads
  - [ ] Statistics display correctly
  - [ ] Navigation working
  - [ ] Animations smooth

- [ ] **Authentication**
  - [ ] Login page accessible
  - [ ] Login with valid credentials works
  - [ ] Login with invalid credentials fails
  - [ ] Registration page accessible
  - [ ] Registration creates new user
  - [ ] Logout works correctly

- [ ] **Pengaduan (Complaint)**
  - [ ] Create pengaduan form loads
  - [ ] Form validation working
  - [ ] File upload working (max 5MB)
  - [ ] Ticket number generated
  - [ ] Email notification sent
  - [ ] Tracking page shows status

- [ ] **Admin Dashboard**
  - [ ] Dashboard loads for admin
  - [ ] Statistics cards display correctly
  - [ ] Charts render properly
  - [ ] Recent complaints table shows data
  - [ ] Sidebar navigation working
  - [ ] Search functionality working

- [ ] **User Management** (Admin)
  - [ ] List all users
  - [ ] Create new user
  - [ ] Update user
  - [ ] Delete user
  - [ ] Role-based access working

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] Time to First Byte (TTFB) < 500ms
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Images optimized
- [ ] Static assets cached
- [ ] Gzip compression working

### Security Testing
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] SSL certificate valid
- [ ] Security headers present
- [ ] XSS protection enabled
- [ ] CSRF protection working
- [ ] SQL injection prevented (Prisma)
- [ ] File upload validation working
- [ ] Rate limiting configured
- [ ] Sensitive files not accessible (.env, .git)

### Mobile Testing
- [ ] Responsive on iPhone (375px)
- [ ] Responsive on Android (360px)
- [ ] Responsive on tablet (768px)
- [ ] Touch targets adequate (min 44px)
- [ ] Forms usable on mobile
- [ ] Navigation menu working

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## 📊 Monitoring Setup

### Application Monitoring
- [ ] PM2 monitoring active (`pm2 monit`)
- [ ] PM2 logs accessible (`pm2 logs`)
- [ ] Error tracking configured (Sentry - optional)
- [ ] Uptime monitoring (UptimeRobot - optional)
- [ ] Analytics configured (Google Analytics - optional)

### Server Monitoring
- [ ] CPU usage monitoring
- [ ] Memory usage monitoring
- [ ] Disk space monitoring
- [ ] Network traffic monitoring
- [ ] PostgreSQL performance monitoring

### Logging
- [ ] Application logs rotating
- [ ] Nginx access logs
- [ ] Nginx error logs
- [ ] PostgreSQL logs
- [ ] PM2 logs

---

## 🔄 Maintenance Procedures

### Daily
- [ ] Check application uptime
- [ ] Review error logs
- [ ] Monitor disk space

### Weekly
- [ ] Review application performance
- [ ] Check backup integrity
- [ ] Update dependencies (security patches)
- [ ] Review user feedback

### Monthly
- [ ] Full system backup
- [ ] Security audit
- [ ] Performance optimization
- [ ] Database optimization
- [ ] SSL certificate renewal check

---

## 🆘 Emergency Procedures

### Application Down
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs sipelan --lines 100

# Restart application
pm2 restart sipelan

# If still down, rebuild
cd /var/www/sipelan
npm run build
pm2 reload sipelan
```

### Database Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
```

### High Memory Usage
```bash
# Check memory
free -h

# Check PM2 processes
pm2 list

# Reload application (frees memory)
pm2 reload sipelan
```

### Disk Space Full
```bash
# Check disk space
df -h

# Clear old logs
pm2 flush
sudo find /var/log -type f -name "*.log" -mtime +30 -delete

# Clear old backups
sudo find /var/backups/sipelan -name "*.sql.gz" -mtime +7 -delete
```

---

## 📞 Support Contacts

**Technical Support:**
- Email: male.deeant@gmail.com
- Emergency: [Phone Number]

**Hosting Provider:**
- Provider: [Hosting Company]
- Support: [Support Contact]

**Domain Registrar:**
- Registrar: [Domain Registrar]
- Support: [Support Contact]

---

## 📝 Deployment Log

### Version 1.0.0 - Initial Deployment
- **Date**: _______________
- **Deployed By**: _______________
- **Status**: ⬜ Success ⬜ Failed
- **Notes**: _______________________________________________

### Version 1.0.1 - Update
- **Date**: _______________
- **Deployed By**: _______________
- **Status**: ⬜ Success ⬜ Failed
- **Changes**: _______________________________________________

---

**Checklist Version**: 1.0  
**Last Updated**: 27 Oktober 2025  
**Next Review**: _______________
