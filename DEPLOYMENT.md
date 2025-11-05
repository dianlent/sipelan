# 🚀 Panduan Deployment SIPelan

## Deployment ke Vercel (Recommended)

### Prasyarat
- Akun GitHub (sudah ada ✅)
- Akun Vercel (gratis) - [vercel.com](https://vercel.com)
- Repository sudah di-push ke GitHub ✅

### Langkah 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Langkah 2: Deploy via Vercel Dashboard (Mudah!)

1. **Buka Vercel Dashboard**
   - Kunjungi: https://vercel.com
   - Login dengan akun GitHub Anda

2. **Import Project**
   - Klik "Add New..." → "Project"
   - Pilih repository: `dianlent/sipelan`
   - Klik "Import"

3. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Environment Variables** (Optional untuk sekarang)
   ```
   NEXT_PUBLIC_APP_NAME=SIPelan
   NEXT_PUBLIC_APP_URL=https://sipelan.vercel.app
   ```

5. **Deploy!**
   - Klik "Deploy"
   - Tunggu 2-3 menit
   - Aplikasi Anda akan live! 🎉

### Langkah 3: Deploy via CLI (Alternative)

```bash
# Login ke Vercel
vercel login

# Deploy
vercel

# Deploy ke production
vercel --prod
```

## URL Deployment

Setelah deploy berhasil, aplikasi akan tersedia di:
- **Production**: `https://sipelan.vercel.app`
- **Preview**: `https://sipelan-[hash].vercel.app`

## Auto-Deploy

✅ Setiap kali Anda push ke GitHub, Vercel akan otomatis deploy!

```bash
git add .
git commit -m "Update feature"
git push origin main
```

## Fitur yang Berfungsi di Production

✅ **Semua fitur frontend**
- Form pengaduan
- Tracking pengaduan
- Dashboard user
- Admin panel
- Bidang panel
- Timeline progress
- Statistik real-time

✅ **localStorage sebagai database**
- Data tersimpan di browser user
- Tidak perlu database server
- Cocok untuk demo dan testing

## Upgrade ke Database Real (Future)

Untuk production dengan database real, Anda bisa:

### Option 1: Supabase (Recommended)
```bash
npm install @supabase/supabase-js
```

### Option 2: MongoDB Atlas
```bash
npm install mongodb mongoose
```

### Option 3: PostgreSQL (Vercel Postgres)
```bash
npm install @vercel/postgres
```

## Custom Domain

Setelah deploy, Anda bisa tambahkan custom domain:

1. Buka Project Settings di Vercel
2. Pilih "Domains"
3. Tambahkan domain Anda (misal: `sipelan.patikab.go.id`)
4. Update DNS records sesuai instruksi

## Monitoring

Vercel menyediakan:
- ✅ Analytics
- ✅ Real-time logs
- ✅ Performance metrics
- ✅ Error tracking

## Troubleshooting

### Build Error
```bash
# Test build locally
npm run build

# Check logs
vercel logs
```

### Environment Variables
- Pastikan semua env vars sudah di-set di Vercel Dashboard
- Prefix `NEXT_PUBLIC_` untuk client-side variables

### localStorage Issues
- localStorage hanya berfungsi di client-side
- Pastikan kode yang menggunakan localStorage ada di client component

## Support

Jika ada masalah:
1. Check Vercel logs
2. Check browser console
3. Review deployment logs di Vercel Dashboard

## Checklist Deployment

- [x] Repository di-push ke GitHub
- [x] `vercel.json` sudah dibuat
- [x] `.env.example` sudah dibuat
- [ ] Akun Vercel sudah dibuat
- [ ] Project di-import ke Vercel
- [ ] Deploy berhasil
- [ ] Test semua fitur di production
- [ ] Custom domain (optional)

## Next Steps

Setelah deploy berhasil:
1. ✅ Test semua fitur
2. ✅ Share URL ke stakeholders
3. ✅ Setup custom domain (optional)
4. ✅ Enable analytics
5. ✅ Monitor performance

---

**Selamat! Aplikasi SIPelan Anda sudah live! 🎉**

Akses di: https://sipelan.vercel.app (setelah deploy)
