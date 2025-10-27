# SIPELAN - Sistem Pengaduan Layanan

**SIPELAN** (Sistem Pengaduan Layanan) adalah platform pengaduan online Dinas Tenaga Kerja Kabupaten Pati untuk menampung aspirasi dan keluhan masyarakat terkait permasalahan ketenagakerjaan di Kabupaten Pati, Jawa Tengah.

## Fitur Utama

### Bagian Publik (Frontend)
- **Halaman Utama (Landing Page)**
  - Desain profesional dengan branding resmi Pemkab Pati & Disnaker
  - Hero section dengan CTA "Buat Pengaduan" dan "Lacak Aduan"
  - Statistik pengaduan real-time (total, dalam proses, selesai)
  - Navigasi: Beranda, Buat Aduan, Lacak Aduan, Alur Pengaduan, Kontak

### Pengguna Sistem
1. **Pelapor (Masyarakat Umum)**: Pekerja, buruh, atau warga yang mengalami atau menyaksikan masalah ketenagakerjaan
2. **Petugas/Admin Disnaker**: Staf yang bertugas menerima, memverifikasi, mengelola, menindaklanjuti, dan memberi respons terhadap pengaduan
3. **Pimpinan/Kepala Dinas**: Akses read-only untuk memantau statistik, progres pengaduan, dan laporan

## Teknologi

- **Framework**: Next.js 14 (React)
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Language**: TypeScript

## Instalasi

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

3. Buka browser dan akses:
```
http://localhost:3000
```

## Struktur Proyek

```
sipelan/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Footer.tsx          # Footer component
│   │   └── ui/                 # UI components (shadcn)
│   │       ├── button.tsx
│   │       └── card.tsx
│   └── lib/
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## Build untuk Production

```bash
npm run build
npm start
```

## Lisensi

© 2024 SIPELAN - Dinas Tenaga Kerja Kabupaten Pati. Hak Cipta Dilindungi.
