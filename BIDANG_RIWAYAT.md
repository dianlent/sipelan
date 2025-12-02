# 📊 Riwayat Pengaduan Bidang - Complete Guide

## ✅ Fitur Baru

Halaman Bidang sekarang menampilkan **riwayat pengaduan yang sesuai dengan disposisi bidang masing-masing** dengan statistik lengkap!

---

## 🎯 Yang Diimplementasikan

### 1. **Filter Otomatis Berdasarkan Bidang**

✅ **Hanya menampilkan pengaduan yang didisposisikan ke bidang user**
```typescript
const apiUrl = `/api/pengaduan?bidang_id=${bidangId}&limit=100`
```

✅ **Filter status: terdisposisi, tindak_lanjut, selesai**
```sql
.eq('bidang_id', bidangIdInt)
.in('status', ['terdisposisi', 'tindak_lanjut', 'selesai'])
```

### 2. **Statistik Cards**

✅ **4 Cards dengan data real-time:**

| Card | Warna | Icon | Data |
|------|-------|------|------|
| **Total Pengaduan** | Biru | 📄 | Semua pengaduan bidang |
| **Terdisposisi** | Kuning | ⏰ | Status: terdisposisi |
| **Tindak Lanjut** | Ungu | ⚠️ | Status: tindak_lanjut |
| **Selesai** | Hijau | ✅ | Status: selesai |

### 3. **Header yang Jelas**

```
Riwayat Pengaduan Bidang
Pengaduan yang didisposisikan ke bidang HI
```

---

## 🔄 Flow Sistem

```
Admin disposisi pengaduan → Bidang HI
    ↓
Pengaduan masuk ke database dengan bidang_id
    ↓
User Bidang HI login
    ↓
Halaman Bidang load pengaduan WHERE bidang_id = user.bidang_id
    ↓
Tampilkan statistik + list pengaduan
    ↓
User Bidang proses pengaduan
    ↓
Update status: terdisposisi → tindak_lanjut → selesai
```

---

## 📊 UI Preview

### **Statistics Cards**

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ 📄 Total        │ ⏰ Terdisposisi │ ⚠️ Tindak Lanjut│ ✅ Selesai      │
│    15           │    5            │    7            │    3            │
│ Total Pengaduan │ Terdisposisi    │ Tindak Lanjut   │ Selesai         │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### **Pengaduan List**

```
┌────────────────────────────────────────────────────────────┐
│ ADU-2025-0001  [Terdisposisi]                              │
│ Upah tidak dibayar                                         │
│ Kami kerja namun gak diberikan upah yang layak            │
│ 👤 dian  📅 1 Desember 2025                    [Proses]   │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ ADU-2025-0002  [Selesai]                                   │
│ Upah tidak dibayar                                         │
│ Kami kerja namun gak diberikan upah yang layak            │
│ 👤 dian  📅 1 Desember 2025                    [Selesai]  │
└────────────────────────────────────────────────────────────┘
```

---

## 🔍 Filter Logic

### **Backend API** (`app/api/pengaduan/route.ts`)

```typescript
if (bidang_id) {
  const bidangIdInt = parseInt(bidang_id)
  
  // Filter by bidang_id and only show disposed pengaduan
  query = query
    .eq('bidang_id', bidangIdInt)
    .in('status', ['terdisposisi', 'tindak_lanjut', 'selesai'])
}
```

### **Frontend** (`app/bidang/page.tsx`)

```typescript
// Load pengaduan for specific bidang
const loadPengaduan = async (bidangId: number) => {
  const apiUrl = `/api/pengaduan?bidang_id=${bidangId}&limit=100`
  const response = await fetch(apiUrl)
  // ... process data
}

// Calculate statistics
const stats = {
  total: pengaduanList.length,
  terdisposisi: pengaduanList.filter(p => p.status === 'terdisposisi').length,
  tindak_lanjut: pengaduanList.filter(p => p.status === 'tindak_lanjut').length,
  selesai: pengaduanList.filter(p => p.status === 'selesai').length
}
```

---

## 📋 Status Flow

```
Pengaduan baru (Admin)
    ↓
[diajukan] → Admin review
    ↓
[terdisposisi] → Dikirim ke Bidang ✅ (Muncul di halaman Bidang)
    ↓
[tindak_lanjut] → Bidang sedang proses ✅ (Muncul di halaman Bidang)
    ↓
[selesai] → Bidang selesai proses ✅ (Muncul di halaman Bidang)
```

**Status yang TIDAK muncul di halaman Bidang:**
- ❌ `diajukan` (belum disposisi)
- ❌ `ditolak` (tidak perlu ditindaklanjuti)

---

## 🎨 UI Components

### **Statistics Card Component**

