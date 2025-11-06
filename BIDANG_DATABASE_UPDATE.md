# Bidang Page - Database Integration

## ✅ Perubahan yang Sudah Dilakukan

### 1. **Load Pengaduan Berdasarkan Bidang dari Database**
Bidang page sekarang fetch pengaduan yang didisposisikan ke bidang tersebut dari database.

**Sebelum:**
```typescript
// Load from localStorage
const allPengaduan = JSON.parse(localStorage.getItem('allPengaduan') || '{}')
const bidangPengaduan = Object.values(allPengaduan).filter(...)
```

**Sesudah:**
```typescript
// Fetch from API filtered by bidang_id
const response = await fetch(`/api/pengaduan?bidang_id=${bidangId}&limit=100`)
const pengaduanData = result.data
```

### 2. **Update Status via API**
Update status pengaduan sekarang langsung ke database.

**Endpoint:** `PUT /api/pengaduan/[id]/status`

### 3. **Submit Tanggapan via API**
Tanggapan pengaduan sekarang update status ke "selesai" via API.

### 4. **User Interface Update**
- Menampilkan bidang_id dari user login
- Filter pengaduan berdasarkan bidang_id
- Dynamic stats berdasarkan data bidang

## 📋 API Endpoints yang Digunakan

### GET /api/pengaduan?bidang_id={id}
```typescript
// Get pengaduan filtered by bidang_id
GET /api/pengaduan?bidang_id=1&limit=100

Response:
{
  success: true,
  data: [
    {
      id: "uuid",
      kode_pengaduan: "ADU-2025-0001",
      judul_pengaduan: "...",
      status: "terdisposisi",
      bidang_id: 1,
      bidang: {
        id: 1,
        nama_bidang: "Bidang Hubungan Industrial",
        kode_bidang: "HI"
      },
      ...
    }
  ],
  pagination: {...}
}
```

### PUT /api/pengaduan/[id]/status
```typescript
// Update status pengaduan
PUT /api/pengaduan/[id]/status
Body: {
  status: "tindak_lanjut" | "selesai"
}

Response:
{
  success: true,
  message: "Status berhasil diupdate",
  data: {...}
}
```

## 🎯 Fitur yang Berfungsi

✅ Load pengaduan yang didisposisikan ke bidang dari database
✅ Display stats real-time (Sedang Diproses, Selesai, Total)
✅ Update status pengaduan (tindak_lanjut, selesai)
✅ Submit tanggapan dan set status selesai
✅ Filter pengaduan by status
✅ View detail pengaduan
✅ Email notification otomatis saat selesai

## 🔄 Flow Data

```
1. Bidang User Login
   └─> Get user.bidang_id from AuthContext
       └─> Fetch /api/pengaduan?bidang_id={id}
           └─> Supabase: SELECT * FROM pengaduan WHERE bidang_id = ?
               └─> Display di UI

2. Update Status
   └─> PUT /api/pengaduan/[id]/status
       └─> Supabase: UPDATE pengaduan SET status = ?
       └─> Supabase: INSERT INTO pengaduan_status
       └─> Send email (if selesai)
       └─> Reload data

3. Submit Tanggapan
   └─> PUT /api/pengaduan/[id]/status (status: selesai)
       └─> Supabase: UPDATE pengaduan SET status = 'selesai'
       └─> Send email notification
       └─> Reload data
```

## 📊 Data Structure

### Pengaduan Display Format
```typescript
interface Pengaduan {
  id: string                    // UUID from database
  kode_pengaduan: string        // ADU-YYYY-####
  judul_pengaduan: string
  isi_pengaduan: string
  kategori: string              // From kategori_pengaduan table
  status: string                // terdisposisi, tindak_lanjut, selesai
  nama_pelapor: string          // From nama_pelapor or users table
  email_pelapor: string
  lokasi_kejadian?: string
  tanggal_kejadian?: string
  created_at: string
  disposisi_keterangan?: string
}
```

## 🚀 Testing

### 1. Test Load Data Bidang
```
1. Login sebagai user bidang (role: bidang)
2. Buka /bidang
3. Pastikan hanya pengaduan yang didisposisikan ke bidang tersebut yang muncul
4. Check console: "Total pengaduan from DB: X"
```

### 2. Test Update Status
```
1. Klik "Lihat Detail" pada pengaduan
2. Pilih status "Tindak Lanjut" atau "Selesai"
3. Klik "Update Status"
4. Pastikan status berubah di UI
5. Check di Supabase Table Editor
```

### 3. Test Submit Tanggapan
```
1. Klik "Beri Tanggapan" pada pengaduan
2. Isi tanggapan
3. Klik "Kirim"
4. Pastikan status berubah ke "Selesai"
5. Check email notification log di console
```

### 4. Test Filter by Status
```
1. Pilih filter status (Semua, Terdisposisi, Tindak Lanjut, Selesai)
2. Pastikan list pengaduan terfilter sesuai status
```

## ⚠️ Catatan Penting

1. **User harus memiliki bidang_id** - Pastikan user login memiliki bidang_id di database
2. **Disposisi dari Admin** - Pengaduan harus didisposisikan oleh admin dulu agar muncul di bidang
3. **Email Notification** - Saat status = "selesai", email otomatis terkirim ke pelapor
4. **RLS Policies** - Pastikan policies membolehkan bidang user akses pengaduan mereka

## 🔧 Troubleshooting

### Tidak ada pengaduan yang muncul
- Check apakah user memiliki bidang_id
- Check apakah ada pengaduan dengan bidang_id tersebut di database
- Check console untuk error API
- Pastikan admin sudah disposisi pengaduan ke bidang

### Update status gagal
- Check console untuk error message
- Pastikan pengaduan ID valid
- Check API endpoint di Network tab
- Verify user memiliki permission

### Email tidak terkirim
- Email notification masih dalam mode log (console)
- Untuk production, implement SMTP service
- Check email configuration di API route

## 📝 User Interface

### Stats Cards
- **Sedang Diproses**: Count pengaduan dengan status terdisposisi atau tindak_lanjut
- **Selesai**: Count pengaduan dengan status selesai
- **Total**: Total semua pengaduan di bidang

### Status Badge Colors
- **Terdisposisi**: Purple
- **Tindak Lanjut**: Yellow/Orange
- **Selesai**: Green

### Actions Available
- **Lihat Detail**: View full pengaduan details
- **Update Status**: Change status (tindak_lanjut, selesai)
- **Beri Tanggapan**: Submit response and mark as selesai

## 🎨 Next Steps

- [ ] Add tanggapan table to store responses
- [ ] Add file attachment for tanggapan
- [ ] Add history of status changes
- [ ] Add notification system for new disposisi
- [ ] Add export report feature
- [ ] Add statistics and charts
