# Dashboard Admin SIPELAN

## 📊 Fitur Dashboard

### 1. **Statistics Cards**
Menampilkan 4 metrik utama:
- **Total Pengaduan** - Total semua pengaduan dengan trend
- **Dalam Proses** - Pengaduan yang sedang ditangani
- **Selesai** - Pengaduan yang telah diselesaikan + rata-rata waktu
- **Tingkat Kepuasan** - Persentase kepuasan pengguna

### 2. **Chart Visualisasi**

#### Area Chart - Trend Pengaduan Bulanan
- **Tipe**: Area Chart dengan gradient
- **Data**: 10 bulan terakhir
- **Metrics**: Total pengaduan vs Selesai
- **Warna**: 
  - Biru (#3B82F6) - Total
  - Hijau (#10B981) - Selesai

#### Pie Chart - Distribusi Kategori
- **Tipe**: Pie Chart dengan label
- **Data**: 6 kategori utama
- **Kategori**:
  - Upah/Gaji (Biru)
  - PHK (Merah)
  - BPJS (Hijau)
  - Kontrak Kerja (Kuning)
  - Jam Kerja (Ungu)
  - Lainnya (Abu-abu)

#### Donut Chart - Status Pengaduan
- **Tipe**: Donut Chart
- **Data**: 4 status
- **Status**:
  - Selesai (Hijau)
  - Diproses (Biru)
  - Ditolak (Merah)
  - Pending (Kuning)

### 3. **Tabel Pengaduan Terbaru**
- Menampilkan 5 pengaduan terakhir
- Kolom: Nomor Tiket, Pelapor, Kategori, Tanggal, Status
- Animasi staggered untuk setiap row
- Hover effect pada row
- Badge berwarna untuk status

### 4. **Action Buttons**
- **Filter** - Filter data berdasarkan kriteria
- **Export Data** - Download data dalam format Excel/PDF

## 🎨 Design Features

### Color Scheme
```css
Primary: #3B82F6 (Blue)
Success: #10B981 (Green)
Warning: #F59E0B (Yellow)
Danger: #EF4444 (Red)
Purple: #8B5CF6
Gray: #6B7280
```

### Animations
- **Cards**: Fade in dengan stagger delay
- **Charts**: Smooth entrance
- **Table rows**: Staggered animation
- **Hover effects**: Scale dan shadow

### Responsive Design
- **Mobile**: Single column layout
- **Tablet**: 2 columns for charts
- **Desktop**: Full grid layout

## 📁 File Structure

```
src/app/admin/dashboard/
└── page.tsx (Dashboard utama)
```

## 🔧 Dependencies

```json
{
  "recharts": "^2.10.0",
  "framer-motion": "^10.16.0",
  "lucide-react": "^0.378.0"
}
```

## 📊 Mock Data Structure

### Stats Data
```typescript
{
  totalPengaduan: 1247,
  pending: 45,
  diproses: 89,
  selesai: 1058,
  ditolak: 55,
  pengaduanBulanIni: 127,
  rataRataWaktuSelesai: "4.2 hari",
  tingkatKepuasan: "87%"
}
```

### Monthly Trend Data
```typescript
[
  { bulan: "Jan", total: 85, selesai: 78, pending: 7 },
  { bulan: "Feb", total: 92, selesai: 85, pending: 7 },
  // ... 10 bulan
]
```

### Category Data
```typescript
[
  { name: "Upah/Gaji", value: 385, color: "#3B82F6" },
  { name: "PHK", value: 245, color: "#EF4444" },
  // ... 6 kategori
]
```

## 🚀 Cara Mengakses

**URL**: `http://localhost:3000/admin/dashboard`

## 🔄 Backend Integration

### API Endpoints yang Dibutuhkan

#### 1. Get Dashboard Stats
```typescript
GET /api/admin/stats

Response:
{
  totalPengaduan: number,
  pending: number,
  diproses: number,
  selesai: number,
  ditolak: number,
  pengaduanBulanIni: number,
  rataRataWaktuSelesai: string,
  tingkatKepuasan: string
}
```

#### 2. Get Monthly Trend
```typescript
GET /api/admin/trend?months=10

Response:
[
  {
    bulan: string,
    total: number,
    selesai: number,
    pending: number
  }
]
```

#### 3. Get Category Distribution
```typescript
GET /api/admin/categories

Response:
[
  {
    name: string,
    value: number,
    color: string
  }
]
```

#### 4. Get Recent Complaints
```typescript
GET /api/admin/complaints/recent?limit=5

Response:
[
  {
    id: string,
    nama: string,
    kategori: string,
    tanggal: string,
    status: string
  }
]
```

#### 5. Export Data
```typescript
POST /api/admin/export
Body: {
  format: "excel" | "pdf",
  dateRange: {
    start: string,
    end: string
  },
  filters: {
    status?: string,
    kategori?: string
  }
}

Response: File download
```

## 🎯 Fitur Tambahan (Future)

### Phase 2
- [ ] Real-time updates dengan WebSocket
- [ ] Advanced filtering (date range, status, kategori)
- [ ] Custom date range picker
- [ ] Comparison dengan periode sebelumnya
- [ ] Export ke Excel/PDF
- [ ] Print dashboard
- [ ] Email scheduled reports

### Phase 3
- [ ] Drill-down charts (klik untuk detail)
- [ ] Custom dashboard builder
- [ ] Widget customization
- [ ] Multiple dashboard views
- [ ] Role-based dashboards
- [ ] Mobile app version

## 📱 Responsive Breakpoints

```css
Mobile: < 768px
  - Single column
  - Stacked charts
  - Simplified table

Tablet: 768px - 1023px
  - 2 column grid
  - Side-by-side charts
  - Full table

Desktop: ≥ 1024px
  - Full grid layout
  - All charts visible
  - Optimized spacing
```

## 🎨 Chart Customization

### Mengubah Warna Chart

```typescript
// Area Chart
<Area
  type="monotone"
  dataKey="total"
  stroke="#YOUR_COLOR"
  fill="url(#colorTotal)"
/>

// Pie Chart
const categoryData = [
  { name: "Category", value: 100, color: "#YOUR_COLOR" },
];
```

### Mengubah Ukuran Chart

```typescript
<ResponsiveContainer width="100%" height={300}>
  {/* Change height value */}
</ResponsiveContainer>
```

## 🔒 Security & Access Control

### Authentication Required
```typescript
// Tambahkan middleware untuk protect route
import { getServerSession } from "next-auth";

export default async function AdminDashboard() {
  const session = await getServerSession();
  
  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }
  
  // Dashboard content
}
```

### Role-Based Access
```typescript
// Admin levels
- Super Admin: Full access
- Admin: View + Edit
- Petugas: View only
- Pimpinan: View only (read-only)
```

## 📊 Performance Optimization

### Data Caching
```typescript
// Cache dashboard data
export const revalidate = 300; // 5 minutes

// Or use SWR for client-side
import useSWR from 'swr';

const { data } = useSWR('/api/admin/stats', fetcher, {
  refreshInterval: 30000 // 30 seconds
});
```

### Lazy Loading Charts
```typescript
import dynamic from 'next/dynamic';

const AreaChart = dynamic(
  () => import('recharts').then(mod => mod.AreaChart),
  { ssr: false }
);
```

## 🧪 Testing

### Test Data Generation
```typescript
// Generate random data for testing
function generateMockData(months: number) {
  return Array.from({ length: months }, (_, i) => ({
    bulan: getMonthName(i),
    total: Math.floor(Math.random() * 50) + 80,
    selesai: Math.floor(Math.random() * 40) + 70,
    pending: Math.floor(Math.random() * 10) + 5,
  }));
}
```

## 📈 Analytics Tracking

### Track Dashboard Usage
```typescript
// Track which charts are viewed
useEffect(() => {
  analytics.track('Dashboard Viewed', {
    userId: user.id,
    timestamp: new Date(),
  });
}, []);

// Track filter usage
const handleFilter = (filters) => {
  analytics.track('Dashboard Filtered', {
    filters,
    timestamp: new Date(),
  });
};
```

## 🎓 Best Practices

### DO ✅
- Update data in real-time or near real-time
- Use consistent colors across charts
- Provide tooltips for all data points
- Make charts responsive
- Cache expensive calculations
- Show loading states
- Handle empty data gracefully

### DON'T ❌
- Overload with too many charts
- Use inconsistent color schemes
- Forget mobile optimization
- Ignore loading states
- Hard-code data
- Skip error handling
- Use too many animations

---

**Status**: ✅ **Dashboard Admin Complete!**  
**Version**: 1.0  
**Last Updated**: 27 Oktober 2024  
**Charts**: 3 types (Area, Pie, Donut)  
**Widgets**: 4 stat cards + 1 table
