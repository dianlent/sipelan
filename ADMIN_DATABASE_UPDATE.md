# Admin Page - Database Integration

## ✅ Perubahan yang Sudah Dilakukan

### 1. **Load Pengaduan dari Database**
Admin page sekarang fetch data pengaduan langsung dari database via API `/api/pengaduan`

**Sebelum:**
```typescript
// Load from localStorage
const allPengaduan = JSON.parse(localStorage.getItem('allPengaduan') || '{}')
```

**Sesudah:**
```typescript
// Fetch from API
const response = await fetch('/api/pengaduan?page=1&limit=100')
const result = await response.json()
```

### 2. **Update Status via API**
Update status pengaduan sekarang langsung ke database

**Endpoint:** `PUT /api/pengaduan/[id]/status`

**Fitur:**
- Update status di tabel `pengaduan`
- Insert history ke tabel `pengaduan_status`
- Kirim email notifikasi jika status = "selesai"

### 3. **Disposisi Pengaduan via API**
Disposisi pengaduan ke bidang sekarang update database

**Endpoint:** `PATCH /api/pengaduan/[id]`

**Update:**
- Set `bidang_id` di tabel pengaduan
- Set status menjadi "terdisposisi"
- Insert history status

### 4. **Auto Refresh Data**
- Auto refresh setiap 30 detik
- Manual refresh dengan tombol "Refresh"
- Menampilkan timestamp last refresh

### 5. **Dynamic Stats**
Stats di dashboard dihitung real-time dari data database:
- Total Pengaduan
- Perlu Disposisi
- Sedang Diproses
- Selesai

## 📋 API Endpoints yang Digunakan

### GET /api/pengaduan
```typescript
// Get all pengaduan with pagination
GET /api/pengaduan?page=1&limit=100

Response:
{
  success: true,
  data: [...],
  pagination: {
    page: 1,
    limit: 100,
    total: 50,
    totalPages: 1
  }
}
```

### PUT /api/pengaduan/[id]/status
```typescript
// Update status pengaduan
PUT /api/pengaduan/[id]/status
Body: {
  status: "terverifikasi" | "terdisposisi" | "tindak_lanjut" | "selesai"
}

Response:
{
  success: true,
  message: "Status berhasil diupdate",
  data: {...}
}
```

### PATCH /api/pengaduan/[id]
```typescript
// Update pengaduan (untuk disposisi)
PATCH /api/pengaduan/[id]
Body: {
  bidang_id: 1,
  status: "terdisposisi"
}

Response:
{
  success: true,
  message: "Pengaduan berhasil diupdate",
  data: {...}
}
```

## 🎯 Fitur yang Berfungsi

✅ Load pengaduan dari database secara dinamis
✅ Display stats real-time
✅ Update status pengaduan
✅ Disposisi pengaduan ke bidang
✅ Auto refresh setiap 30 detik
✅ Manual refresh dengan button
✅ Timestamp last refresh
✅ Filter dan sort pengaduan
✅ View detail pengaduan

## 🔄 Flow Data

```
1. Admin Page Load
   └─> Fetch /api/pengaduan
       └─> Supabase: SELECT * FROM pengaduan
           └─> Display di UI

2. Update Status
   └─> PUT /api/pengaduan/[id]/status
       └─> Supabase: UPDATE pengaduan SET status = ?
       └─> Supabase: INSERT INTO pengaduan_status
       └─> Send email (if selesai)
       └─> Reload data

3. Disposisi
   └─> PATCH /api/pengaduan/[id]
       └─> Supabase: UPDATE pengaduan SET bidang_id = ?
       └─> PUT /api/pengaduan/[id]/status (terdisposisi)
       └─> Reload data
```

## 📊 Data Structure

### Pengaduan Display Format
```typescript
interface Pengaduan {
  id: string                    // UUID from database
  kode_pengaduan: string        // ADU-YYYY-####
  judul_pengaduan: string
  kategori: string              // From kategori_pengaduan table
  status: string                // masuk, terverifikasi, etc.
  nama_pelapor: string          // From nama_pelapor or users table
  created_at: string            // ISO timestamp
  bidang?: string               // From bidang table
}
```

## 🚀 Testing

### 1. Test Load Data
```
1. Login sebagai admin
2. Buka /admin
3. Pastikan data pengaduan muncul dari database
4. Check console: "Total pengaduan from DB: X"
```

### 2. Test Update Status
```
1. Klik "Update Status" pada pengaduan
2. Pilih status baru
3. Klik "Update"
4. Pastikan status berubah di UI
5. Check di Supabase Table Editor
```

### 3. Test Disposisi
```
1. Klik "Disposisi" pada pengaduan
2. Pilih bidang tujuan
3. Isi keterangan
4. Klik "Disposisi"
5. Pastikan bidang ter-assign
6. Check di Supabase Table Editor
```

### 4. Test Auto Refresh
```
1. Buka admin page
2. Buka tab baru, submit pengaduan baru
3. Tunggu 30 detik
4. Data baru muncul otomatis di admin page
```

## ⚠️ Catatan Penting

1. **Migration SQL harus sudah dijalankan** - Pastikan trigger `generate_kode_pengaduan` sudah ada
2. **RLS Policies** - Pastikan policies sudah benar untuk admin access
3. **Authentication** - Admin page memerlukan login dengan role "admin"
4. **Auto Refresh** - Interval 30 detik, bisa diubah di `useEffect`

## 🔧 Troubleshooting

### Data tidak muncul
- Check console browser untuk error API
- Pastikan migration SQL sudah dijalankan
- Check RLS policies di Supabase
- Pastikan ada data di tabel pengaduan

### Update status gagal
- Check console untuk error message
- Pastikan pengaduan ID valid
- Check API endpoint di Network tab
- Verify user memiliki permission

### Auto refresh tidak jalan
- Check console untuk error
- Pastikan interval tidak di-clear
- Refresh manual dengan button "Refresh"

## 📝 Next Steps

- [ ] Add pagination untuk banyak data
- [ ] Add filter by status, kategori, bidang
- [ ] Add search by kode atau judul
- [ ] Add export to Excel/PDF
- [ ] Add bulk actions (update multiple)
- [ ] Add notification system
