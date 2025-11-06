# Sistem Disposisi Pengaduan: Admin → Bidang

## 📋 Overview

Sistem disposisi memungkinkan Admin untuk mengirimkan pengaduan ke bidang/unit kerja yang sesuai. Pengaduan yang telah didisposisikan akan muncul di dashboard bidang tujuan.

## 🔄 Flow Lengkap

```
1. Masyarakat Submit Pengaduan
   └─> POST /api/pengaduan
       └─> Simpan ke database dengan status "masuk"
       └─> Generate kode tracking: ADU-2025-0001
       └─> bidang_id: NULL (belum didisposisi)

2. Admin Login & Lihat Pengaduan
   └─> GET /api/pengaduan
       └─> Tampil semua pengaduan
       └─> Filter: "Perlu Disposisi" (status: masuk, terverifikasi)

3. Admin Disposisi Pengaduan
   └─> Klik "Disposisi" pada pengaduan
   └─> Pilih bidang tujuan
   └─> Isi keterangan disposisi
   └─> POST /api/disposisi
       ├─> Insert ke tabel disposisi (history)
       ├─> Update pengaduan.bidang_id = [bidang_id]
       ├─> Update pengaduan.status = "terdisposisi"
       └─> Insert ke pengaduan_status (timeline)

4. Pengaduan Muncul di Dashboard Bidang
   └─> Bidang user login
   └─> GET /api/pengaduan?bidang_id={user.bidang_id}
       └─> Tampil pengaduan yang didisposisikan ke bidang tersebut
       └─> Bidang bisa update status & beri tanggapan
```

## 📊 Database Schema

### Tabel: pengaduan
```sql
CREATE TABLE pengaduan (
    id UUID PRIMARY KEY,
    kode_pengaduan VARCHAR(20) UNIQUE,
    bidang_id INTEGER REFERENCES bidang(id), -- Set saat disposisi
    status VARCHAR(20), -- masuk → terdisposisi → tindak_lanjut → selesai
    ...
)
```

### Tabel: disposisi (History)
```sql
CREATE TABLE disposisi (
    id SERIAL PRIMARY KEY,
    pengaduan_id UUID REFERENCES pengaduan(id),
    dari_bidang_id INTEGER REFERENCES bidang(id), -- NULL jika dari admin
    ke_bidang_id INTEGER REFERENCES bidang(id),   -- Bidang tujuan
    keterangan TEXT,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP
)
```

### Tabel: pengaduan_status (Timeline)
```sql
CREATE TABLE pengaduan_status (
    id SERIAL PRIMARY KEY,
    pengaduan_id UUID REFERENCES pengaduan(id),
    status VARCHAR(20),
    keterangan TEXT,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP
)
```

### Tabel: bidang
```sql
CREATE TABLE bidang (
    id SERIAL PRIMARY KEY,
    nama_bidang VARCHAR(100),
    kode_bidang VARCHAR(20) UNIQUE,
    email_bidang VARCHAR(255)
)

-- Data Bidang
INSERT INTO bidang VALUES
(1, 'Bidang Hubungan Industrial', 'HI', 'hi@disnaker.go.id'),
(2, 'Bidang Latihan Kerja dan Produktivitas', 'LATTAS', 'lattas@disnaker.go.id'),
(3, 'Bidang PTPK', 'PTPK', 'ptpk@disnaker.go.id'),
(4, 'UPTD BLK Pati', 'BLK', 'blkpati@disnaker.go.id'),
(5, 'Sekretariat', 'SEKRETARIAT', 'sekretariat@disnaker.go.id');
```

## 🔌 API Endpoints

### POST /api/disposisi
**Disposisi pengaduan ke bidang**

Request:
```json
{
  "pengaduan_id": "uuid-pengaduan",
  "dari_bidang_id": null,  // NULL jika dari admin
  "ke_bidang_id": 1,        // ID bidang tujuan
  "keterangan": "Mohon ditindaklanjuti sesuai ketentuan",
  "user_id": "uuid-admin"
}
```

Response:
```json
{
  "success": true,
  "message": "Pengaduan berhasil didisposisikan ke Bidang Hubungan Industrial",
  "data": {
    "disposisi": {...},
    "pengaduan": {...}
  }
}
```

### GET /api/pengaduan?bidang_id={id}
**Get pengaduan by bidang**

Request:
```
GET /api/pengaduan?bidang_id=1&limit=100
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "kode_pengaduan": "ADU-2025-0001",
      "bidang_id": 1,
      "status": "terdisposisi",
      "bidang": {
        "id": 1,
        "nama_bidang": "Bidang Hubungan Industrial",
        "kode_bidang": "HI"
      },
      ...
    }
  ]
}
```

### GET /api/disposisi?pengaduan_id={id}
**Get disposisi history**

