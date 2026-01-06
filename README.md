# 🏢 SIPelan - Sistem Pengaduan Layanan Online Naker

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> Sistem Pengaduan Layanan Online untuk Dinas Ketenagakerjaan - Melayani pengaduan masyarakat terkait ketenagakerjaan dengan cepat, transparan, dan profesional.

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Teknologi](#-teknologi)
- [Quick Start](#-quick-start)
- [Setup Database](#-setup-database)
- [Konfigurasi Email](#-konfigurasi-email)
- [Instalasi Lengkap](#-instalasi-lengkap)
- [Struktur Proyek](#-struktur-proyek)
- [Role & Permission](#-role--permission)
- [Test Flow](#-test-flow)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)
- [Migration Guide](#-migration-guide)
- [Deployment](#-deployment)
- [Disposisi Flow](#-disposisi-flow)
- [Features Highlights](#-features-highlights)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

## 🎯 Tentang Proyek

**SIPelan** adalah aplikasi web modern untuk mengelola pengaduan masyarakat terkait ketenagakerjaan. Sistem ini dirancang untuk memberikan kemudahan bagi masyarakat dalam menyampaikan keluhan, serta memudahkan Dinas Ketenagakerjaan dalam mengelola dan menindaklanjuti setiap pengaduan.

### Tujuan

- ✅ Meningkatkan transparansi dalam penanganan pengaduan
- ✅ Mempercepat proses disposisi dan tindak lanjut
- ✅ Memberikan kemudahan akses bagi masyarakat
- ✅ Monitoring real-time status pengaduan
- ✅ Meningkatkan akuntabilitas pelayanan publik

## ✨ Fitur Utama

### 👥 Untuk Masyarakat

- **Pengaduan Online** - Submit pengaduan tanpa perlu datang ke kantor
- **Pengaduan Anonim** - Opsi untuk mengadu tanpa identitas
- **Tracking Real-time** - Lacak status pengaduan dengan kode tracking
- **Timeline Progress** - Lihat progress pengaduan secara visual
- **Notifikasi Email** - Terima update via email otomatis
- **Upload Bukti** - Lampirkan dokumen pendukung (PDF, gambar)
- **FAQ Page** - Pertanyaan yang sering diajukan

### 👨‍💼 Untuk Admin

- **Dashboard Komprehensif** - Overview statistik pengaduan real-time
- **Manajemen Pengaduan** - Verifikasi dan disposisi pengaduan
- **Manajemen User** - Kelola pengguna sistem
- **Laporan & Statistik** - Charts dan grafik dengan Chart.js
- **Update Status** - Ubah status pengaduan dengan keterangan
- **Disposisi ke Bidang** - Teruskan pengaduan ke bidang terkait
- **Pengaturan Sistem** - Konfigurasi SMTP dan preferensi
- **Responsive Design** - Mobile-friendly admin panel

### 🏛️ Untuk Bidang

- **Dashboard Bidang** - Lihat pengaduan yang didisposisi
- **Tindak Lanjut** - Update progress penanganan
- **Laporan** - Generate laporan penanganan
- **Komunikasi** - Koordinasi dengan admin

## 🛠️ Teknologi

### Frontend

- **Framework**: [Next.js 14](https://nextjs.org/) - React framework dengan App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Animation**: [Framer Motion](https://www.framer.com/motion/) - Production-ready animations
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful & consistent icons
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/) - Lightweight notifications

### Backend

- **Database**: PostgreSQL (self-hosted)
- **API**: Next.js API Routes
- **Authentication**: JWT + bcrypt
- **File Storage**: Local filesystem (uploads)
- **Email**: [Nodemailer](https://nodemailer.com/) - SMTP email service
- **Charts**: [Chart.js](https://www.chartjs.org/) + react-chartjs-2

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **Version Control**: Git & GitHub
- **Deployment**: Vercel / Netlify

## 🚀 Quick Start

### Instalasi Cepat (5 Menit)

```bash
# 1. Clone & Install
git clone https://github.com/dianlent/sipelan.git
cd sipelan
npm install

# 2. Setup Environment
cp .env.example .env.local
# Edit .env.local dengan credentials Anda

# 3. Run Development
npm run dev
```

Buka [http://localhost:5000](http://localhost:5000)

**Default Login:**
- Username: `admin`
- Password: `admin123`

---

## 🗄️ Setup Database

### Setup Lengkap (1 File SQL)

**Semua setup database sudah disatukan dalam 1 file SQL!**

1. **Siapkan Database PostgreSQL**
   - Buat database baru (mis. `sipelan`)
   - Pastikan user DB punya akses CREATE/INSERT

2. **Jalankan Schema SQL**
   - Buka file `database/schema.sql`
   - Copy seluruh isi file
   - Jalankan dengan `psql` atau DB client pilihan Anda
   - Klik **Run**

3. **Selesai!** ✅
   - Semua tables ter-create
   - Data awal ter-insert (kategori, bidang)
   - File upload tersimpan di folder `uploads/`
   - Admin user ter-create (username: `admin`, password: `admin123`)
   - Trigger auto-generate kode ter-install

### Yang Sudah Termasuk dalam schema.sql:

✅ **Tables**: users, pengaduan, pengaduan_status, kategori_pengaduan, bidang, disposisi, tanggapan  
✅ **Indexes**: Optimasi query performance  
✅ **Trigger**: Auto-generate kode pengaduan (ADU-YYYY-XXXX)  
✅ **File Upload**: tersimpan di folder `uploads/`  
✅ **Default Data**: 5 kategori, 5 bidang, 1 admin user  
✅ **Security**: akses dibatasi oleh aplikasi  
✅ **Verification Queries**: Check setup berhasil

---

## 📧 Konfigurasi Email

### Setup SMTP (Gmail)

1. **Enable 2-Factor Authentication** di Google Account
2. **Generate App Password**:
   - Google Account → Security → 2-Step Verification → App passwords
   - Select app: Mail
   - Select device: Other (Custom name)
   - Copy 16-digit password

3. **Update .env.local**:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-digit-app-password
SMTP_FROM="SIPelan" <noreply@sipelan.go.id>
```

### Email Triggers

- ✅ **Pengaduan Created** → Email konfirmasi + kode tracking
- ✅ **Status Updated** → Email notifikasi perubahan status
- ✅ **Pengaduan Selesai** → Email final dengan hasil

### Test Email

```bash
# Buat pengaduan baru dengan email valid
# Check inbox untuk konfirmasi email
```

---

## 📦 Instalasi Lengkap

### Prerequisites

- Node.js 18.x atau lebih tinggi
- npm atau yarn
- Git

### Langkah Instalasi

1. **Clone Repository**

```bash
git clone https://github.com/dianlent/sipelan.git
cd sipelan
```

2. **Install Dependencies**

```bash
npm install
# atau
yarn install
```

3. **Setup Environment Variables**

Buat file `.env.local` di root directory:

```env
# PostgreSQL\nDATABASE_URL=postgresql://user:password@localhost:5432/sipelan\nPGSSLMODE=disable\nUPLOAD_DIR=uploads\nFILE_BASE_URL=http://localhost:5000/uploads\n
# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="SIPelan" <noreply@sipelan.go.id>

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:5000
```

4. **Run Development Server**

```bash
npm run dev
# atau
yarn dev
```

5. **Open Browser**

Buka [http://localhost:5000](http://localhost:5000) di browser Anda.

## 🚀 Penggunaan

### Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Production Deployment

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

## 📁 Struktur Proyek

```
sipelan/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin dashboard
│   │   ├── pengaduan/       # Manajemen pengaduan
│   │   ├── reports/         # Laporan & statistik
│   │   ├── settings/        # Pengaturan sistem
│   │   ├── users/           # Manajemen user
│   │   └── page.tsx         # Admin dashboard
│   ├── api/                 # API Routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── pengaduan/       # Pengaduan endpoints
│   │   ├── stats/           # Statistics endpoints
│   │   └── users/           # User management endpoints
│   ├── faq/                 # FAQ page
│   ├── login/               # Login page
│   ├── pengaduan/           # Submit pengaduan
│   ├── privacy/             # Kebijakan privasi
│   ├── terms/               # Syarat & ketentuan
│   ├── tracking/            # Track pengaduan
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/              # Reusable components
│   ├── AdminSidebar.tsx     # Admin sidebar (responsive)
│   ├── Footer.tsx           # Footer component
│   └── PengaduanTimeline.tsx # Timeline component
├── contexts/                # React contexts
│   └── AuthContext.tsx      # Authentication context
├── database/                # Database schema
│   └── schema.sql           # PostgreSQL schema
├── lib/                     # Utility libraries
│   ├── email.ts             # Email utilities
│   └── db.ts                # PostgreSQL client
├── public/                  # Static assets
├── .env.local              # Environment variables
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 👥 Role & Permission

### 1. Public (Masyarakat)
- ✅ Submit pengaduan | ✅ Track dengan kode | ✅ Timeline progress | ❌ No login required

### 2. User (Pelapor Terdaftar)
- ✅ All Public access | ✅ Dashboard pribadi | ✅ Riwayat | ✅ Email notif | ✅ Profile

### 3. Bidang (Staff Bidang)
- ✅ Dashboard bidang | ✅ Pengaduan terdisposisi | ✅ Update progress | ✅ Upload hasil

### 4. Admin (Administrator)
- ✅ Full access | ✅ Verifikasi | ✅ Disposisi | ✅ Update status | ✅ User management | ✅ Reports

---

## 🧪 Test Flow

### 1. Test Pengaduan (Public)
```bash
1. Buka /pengaduan
2. Isi form lengkap
3. Upload file (optional)
4. Submit → Dapat kode tracking (ADU-2025-XXXX)
5. Buka /tracking → Input kode
6. Lihat timeline progress
```

### 2. Test Admin Flow
```bash
1. Login sebagai admin
2. Dashboard → Lihat stats
3. Pengaduan → Verifikasi pengaduan baru
4. Disposisi → Pilih bidang
5. Update status → Masuk → Terverifikasi → Terdisposisi
6. Check email pelapor (jika tidak anonim)
```

### 3. Test Email Notification
```bash
1. Buat pengaduan dengan email valid
2. Check inbox → Email konfirmasi
3. Admin update status
4. Check inbox → Email update status
5. Admin set status "selesai"
6. Check inbox → Email final
```

### 4. Test Responsive Design
```bash
# Desktop (> 1024px)
- Sidebar visible & collapsible
- 4-column grids
- Full features

# Tablet (640-1024px)
- Sidebar visible
- 2-column grids
- Comfortable spacing

# Mobile (< 640px)
- Hamburger menu
- 1-column stack
- Horizontal scroll tables
```

---

## 🔧 Troubleshooting

### Database Issues

**Error: "relation does not exist"**
```bash
# Jalankan ulang database/schema.sql di psql atau DB client
# Pastikan semua tables ter-create dengan verification queries
```

**Error: "duplicate key value violates unique constraint"**
```bash
# Trigger auto-generate kode sudah ter-install di schema.sql
# Jika masih error, jalankan ulang schema.sql dari awal
```

### Email Issues

**Email tidak terkirim**
```env
# Check SMTP credentials di .env.local
# Pastikan App Password sudah benar (16 digit tanpa spasi)
# Test dengan: console.log di lib/email.ts
```

**Email masuk spam**
```bash
# Setup SPF & DKIM records di domain
# Atau gunakan email service (SendGrid, Mailgun)
```

### Bidang Dashboard Issues

**Pengaduan tidak muncul di Bidang Dashboard**
```sql
-- 1. Verify user bidang
SELECT id, username, kode_bidang, role FROM users WHERE role = 'bidang';

-- 2. Check pengaduan assignment
SELECT id, kode_pengaduan, kode_bidang, status 
FROM pengaduan 
WHERE kode_bidang = 'YOUR_KODE_BIDANG';

-- 3. Update if needed
UPDATE pengaduan 
SET kode_bidang = 'CORRECT_KODE'
WHERE id = pengaduan_id;
```

**Cannot update status**
```typescript
// 1. Check role & kode_bidang
const user = await getCurrentUser();
console.log({ role: user.role, kode_bidang: user.kode_bidang });

// 2. Verify API endpoint
PUT /api/pengaduan/[id]/status
Body: { status: 'tindak_lanjut', kode_bidang: user.kode_bidang }

// 3. Check response
if (!response.success) {
  console.error(response.message);
}
```

### Session Issues

**Auto logout**
```typescript
// Check JWT_EXPIRES_IN di .env.local
// Default: 7d (7 hari)
// Increase jika perlu: JWT_EXPIRES_IN=30d
```

**Token invalid**
```bash
# Clear localStorage
localStorage.clear()
# Login ulang
```

### Build/Deploy Issues

**Vercel build failed**
```bash
# Check environment variables di Vercel dashboard
# Pastikan semua NEXT_PUBLIC_* variables ada
# Check build logs untuk error spesifik
```

**Chart.js not rendering**
```bash
# Pastikan Chart.js registered di component
# Check browser console untuk errors
# Verify data format sesuai Chart.js docs
```

---

## 🔄 Migration Guide

### From Old Version to v2.0

#### 1. Database Migration
```sql
-- Add new columns
ALTER TABLE pengaduan ADD COLUMN IF NOT EXISTS anonim BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing data
UPDATE pengaduan SET anonim = false WHERE anonim IS NULL;
UPDATE users SET is_active = true WHERE is_active IS NULL;
```

#### 2. Environment Variables
```env
# Old (Supabase)\nNEXT_PUBLIC_SUPABASE_URL=...\nNEXT_PUBLIC_SUPABASE_ANON_KEY=...\nSUPABASE_SERVICE_KEY=...\n\n# New (PostgreSQL)\nDATABASE_URL=postgresql://user:password@localhost:5432/sipelan\nPGSSLMODE=disable\n```

#### 3. API Changes
```typescript
// Old
POST /api/pengaduan
Response: { kode_tracking: string }

// New
POST /api/pengaduan
Response: { success: boolean, data: { kode_pengaduan: string } }
```

#### 4. Component Updates
```typescript
// Old: Recharts
import { LineChart } from 'recharts'

// New: Chart.js
import { Line } from 'react-chartjs-2'
```

### Breaking Changes
- ❌ Recharts removed → Use Chart.js
- ❌ Direct database access → Use PostgreSQL client
- ❌ Old email system → Use lib/email.ts
- ✅ New responsive sidebar
- ✅ Email notifications
- ✅ Enhanced admin panel

## 📊 API Documentation

### Authentication

```typescript
// Login
POST /api/auth/login
Body: { username: string, password: string }
Response: { success: boolean, user: User, token: string }

// Logout
POST /api/auth/logout
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, message: string }
```

### Pengaduan

```typescript
// Create Pengaduan
POST /api/pengaduan
Body: FormData {
  judul_pengaduan: string
  isi_pengaduan: string
  kategori_id: number
  nama_pelapor?: string
  email_pelapor?: string
  no_telepon?: string
  nik?: string
  anonim: boolean
  lampiran?: File
}
Response: { success: boolean, data: { kode_pengaduan: string, ... } }

// Get Pengaduan by Kode
GET /api/pengaduan?kode=ADU-2025-XXXX
Response: { success: boolean, data: Pengaduan, timeline: Timeline[] }

// Get All Pengaduan (Admin)
GET /api/pengaduan?page=1&limit=10&status=masuk
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, data: Pengaduan[], total: number }

// Update Status
PUT /api/pengaduan/:id/status
Body: { status: string, kode_bidang?: string }
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, message: string }
```

### Statistics

```typescript
// Get Statistics
GET /api/stats?range=6months&format=simple
Response: {
  success: boolean
  data: {
    totalPengaduan: number
    selesai: number
    proses: number
    pengaduanByMonth: Array<{ month: string, count: number }>
    pengaduanByStatus: Array<{ status: string, count: number, color: string }>
    pengaduanByKategori: Array<{ kategori: string, count: number }>
    pengaduanByBidang: Array<{ bidang: string, count: number }>
  }
}
```

### Users

```typescript
// Get All Users (Admin)
GET /api/users
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, data: User[] }

// Create User (Admin)
POST /api/users
Body: { username: string, email: string, password: string, role: string }
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, data: User }
```

## 📸 Screenshots

### Homepage
- Modern landing page dengan hero section
- Statistik real-time
- Fitur unggulan
- Call-to-action buttons
- Responsive footer

### Dashboard Admin
- Comprehensive statistics cards
- Charts dengan Chart.js (Line, Doughnut, Bar)
- Manajemen pengaduan
- Responsive sidebar dengan hamburger menu
- Time range filter

### Tracking Page
- Real-time tracking dengan kode pengaduan
- Timeline progress yang visual
- Status badges dengan warna
- Detail pengaduan lengkap

### Admin Pages
- **Users Management**: Table dengan search & filter
- **Reports**: Charts & grafik statistik
- **Settings**: Tabs untuk profil, keamanan, notifikasi, sistem
- **Pengaduan**: List dengan disposisi modal

## 🎨 Design Features

### Responsive Design
- ✅ **Mobile-First Approach** - Optimized untuk semua device
- ✅ **Breakpoints**: Mobile (< 640px), Tablet (640-1024px), Desktop (> 1024px)
- ✅ **Mobile Sidebar** - Hamburger menu dengan slide-in animation
- ✅ **Responsive Tables** - Horizontal scroll di mobile
- ✅ **Adaptive Grids** - 1 → 2 → 4 columns
- ✅ **Touch-Friendly** - Minimum 44x44px tap targets

### UI/UX Features
- ✅ **Smooth Animations** - Framer Motion untuk transitions
- ✅ **Loading States** - Skeleton screens & spinners
- ✅ **Toast Notifications** - React Hot Toast
- ✅ **Color-Coded Status** - Visual status indicators
- ✅ **Gradient Backgrounds** - Modern aesthetic
- ✅ **Icon System** - Lucide React icons

## 📧 Email Notifications

### Automated Email System
- ✅ **Pengaduan Created** - Email konfirmasi dengan kode tracking
- ✅ **Status Updated** - Email notifikasi setiap perubahan status
- ✅ **Professional Templates** - HTML email dengan branding
- ✅ **SMTP Configuration** - Nodemailer dengan Gmail/SMTP

### Email Templates
```typescript
// Pengaduan Created Email
- Kode tracking (highlighted)
- Detail pengaduan
- Langkah selanjutnya
- Link tracking
- Contact information

// Status Update Email
- Status lama → Status baru (visual)
- Detail perubahan
- Timeline update
- Link detail pengaduan
```

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan ikuti langkah berikut:

1. Fork repository ini
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Coding Standards

- Gunakan TypeScript untuk type safety
- Follow ESLint rules
- Write meaningful commit messages
- Add comments untuk logic yang kompleks
- Test sebelum submit PR

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## 👨‍💻 Author

**Dinas Tenaga Kerja Kabupaten Pati**

- Website: [disnaker.patikab.go.id](https://disnaker.patikab.go.id)
- Email: info@disnaker.patikab.go.id
- GitHub: [@dianlent](https://github.com/dianlent)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

#### 1. Persiapan
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login
```

#### 2. Setup Environment Variables
Di Vercel Dashboard → Settings → Environment Variables, tambahkan:

```env
DATABASE_URL=postgresql://user:password@host:5432/sipelan
PGSSLMODE=require
UPLOAD_DIR=uploads
FILE_BASE_URL=https://your-domain.vercel.app/uploads
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="SIPelan" <noreply@sipelan.go.id>
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### 3. Deploy
```bash
# Development deploy
vercel

# Production deploy
vercel --prod
```

#### 4. Custom Domain (Optional)
```bash
# Add domain
vercel domains add your-domain.com

# Verify DNS
# Add CNAME record: your-domain.com → cname.vercel-dns.com
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Post-Deployment Checklist

- ✅ Environment variables configured
- ✅ Database schema deployed
- ✅ Uploads directory available
- ✅ SMTP credentials working
- ✅ Custom domain configured (if any)
- ✅ SSL certificate active
- ✅ Test all features
- ✅ Monitor error logs

---

## 📋 Disposisi Flow

### Alur Disposisi Pengaduan

```
1. MASUK (Blue)
   ↓
   Admin verifikasi
   ↓
2. TERVERIFIKASI (Green)
   ↓
   Admin disposisi ke bidang
   ↓
3. TERDISPOSISI (Orange)
   ↓
   Bidang tindak lanjut
   ↓
4. TINDAK_LANJUT (Purple)
   ↓
   Bidang selesaikan
   ↓
5. SELESAI (Green)
```

### Admin Actions

```typescript
// 1. Verifikasi
PUT /api/pengaduan/:id/status
Body: { status: 'terverifikasi' }

// 2. Disposisi
PUT /api/pengaduan/:id/status
Body: { 
  status: 'terdisposisi',
  kode_bidang: 'PHI' // atau 'NKT'
}

// Email notification sent automatically
```

### Bidang Actions

```typescript
// 1. Tindak Lanjut
PUT /api/pengaduan/:id/status
Body: { status: 'tindak_lanjut' }

// 2. Selesai
PUT /api/pengaduan/:id/status
Body: { status: 'selesai' }

// Email notification sent to reporter
```

---

## 🚀 Features Highlights

### ✅ Completed Features
1. **Authentication System** - JWT-based login/logout
2. **Pengaduan Management** - Full CRUD operations
3. **Status Tracking** - Real-time dengan timeline
4. **Email Notifications** - Automated dengan Nodemailer
5. **Admin Dashboard** - Statistics & charts
6. **Responsive Design** - Mobile, tablet, desktop
7. **File Upload** - Local filesystem uploads
8. **User Management** - Admin panel untuk users
9. **Reports & Analytics** - Chart.js visualization
10. **FAQ System** - Accordion UI
11. **Privacy & Terms Pages** - Legal pages

### 🔄 Status Flow
```
Masuk → Terverifikasi → Terdisposisi → Tindak Lanjut → Selesai
  ↓         ↓              ↓              ↓            ↓
 Blue    Green         Orange         Purple       Green
```

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Vercel** - Easy deployment platform
- **PostgreSQL** - Database
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Smooth animations
- **Chart.js** - Beautiful charts
- **Lucide** - Icon library
- **Nodemailer** - Email service

---

<div align="center">
  <strong>Dibuat dengan ❤️ untuk pelayanan publik yang lebih baik</strong>
</div>

<div align="center">
  <sub>© 2025 Dian Lentera Buana | Dinas Tenaga Kerja Kabupaten Pati. All rights reserved.</sub>
</div>
