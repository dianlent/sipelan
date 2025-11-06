# 🚀 Deploy Now - Quick Start

## ⚡ Deploy ke Vercel (5 Menit)

### Step 1: Login ke Vercel
1. Buka: https://vercel.com
2. Klik "Sign Up" atau "Login"
3. Pilih "Continue with GitHub"
4. Authorize Vercel

### Step 2: Import Project
1. Klik "Add New..." → "Project"
2. Find repository: **dianlent/sipelan**
3. Klik "Import"

### Step 3: Configure

**Project Name:** `sipelan` (atau custom name)

**Framework:** Next.js (auto-detected) ✅

**Build Settings:** (default - jangan diubah)
```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Step 4: Add Environment Variables

**REQUIRED - Copy paste ini:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://pdsfruupgjezqzigncjv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkc2ZydXVwZ2plenF6aWduY2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2OTYzOTAsImV4cCI6MjA0NjI3MjM5MH0.dEuvP-ZjCrZ10-8Pk_Bke-gW3g4KD_wmnJRt7Tuw6o8
SUPABASE_SERVICE_KEY=(your_service_key_from_supabase)
NEXT_PUBLIC_APP_NAME=SIPelan
```

**OPTIONAL (Email Notification):**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=male.deeant@gmail.com
SMTP_PASS=qcevxhurjcyjzlxh
SMTP_FROM="SIPelan" <male.deeant@gmail.com>
```

**How to add:**
- Expand "Environment Variables"
- For each variable:
  - Key: `NEXT_PUBLIC_SUPABASE_URL`
  - Value: `https://pdsfruupgjezqzigncjv.supabase.co`
  - Click "Add"
- Repeat untuk semua variables

### Step 5: Deploy!

1. Klik **"Deploy"** button
2. Wait 2-3 minutes ⏳
3. Done! 🎉

---

## 🎯 After Deployment

### Your App URL:
```
https://sipelan.vercel.app
```
(atau URL yang diberikan Vercel)

### Test These Pages:
```
✓ https://your-app.vercel.app/
✓ https://your-app.vercel.app/pengaduan
✓ https://your-app.vercel.app/tracking
✓ https://your-app.vercel.app/login
✓ https://your-app.vercel.app/admin
✓ https://your-app.vercel.app/bidang
```

### Login Credentials (Sesuaikan dengan database Anda):

**Admin:**
```
Email: admin@disnaker.go.id
Password: (sesuai database)
```

**Bidang:**
```
Email: hi@disnaker.go.id
Password: (sesuai database)
```

---

## ✅ Post-Deployment Checklist

Setelah deploy berhasil:

- [ ] Buka deployment URL
- [ ] Test submit pengaduan baru
- [ ] Test tracking dengan kode pengaduan
- [ ] Login sebagai admin
- [ ] Test verifikasi pengaduan
- [ ] Test disposisi ke bidang
- [ ] Login sebagai user bidang
- [ ] Test update status di bidang
- [ ] Test tanggapan (email notification)
- [ ] Check semua halaman responsive di mobile

---

## 🔧 Troubleshooting

### Build Failed?

**Check:**
1. Environment variables spelling benar
2. Supabase credentials valid
3. Build logs di Vercel Dashboard

**Fix:**
- Vercel Dashboard → Settings → Environment Variables
- Check typo
- Redeploy: Deployments → ... → Redeploy

### Database Not Connecting?

**Check:**
1. MIGRATION.sql sudah dijalankan di Supabase?
2. RLS policies enabled?
3. Service key correct?

**Fix:**
- Supabase Dashboard → SQL Editor
- Run MIGRATION.sql
- Check policies di Authentication → Policies

### 404 on Pages?

**Check:**
1. Build successful?
2. Routes file structure correct?

**Fix:**
- Vercel Dashboard → Deployments → View Function Logs
- Check for errors

---

## 🚀 Auto-Deploy Setup

**Already Configured!** ✅

Every time you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

→ Vercel automatically deploys! 🎉

---

## 📱 Share Your App

URL to share:
```
https://sipelan.vercel.app
```

Or add custom domain:
1. Vercel Dashboard → Project → Settings → Domains
2. Add: `sipelan.disnaker.go.id`
3. Follow DNS instructions
4. Wait 5-30 minutes for DNS propagation

---

## 🎉 You're Live!

Application deployed and ready for users!

**Next Actions:**
1. ✅ Test thoroughly
2. ✅ Create user accounts
3. ✅ Train admin team
4. ✅ Announce to public
5. ✅ Monitor usage

**Questions?**
Check `DEPLOYMENT_GUIDE.md` for detailed documentation.
