# 🚀 Deployment Guide - SIPelan

## Platform: Vercel (Recommended)

Vercel adalah platform terbaik untuk Next.js applications dengan deployment otomatis dari GitHub.

---

## 📋 Pre-Deployment Checklist

- [x] Code sudah di push ke GitHub: https://github.com/dianlent/sipelan
- [x] Migration SQL sudah dijalankan di Supabase
- [x] Supabase database sudah setup
- [ ] Environment variables siap
- [ ] SMTP configuration (optional)

---

## 🎯 Deployment Steps

### Step 1: Persiapan Environment Variables

Sebelum deploy, siapkan environment variables berikut:

#### Required Variables:
```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key

# Application
NEXT_PUBLIC_APP_NAME=SIPelan
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

#### Optional Variables (Email Notification):
```env
# SMTP Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="SIPelan" <noreply@sipelan.go.id>
```

#### Optional Variables (JWT):
```env
# JWT (Optional - if not using Supabase Auth)
JWT_SECRET=your_secret_key_minimum_32_characters
JWT_EXPIRES_IN=7d
```

---

### Step 2: Deploy ke Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. **Buka Vercel**
   - Go to: https://vercel.com
   - Login dengan GitHub account Anda

2. **Import Project**
   - Klik "Add New" → "Project"
   - Select GitHub repository: `dianlent/sipelan`
   - Klik "Import"

3. **Configure Project**
   ```
   Framework Preset: Next.js (auto-detected)
   Root Directory: ./
   Build Command: npm run build (auto-detected)
   Output Directory: .next (auto-detected)
   Install Command: npm install (auto-detected)
   ```

4. **Add Environment Variables**
   - Expand "Environment Variables" section
   - Add semua variables dari Step 1
   - Format: `KEY` = `value` (tanpa quotes)

5. **Deploy**
   - Klik "Deploy"
   - Tunggu 2-3 menit untuk build process
   - Selesai! ✅

6. **Get Deployment URL**
   ```
   Your app will be available at:
   https://sipelan.vercel.app (atau custom domain)
   ```

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: sipelan
# - Directory: ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_KEY
# ... add others

# Deploy to production
vercel --prod
```

---

### Step 3: Post-Deployment Configuration

#### 1. Update Supabase Settings

