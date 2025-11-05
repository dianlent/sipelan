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
- [Instalasi](#-instalasi)
- [Penggunaan](#-penggunaan)
- [Struktur Proyek](#-struktur-proyek)
- [Role & Permission](#-role--permission)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
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
- **Tracking Real-time** - Lacak status pengaduan dengan kode tracking
- **Timeline Progress** - Lihat progress pengaduan secara visual
- **Notifikasi Email** - Terima update via email
- **Upload Bukti** - Lampirkan dokumen pendukung

### 👨‍💼 Untuk Admin

- **Dashboard Komprehensif** - Overview statistik pengaduan
- **Manajemen Pengaduan** - Verifikasi dan disposisi pengaduan
- **Update Status** - Ubah status pengaduan dengan keterangan
- **Disposisi ke Bidang** - Teruskan pengaduan ke bidang terkait
- **Profile Management** - Kelola informasi akun

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

### Backend (Planned)

- **API**: Express.js / Next.js API Routes
- **Database**: PostgreSQL / Supabase
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **Email**: Nodemailer

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **Version Control**: Git & GitHub
- **Deployment**: Vercel / Netlify

## 📦 Instalasi

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
# Database (jika menggunakan)
DATABASE_URL=your_database_url

# Authentication
JWT_SECRET=your_jwt_secret

# Email (jika menggunakan)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

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
│   ├── bidang/              # Bidang dashboard
│   ├── dashboard/           # User dashboard
│   ├── login/               # Login page
│   ├── pengaduan/           # Submit pengaduan
│   ├── riwayat/             # Riwayat pengaduan
│   ├── settings/            # User settings
│   ├── tracking/            # Track pengaduan
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/              # Reusable components
│   └── PengaduanTimeline.tsx
├── contexts/                # React contexts
│   └── AuthContext.tsx      # Authentication context
├── public/                  # Static assets
├── styles/                  # Global styles
├── .env.local              # Environment variables
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 👥 Role & Permission

### 1. Public (Masyarakat)

- ✅ Submit pengaduan
- ✅ Track pengaduan dengan kode
- ✅ Lihat timeline progress
- ❌ Tidak perlu login

### 2. User (Pelapor Terdaftar)

- ✅ Semua akses Public
- ✅ Dashboard pribadi
- ✅ Riwayat pengaduan
- ✅ Notifikasi email
- ✅ Profile management

### 3. Bidang (Staff Bidang)

- ✅ Dashboard bidang
- ✅ Lihat pengaduan yang didisposisi
- ✅ Update progress tindak lanjut
- ✅ Upload dokumen hasil
- ✅ Komunikasi dengan admin

### 4. Admin (Administrator)

- ✅ Full access ke semua pengaduan
- ✅ Verifikasi pengaduan baru
- ✅ Disposisi ke bidang
- ✅ Update status pengaduan
- ✅ Manajemen user
- ✅ Generate laporan

## 📊 API Documentation

### Authentication

```typescript
// Login
POST /api/auth/login
Body: { username: string, password: string }
Response: { user: User, token: string }

// Logout
POST /api/auth/logout
Headers: { Authorization: Bearer <token> }
```

### Pengaduan

```typescript
// Create Pengaduan
POST /api/pengaduan
Body: { judul: string, isi: string, kategori: string, ... }
Response: { pengaduan: Pengaduan, kode_tracking: string }

// Get Pengaduan by Kode
GET /api/pengaduan/:kode
Response: { pengaduan: Pengaduan, timeline: Timeline[] }

// Update Status
PUT /api/pengaduan/:id/status
Body: { status: string, keterangan: string }
Headers: { Authorization: Bearer <token> }
```

## 📸 Screenshots

### Homepage
Modern landing page dengan hero section dan fitur unggulan

### Dashboard Admin
Comprehensive dashboard dengan statistik dan manajemen pengaduan

### Tracking Page
Real-time tracking dengan timeline progress yang visual

### Timeline Progress
Dynamic timeline yang menampilkan setiap tahap pengaduan

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

## 🙏 Acknowledgments

- Next.js Team untuk framework yang luar biasa
- Vercel untuk hosting yang mudah
- Tailwind CSS untuk styling yang efisien
- Framer Motion untuk animasi yang smooth
- Lucide untuk icon set yang indah

---

<div align="center">
  <strong>Dibuat dengan ❤️ untuk pelayanan publik yang lebih baik</strong>
</div>

<div align="center">
  <sub>© 2025 Dian Lentera Buana | Dinas Tenaga Kerja Kabupaten Pati. All rights reserved.</sub>
</div>