```jsx
<div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
  <div className="flex items-center justify-between mb-2">
    <FileText className="w-8 h-8 opacity-80" />
    <span className="text-3xl font-bold">{stats.total}</span>
  </div>
  <p className="text-blue-100 text-sm font-medium">Total Pengaduan</p>
</div>
```

### **Pengaduan Card Component**

```jsx
<div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-purple-200 transition-all">
  <div className="flex items-center space-x-3 mb-2">
    <span className="text-sm font-mono font-semibold text-primary-600">
      {pengaduan.kode_pengaduan}
    </span>
    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold">
      {getStatusIcon(pengaduan.status)}
      <span className="capitalize">{pengaduan.status}</span>
    </span>
  </div>
  <h3 className="text-lg font-bold text-gray-900 mb-2">
    {pengaduan.judul_pengaduan}
  </h3>
  <p className="text-gray-600 mb-3 line-clamp-2">{pengaduan.isi_pengaduan}</p>
  {/* ... */}
</div>
```

---

## 🔧 Database Schema

### **Table: pengaduan**

```sql
CREATE TABLE pengaduan (
  id UUID PRIMARY KEY,
  kode_pengaduan VARCHAR(50) UNIQUE,
  judul_pengaduan TEXT,
  isi_pengaduan TEXT,
  status VARCHAR(50),
  bidang_id INTEGER REFERENCES bidang(id), -- ✅ Filter key
  kategori_id INTEGER REFERENCES kategori_pengaduan(id),
  nama_pelapor VARCHAR(255),
  email_pelapor VARCHAR(255),
  anonim BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Table: users (Bidang)**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(255),
  role VARCHAR(20), -- 'bidang'
  bidang_id INTEGER REFERENCES bidang(id), -- ✅ User's bidang
  kode_bidang VARCHAR(10), -- 'HI', 'HK', etc.
  nama_lengkap VARCHAR(255)
);
```

---

## 🚀 Testing

### 1. **Test sebagai Bidang HI**

```bash
# Login sebagai bidang_hi
Email: hi@disnaker.go.id
Password: bidang123

# Expected:
- ✅ Melihat statistik cards
- ✅ Hanya pengaduan dengan bidang_id = HI
- ✅ Status: terdisposisi, tindak_lanjut, selesai
```

### 2. **Test Filter**

```sql
-- Check pengaduan for Bidang HI
SELECT 
  kode_pengaduan,
  judul_pengaduan,
  status,
  bidang_id
FROM pengaduan
WHERE bidang_id = (SELECT id FROM bidang WHERE kode_bidang = 'HI')
AND status IN ('terdisposisi', 'tindak_lanjut', 'selesai');
```

### 3. **Test Statistics**

```
Total = Terdisposisi + Tindak Lanjut + Selesai
```

---

## 🐛 Troubleshooting

### Tidak ada pengaduan muncul

**Check:**
```sql
-- 1. User punya bidang_id?
SELECT id, username, bidang_id, kode_bidang FROM users WHERE email = 'hi@disnaker.go.id';

-- 2. Ada pengaduan untuk bidang ini?
SELECT COUNT(*) FROM pengaduan WHERE bidang_id = (SELECT bidang_id FROM users WHERE email = 'hi@disnaker.go.id');

-- 3. Status pengaduan sudah terdisposisi?
SELECT status, COUNT(*) FROM pengaduan 
WHERE bidang_id = (SELECT bidang_id FROM users WHERE email = 'hi@disnaker.go.id')
GROUP BY status;
```

### Statistik tidak akurat

**Solution:**
1. Refresh halaman
2. Check console logs
3. Verify data di database

### User bidang tidak punya bidang_id

**Solution:**
```sql
-- Update user dengan bidang_id
UPDATE users 
SET bidang_id = (SELECT id FROM bidang WHERE kode_bidang = 'HI')
WHERE username = 'bidang_hi';
```

---

## 📊 Benefits

| Feature | Before | After |
|---------|--------|-------|
| **Filter** | ❌ Manual | ✅ Auto by bidang_id |
| **Statistics** | ❌ None | ✅ 4 cards real-time |
| **Header** | ❌ Generic | ✅ Specific to bidang |
| **Status Filter** | ❌ All status | ✅ Only disposed |
| **User Experience** | ❌ Confusing | ✅ Clear & organized |

---

## ✅ Summary

**Halaman Bidang sekarang:**

1. ✅ **Hanya menampilkan pengaduan bidang masing-masing**
2. ✅ **Statistik real-time** (Total, Terdisposisi, Tindak Lanjut, Selesai)
3. ✅ **Header yang jelas** dengan nama bidang
4. ✅ **Filter otomatis** berdasarkan `bidang_id`
5. ✅ **Status filter** (hanya disposed pengaduan)
6. ✅ **UI modern** dengan cards dan animations

**Setiap bidang hanya melihat pengaduan mereka sendiri!** 🎯📊