**Add Vercel URL to Supabase:**
1. Go to Supabase Dashboard
2. Settings → API → Configuration
3. Add site URL: `https://your-app.vercel.app`
4. Add redirect URLs:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/*`

#### 2. Test Deployment

**Critical Tests:**
```bash
# Test pages
✓ https://your-app.vercel.app
✓ https://your-app.vercel.app/pengaduan
✓ https://your-app.vercel.app/tracking
✓ https://your-app.vercel.app/admin
✓ https://your-app.vercel.app/bidang

# Test API
✓ https://your-app.vercel.app/api/pengaduan
✓ https://your-app.vercel.app/api/categories
```

**Check Console:**
- Open browser DevTools
- Check for errors
- Verify API calls working

#### 3. Custom Domain (Optional)

**Add Custom Domain:**
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add domain: `sipelan.disnaker.go.id`
3. Update DNS records as instructed:
   ```
   Type: CNAME
   Name: sipelan (or @)
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (5-30 minutes)
5. SSL certificate auto-generated ✅

---

## 🔧 Common Issues & Solutions

### Issue 1: Environment Variables Not Working

**Symptoms:**
- Database connection error
- "Cannot read NEXT_PUBLIC_SUPABASE_URL"

**Solution:**
1. Check environment variables spelling
2. Restart deployment: Vercel Dashboard → Deployments → Redeploy
3. Verify variables in Vercel Dashboard → Settings → Environment Variables

### Issue 2: Build Failed

**Symptoms:**
```
Error: Build failed with exit code 1
```

**Solution:**
1. Check build logs in Vercel Dashboard
2. Test build locally first:
   ```bash
   npm run build
   npm run start
   ```
3. Fix errors and push again

### Issue 3: API Routes Not Working

**Symptoms:**
- 404 on API calls
- CORS errors

**Solution:**
1. Check `next.config.js` configuration
2. Verify API routes file structure: `app/api/*/route.ts`
3. Check Vercel logs for errors

### Issue 4: Database Connection Failed

**Symptoms:**
- "Failed to fetch pengaduan"
- Database timeout

**Solution:**
1. Verify Supabase credentials in Vercel env vars
2. Check Supabase project status
3. Verify RLS policies allow access
4. Check Supabase logs

### Issue 5: Email Not Sending

**Symptoms:**
- Email notification not received

**Solution:**
1. SMTP optional - app still works without it
2. Check SMTP credentials in environment variables
3. Test with: `node scripts/test-email.js` locally
4. Use SendGrid or AWS SES for production

---

## 📊 Monitoring & Analytics

### Vercel Analytics

**Enable Analytics:**
1. Go to Vercel Dashboard → Project → Analytics
2. Enable "Vercel Analytics"
3. View real-time metrics

**Metrics Available:**
- Page views
- API calls
- Response times
- Error rates
- Traffic sources

### Error Logging

**Check Logs:**
1. Vercel Dashboard → Project → Logs
2. Filter by:
   - Function invocations
   - Build logs
   - Static requests

### Performance Monitoring

**Key Metrics:**
```
✓ Lighthouse Score: 90+
✓ First Contentful Paint: < 1.5s
✓ Time to Interactive: < 3.0s
✓ API Response Time: < 500ms
```

---

## 🔄 Continuous Deployment

### Auto-Deploy from GitHub

**Setup (Already Configured):**
- Every push to `main` branch auto-deploys
- Pull requests create preview deployments
- Rollback available from Vercel Dashboard

**Workflow:**
```bash
# Development
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Create Pull Request on GitHub
# Review preview deployment
# Merge to main
# Auto-deploy to production ✅
```

### Preview Deployments

Every pull request gets unique URL:
```
https://sipelan-git-feature-new-feature-dianlent.vercel.app
```

---

## 🛡️ Security Best Practices

### Environment Variables

- ✅ Never commit `.env` or `.env.local` to git
- ✅ Use Vercel Environment Variables
- ✅ Rotate secrets regularly
- ✅ Use different keys for staging/production

### Database Security

- ✅ RLS policies enabled in Supabase
- ✅ Service key only in backend API routes
- ✅ Anon key for client-side only
- ✅ Regular backups enabled

### API Security

- ✅ Rate limiting configured
- ✅ Input validation on all endpoints
- ✅ CORS properly configured
- ✅ HTTPS enforced (auto by Vercel)

---

## 📈 Scaling Considerations

### Vercel Limits (Hobby Plan)

```
Bandwidth: 100 GB/month
Serverless Function Execution: 100 GB-hours
Build Execution: 100 hours/month
```

**If Exceeded:**
- Upgrade to Pro plan ($20/month)
- Unlimited bandwidth & executions
- Advanced analytics
- Team collaboration

### Database Limits (Supabase Free)

```
Database Size: 500 MB
File Storage: 1 GB
Monthly Active Users: Unlimited
API Requests: Unlimited (with rate limits)
```

**If Exceeded:**
- Upgrade to Pro plan ($25/month)
- 8 GB database
- 100 GB storage
- Point-in-time recovery

---

## 🎯 Production Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] MIGRATION.sql executed in Supabase
- [ ] Test user accounts created
- [ ] Email notification tested (if configured)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] All pages tested in production
- [ ] API endpoints tested
- [ ] Mobile responsive checked
- [ ] Browser compatibility tested
- [ ] Performance metrics acceptable
- [ ] Error monitoring enabled
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team trained on admin features

---

## 📞 Support Resources

### Vercel
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support
- Status: https://vercel-status.com

### Supabase
- Documentation: https://supabase.com/docs
- Support: https://supabase.com/support
- Status: https://status.supabase.com

### Next.js
- Documentation: https://nextjs.org/docs
- Discord: https://nextjs.org/discord

---

## 🚀 Quick Deploy Command

```bash
# One-line deploy (after initial setup)
git add . && git commit -m "Update" && git push origin main

# Auto-deploys to Vercel ✅
```

---

## ✅ Success!

Your application is now deployed and accessible at:
```
https://your-app.vercel.app
```

**Next Steps:**
1. Share URL with team
2. Create admin accounts
3. Test full workflow
4. Monitor analytics
5. Gather user feedback
6. Iterate and improve

---

**Deployment completed successfully! 🎉**
