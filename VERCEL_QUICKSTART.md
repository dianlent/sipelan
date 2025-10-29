# Vercel Quick Start - SIPELAN

## 🚀 Deploy dalam 5 Menit

### Step 1: Prepare Database (2 menit)

**Option A: Vercel Postgres** (Termudah)
1. Buka [vercel.com/dashboard](https://vercel.com/dashboard)
2. Klik "Storage" → "Create Database" → "Postgres"
3. Pilih region: Singapore
4. Copy connection string

**Option B: Supabase** (Gratis & Powerful)
1. Buka [supabase.com](https://supabase.com)
2. Create new project
3. Settings → Database → Connection String
4. Copy URI

---

### Step 2: Deploy to Vercel (2 menit)

1. **Import Project:**
   - Buka [vercel.com/new](https://vercel.com/new)
   - Connect GitHub
   - Import repository: `sipelan`

2. **Add Environment Variables:**
   ```
   DATABASE_URL=postgresql://your-connection-string
   JWT_SECRET=generate-with-openssl-rand-base64-32
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=SIPELAN <noreply@sipelan.patikab.go.id>
   ```

3. **Deploy:**
   - Klik "Deploy"
   - Tunggu 2-3 menit
   - Done! 🎉

---

### Step 3: Run Migrations (1 menit)

```bash
# Set database URL
export DATABASE_URL="your-vercel-postgres-url"

# Run migrations
npx prisma migrate deploy

# Create admin user (via Prisma Studio)
npx prisma studio
```

---

### ✅ Verification

1. Buka: `https://your-project.vercel.app`
2. Test login: `/login`
3. Create pengaduan: `/buat-aduan`
4. Check dashboard: `/admin/dashboard`

---

### 🔧 Quick Commands

```bash
# Deploy via CLI
npm i -g vercel
vercel login
vercel --prod

# Pull environment variables
vercel env pull .env.local

# View logs
vercel logs

# Rollback
vercel rollback
```

---

### 📊 Monitoring

- **Deployments**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Analytics**: Project → Analytics
- **Logs**: Project → Logs
- **Functions**: Project → Functions

---

### 🆘 Common Issues

**Build Failed?**
- Check environment variables
- Ensure all dependencies installed
- View build logs

**Database Connection Error?**
- Verify DATABASE_URL format
- Check database is accessible
- Test with: `npx prisma db push`

**Function Timeout?**
- Optimize API routes
- Use Edge runtime
- Upgrade to Pro plan (60s timeout)

---

### 🎯 Next Steps

1. ✅ Add custom domain
2. ✅ Setup file storage (Vercel Blob)
3. ✅ Enable analytics
4. ✅ Configure monitoring
5. ✅ Setup backup strategy

---

**Need Help?**
- Documentation: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Contact: male.deeant@gmail.com
