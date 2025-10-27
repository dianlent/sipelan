# Panduan Kustomisasi SIPELAN

## 1. Mengganti Logo

### Langkah 1: Siapkan File Logo
Siapkan logo dalam format PNG atau SVG:
- Logo Pemkab Pati
- Logo Disnaker Pati

### Langkah 2: Simpan di Folder Public
```
public/
├── logo-pemkab-pati.png
└── logo-disnaker.png
```

### Langkah 3: Update Header Component
Edit file `src/components/Header.tsx`:

```tsx
// Ganti bagian ini (baris 25-35):
<div className="flex items-center space-x-2">
  {/* Ganti dengan logo asli */}
  <Image 
    src="/logo-pemkab-pati.png" 
    alt="Pemkab Pati" 
    width={40} 
    height={40}
  />
  <Image 
    src="/logo-disnaker.png" 
    alt="Disnaker Pati" 
    width={40} 
    height={40}
  />
</div>
```

Jangan lupa import Image dari Next.js:
```tsx
import Image from "next/image";
```

## 2. Mengubah Warna Tema

Edit file `tailwind.config.ts` untuk mengubah warna utama:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "hsl(221.2 83.2% 53.3%)", // Biru default
        // Ubah ke warna yang diinginkan, contoh:
        // DEFAULT: "hsl(142 76% 36%)", // Hijau
        // DEFAULT: "hsl(262 83% 58%)", // Ungu
      },
    },
  },
}
```

Atau edit di `src/app/globals.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Ubah nilai ini */
}
```

## 3. Mengubah Informasi Kontak

Edit file `src/components/Footer.tsx`:

```tsx
// Baris 22-36, ubah informasi kontak:
<div className="flex items-start space-x-3">
  <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
  <span className="text-sm">
    Jl. [ALAMAT LENGKAP DISNAKER PATI]
  </span>
</div>
<div className="flex items-center space-x-3">
  <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
  <span className="text-sm">[NOMOR TELEPON]</span>
</div>
<div className="flex items-center space-x-3">
  <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
  <span className="text-sm">[EMAIL RESMI]</span>
</div>
```

## 4. Mengubah Statistik (Koneksi ke Database)

Edit file `src/app/page.tsx`:

```tsx
// Baris 9-13, ganti mock data dengan API call:
const stats = {
  total: 1247,      // Ganti dengan data dari database
  inProgress: 89,   // Ganti dengan data dari database
  completed: 1158,  // Ganti dengan data dari database
};

// Contoh dengan API:
const [stats, setStats] = useState({ total: 0, inProgress: 0, completed: 0 });

useEffect(() => {
  fetch('/api/statistics')
    .then(res => res.json())
    .then(data => setStats(data));
}, []);
```

## 5. Mengubah Teks Hero Section

Edit file `src/app/page.tsx` baris 24-32:

```tsx
<h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
  [JUDUL YANG DIINGINKAN]
  <br />
  <span className="text-blue-200">[SUB JUDUL]</span>
</h1>
<p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
  [DESKRIPSI LAYANAN]
</p>
```

## 6. Menambahkan Google Analytics

Edit file `src/app/layout.tsx`:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

## 7. Mengubah Metadata (SEO)

Edit file `src/app/layout.tsx` baris 7-10:

```tsx
export const metadata: Metadata = {
  title: "[JUDUL WEBSITE]",
  description: "[DESKRIPSI UNTUK SEO]",
  keywords: "pengaduan, ketenagakerjaan, pati, disnaker",
  openGraph: {
    title: "[JUDUL UNTUK SOCIAL MEDIA]",
    description: "[DESKRIPSI UNTUK SOCIAL MEDIA]",
    images: ["/og-image.png"],
  },
};
```

## 8. Menambahkan Favicon

1. Siapkan file favicon (favicon.ico, icon.png)
2. Simpan di folder `src/app/`:
```
src/app/
├── favicon.ico
├── icon.png
└── apple-icon.png
```

Next.js akan otomatis mendeteksi dan menggunakannya.

## 9. Mengubah Font

Edit file `src/app/layout.tsx`:

```tsx
import { Inter, Poppins, Roboto } from "next/font/google";

// Ganti Inter dengan font lain:
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

// Gunakan di body:
<body className={poppins.className}>{children}</body>
```

## 10. Mode Gelap (Dark Mode)

Tambahkan toggle dark mode di `src/components/Header.tsx`:

```tsx
"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

// Di dalam component:
const { theme, setTheme } = useTheme();

// Tambahkan button:
<button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
  {theme === "dark" ? <Sun /> : <Moon />}
</button>
```

Install dependency:
```bash
npm install next-themes
```

## Tips Pengembangan

1. **Gunakan Environment Variables** untuk konfigurasi:
   ```
   # .env.local
   NEXT_PUBLIC_API_URL=https://api.example.com
   NEXT_PUBLIC_SITE_NAME=SIPELAN
   ```

2. **Backup Sebelum Mengubah**: Selalu backup file sebelum melakukan perubahan besar

3. **Test di Multiple Devices**: Pastikan tampilan responsif di berbagai ukuran layar

4. **Optimize Images**: Gunakan format WebP untuk performa lebih baik

5. **Security**: Jangan hardcode API keys atau credentials di kode

---

Untuk bantuan lebih lanjut, lihat dokumentasi:
- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
