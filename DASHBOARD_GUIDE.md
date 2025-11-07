# Dashboard Admin & Bidang - SIPELAN

Dashboard modern yang terinspirasi dari TailAdmin untuk sistem pengaduan SIPELAN.

## 🎨 Fitur Dashboard

### Dashboard Admin (`/dashboard/admin`)
Dashboard khusus untuk administrator dengan fitur:

- **Statistik Real-time**
  - Total pengaduan
  - Pengaduan diterima
  - Pengaduan diproses
  - Pengaduan selesai
  - Trend bulanan dengan persentase perubahan

- **Visualisasi Data**
  - Target bulanan dengan progress bar
  - Statistik kategori pengaduan
  - Grafik distribusi status

- **Aktivitas Terbaru**
  - 5 pengaduan terbaru
  - Quick view dengan status
  - Link langsung ke detail pengaduan

- **Quick Actions**
  - Akses cepat ke semua pengaduan
  - Manajemen pengguna
  - Laporan statistik

### Dashboard Bidang (`/dashboard/bidang`)
Dashboard khusus untuk bidang/departemen dengan fitur:

- **Statistik Bidang**
  - Total pengaduan yang ditugaskan
  - Status pengaduan (diterima, diproses, selesai)
  - Tingkat penyelesaian dalam persentase

- **Progress Monitoring**
  - Progress bar untuk setiap status
  - Kinerja bidang
  - Pengaduan yang sedang ditangani

- **Aktivitas Terbaru**
  - Pengaduan terbaru yang ditugaskan
  - Status dan kategori
  - Akses cepat ke detail

- **Quick Actions**
  - Lihat semua pengaduan bidang
  - Filter pengaduan yang sedang diproses

## 🧩 Komponen Dashboard

### StatCard
Kartu statistik dengan ikon dan trend.

```tsx
<StatCard
  title="Total Pengaduan"
  value={100}
  icon={FileText}
  color="blue"
  trend={{ value: 12.5, isPositive: true }}
/>
```

**Props:**
- `title`: Judul statistik
- `value`: Nilai numerik atau string
- `icon`: Ikon dari lucide-react
- `color`: Warna tema (blue, green, yellow, red, purple, indigo)
- `trend`: (Optional) Trend dengan value dan isPositive

### ChartCard
Container untuk grafik dan visualisasi data.

```tsx
<ChartCard
  title="Monthly Target"
  subtitle="Target penyelesaian bulan ini"
  icon={TrendingUp}
>
  {/* Chart content */}
</ChartCard>
```

**Props:**
- `title`: Judul card
- `subtitle`: (Optional) Subtitle
- `icon`: (Optional) Ikon
- `children`: Konten chart

### ProgressBar
Progress bar animasi dengan label dan persentase.

```tsx
<ProgressBar
  label="Selesai"
  value={75}
  max={100}
  color="green"
/>
```

**Props:**
- `label`: Label progress
- `value`: Nilai saat ini
- `max`: Nilai maksimum
- `color`: Warna bar (blue, green, yellow, red, purple)

### RecentActivity
Daftar aktivitas/pengaduan terbaru.

```tsx
<RecentActivity
  activities={pengaduanList}
  title="Pengaduan Terbaru"
/>
```

**Props:**
- `activities`: Array objek pengaduan
- `title`: (Optional) Judul section

## 🎯 Routing

Dashboard menggunakan routing otomatis berdasarkan role:

- **Admin** → `/dashboard/admin`
- **Bidang** → `/dashboard/bidang`
- **User** → `/dashboard` (dashboard user biasa)

Routing dilakukan di `/app/dashboard/page.tsx`:

```tsx
if (user.role === 'admin') {
  router.push('/dashboard/admin')
} else if (user.role === 'bidang') {
  router.push('/dashboard/bidang')
}
```

## 🎨 Styling

Dashboard menggunakan:
- **Tailwind CSS** untuk styling
- **Framer Motion** untuk animasi
- **Lucide React** untuk ikon
- **Responsive Design** untuk mobile, tablet, dan desktop

### Color Scheme
- **Blue**: Primary actions, total statistics
- **Green**: Success, completed items
- **Yellow**: Pending, in-progress
- **Red**: Errors, rejected items
- **Purple**: Bidang-specific features
- **Indigo**: Secondary actions

## 📱 Responsive Design

Dashboard fully responsive dengan breakpoints:
- **Mobile**: < 768px (1 column)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (3-4 columns)

## 🔄 Data Loading

Dashboard menggunakan:
1. **AuthContext** untuk autentikasi
2. **API Routes** untuk fetch data (`/api/pengaduan`)
3. **LocalStorage** untuk data disposisi
4. **Auto-refresh** saat window focus

## 🚀 Usage

### Mengakses Dashboard
1. Login sebagai admin atau bidang
2. Otomatis redirect ke dashboard sesuai role
3. Data dimuat secara otomatis

### Refresh Data
- Klik tombol refresh di header
- Data akan dimuat ulang dari API
- Toast notification untuk konfirmasi

### Navigation
- Gunakan quick actions untuk navigasi cepat
- Klik pengaduan di recent activity untuk detail
- Profile dropdown untuk settings dan logout

## 🔧 Customization

### Menambah Statistik Baru
Edit file dashboard dan tambahkan StatCard:

```tsx
<StatCard
  title="Custom Stat"
  value={customValue}
  icon={CustomIcon}
  color="purple"
/>
```

### Menambah Chart
Gunakan ChartCard sebagai wrapper:

```tsx
<ChartCard title="Custom Chart">
  {/* Your chart component */}
</ChartCard>
```

### Mengubah Warna
Edit `colorClasses` di komponen atau gunakan Tailwind classes.

## 📊 Data Structure

### Pengaduan Interface
```typescript
interface Pengaduan {
  id: string
  kode_pengaduan: string
  judul_pengaduan: string
  isi_pengaduan: string
  kategori: string
  status: string
  nama_pelapor: string
  created_at: string
}
```

### Stats Interface
```typescript
interface Stats {
  total: number
  diterima: number
  diproses: number
  selesai: number
  ditolak?: number
}
```

## 🎯 Best Practices

1. **Performance**: Gunakan React.memo untuk komponen yang tidak sering berubah
2. **Loading States**: Tampilkan loading indicator saat fetch data
3. **Error Handling**: Gunakan try-catch dan toast untuk error messages
4. **Accessibility**: Gunakan semantic HTML dan ARIA labels
5. **Mobile First**: Design untuk mobile terlebih dahulu

## 📝 Notes

- Dashboard menggunakan client-side rendering (`'use client'`)
- Data disimpan di state lokal dan localStorage
- Animasi menggunakan Framer Motion untuk smooth transitions
- Icons dari Lucide React untuk konsistensi

## 🔐 Security

- Authentication check di setiap dashboard
- Role-based access control
- Redirect ke login jika tidak authenticated
- Token validation via AuthContext

---

**Created with ❤️ for SIPELAN - Sistem Pengaduan Layanan Online Naker**