Request:
```
GET /api/disposisi?pengaduan_id=uuid-pengaduan
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "pengaduan_id": "uuid",
      "dari_bidang": null,
      "ke_bidang": {
        "id": 1,
        "nama_bidang": "Bidang Hubungan Industrial"
      },
      "keterangan": "Mohon ditindaklanjuti",
      "created_at": "2025-11-06T04:30:00Z"
    }
  ]
}
```

## 💻 Kode Implementation

### Admin Page - Disposisi Function
```typescript
const handleDisposisi = async () => {
  const response = await fetch('/api/disposisi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pengaduan_id: selectedPengaduan.id,
      dari_bidang_id: null,
      ke_bidang_id: parseInt(bidangId),
      keterangan: keterangan,
      user_id: user?.id
    })
  })
  
  const result = await response.json()
  
  if (result.success) {
    toast.success('Pengaduan berhasil didisposisikan')
    await loadPengaduan() // Reload data
  }
}
```

### Bidang Page - Load Pengaduan
```typescript
const loadPengaduan = async (bidangId: number) => {
  const response = await fetch(`/api/pengaduan?bidang_id=${bidangId}`)
  const result = await response.json()
  
  setPengaduanList(result.data) // Tampilkan di UI
}
```

## 🧪 Testing Guide

### Test 1: Submit Pengaduan (Public)
```
1. Buka /pengaduan
2. Isi form dan submit
3. Catat kode tracking: ADU-2025-0001
4. Check database:
   - tabel pengaduan: status = "masuk", bidang_id = NULL
```

### Test 2: Disposisi oleh Admin
```
1. Login sebagai admin (role: admin)
2. Buka /admin
3. Cari pengaduan yang baru dibuat
4. Klik "Disposisi"
5. Pilih: "Bidang Hubungan Industrial"
6. Keterangan: "Mohon ditindaklanjuti segera"
7. Klik "Disposisi"
8. Check database:
   - pengaduan: bidang_id = 1, status = "terdisposisi"
   - disposisi: ada record baru
   - pengaduan_status: ada record "terdisposisi"
```

### Test 3: Lihat di Bidang Dashboard
```
1. Login sebagai user bidang HI (role: bidang, bidang_id: 1)
2. Buka /bidang
3. Pengaduan ADU-2025-0001 muncul di list
4. Klik "Lihat Detail"
5. Update status ke "Tindak Lanjut"
6. Beri tanggapan dan mark "Selesai"
```

### Test 4: Tracking oleh Pelapor
```
1. Buka /tracking
2. Masukkan kode: ADU-2025-0001
3. Lihat timeline lengkap:
   - Masuk (tanggal A)
   - Terdisposisi ke HI (tanggal B)
   - Tindak Lanjut (tanggal C)
   - Selesai (tanggal D)
```

## ✅ Checklist Fitur

- [x] Admin bisa lihat semua pengaduan
- [x] Admin bisa disposisi ke bidang tertentu
- [x] Disposisi tersimpan di tabel disposisi (history)
- [x] Pengaduan.bidang_id ter-update
- [x] Status berubah ke "terdisposisi"
- [x] Timeline status ter-record
- [x] Bidang bisa lihat pengaduan yang didisposisi ke mereka
- [x] Bidang bisa update status
- [x] Bidang bisa beri tanggapan
- [x] Pelapor bisa tracking dengan timeline lengkap

## 📝 Status Flow

```
masuk
  ↓ (admin verifikasi)
terverifikasi
  ↓ (admin disposisi)
terdisposisi → [pengaduan masuk ke dashboard bidang]
  ↓ (bidang proses)
tindak_lanjut
  ↓ (bidang selesai)
selesai → [email notification to pelapor]
```

## 🎯 Benefits

1. **Audit Trail Lengkap**: Semua disposisi ter-record dengan timestamp
2. **Accountability**: Jelas siapa disposisi kemana
3. **Visibility**: Bidang langsung lihat pengaduan mereka
4. **Tracking**: Pelapor bisa track progress real-time
5. **Reporting**: Data disposisi bisa dianalisis

## 🚨 Troubleshooting

### Pengaduan tidak muncul di bidang
- Check: apakah sudah didisposisikan? (bidang_id harus ter-set)
- Check: apakah user bidang memiliki bidang_id yang benar?
- Check: status pengaduan = "terdisposisi"
- Check API call: `/api/pengaduan?bidang_id={id}`

### Disposisi gagal
- Check: bidang ID valid (1-5)
- Check: pengaduan ID valid (UUID)
- Check: RLS policies di Supabase
- Check console untuk error details

### History disposisi tidak tersimpan
- Check: tabel disposisi ada
- Check: foreign key constraints benar
- Check API logs di console

## 📈 Next Features

- [ ] Multiple disposisi (forward ke bidang lain)
- [ ] Disposisi dengan deadline
- [ ] Notifikasi email saat disposisi
- [ ] Dashboard analytics disposisi
- [ ] Export report disposisi
- [ ] Auto-assign berdasarkan kategori
