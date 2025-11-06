# Troubleshooting: Pengaduan Tidak Muncul di Bidang

## 🔍 Diagnosis Masalah

### Gejala
- Admin sudah disposisi pengaduan ke bidang
- User bidang login tapi pengaduan tidak muncul di dashboard
- Timeline hanya menunjukkan 1 entry

### Root Causes yang Mungkin

1. ❌ **Bidang_id tidak ter-set** di tabel pengaduan
2. ❌ **User tidak punya bidang_id** di profil
3. ❌ **Status tidak berubah** ke "terdisposisi"
4. ❌ **Timeline tidak ter-record** di pengaduan_status
5. ❌ **API filter salah**

## 📋 Step-by-Step Diagnosis

### Step 1: Cek Data Pengaduan

**Jalankan SQL di Supabase SQL Editor:**

```sql
-- Cek pengaduan terakhir
SELECT 
    kode_pengaduan,
    judul_pengaduan,
    status,
    bidang_id,
    created_at,
    updated_at
FROM pengaduan
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Result:**
```
kode_pengaduan | status        | bidang_id
ADU-2025-0001  | terdisposisi  | 1
```

**Jika bidang_id = NULL** → Disposisi gagal!

### Step 2: Cek User Bidang

```sql
-- Cek user bidang
SELECT 
    email,
    nama_lengkap,
    role,
    bidang_id
FROM users
WHERE role = 'bidang';
```

**Expected Result:**
```
email              | role   | bidang_id
hi@example.com     | bidang | 1
lattas@example.com | bidang | 2
```

**Jika bidang_id = NULL** → User belum di-assign!

### Step 3: Cek Disposisi History

```sql
-- Cek disposisi
SELECT 
    d.*,
    p.kode_pengaduan,
    b.nama_bidang
FROM disposisi d
LEFT JOIN pengaduan p ON d.pengaduan_id = p.id
LEFT JOIN bidang b ON d.ke_bidang_id = b.id
ORDER BY d.created_at DESC
LIMIT 5;
```

**Expected Result:**
```
pengaduan_id | ke_bidang_id | nama_bidang
uuid-123     | 1            | Bidang Hubungan Industrial
```

**Jika tidak ada data** → Disposisi API gagal!

### Step 4: Cek Timeline

```sql
-- Cek timeline (ganti kode pengaduan)
SELECT 
    ps.status,
    ps.keterangan,
    ps.created_at
FROM pengaduan_status ps
LEFT JOIN pengaduan p ON ps.pengaduan_id = p.id
WHERE p.kode_pengaduan = 'ADU-2025-0001'  -- GANTI
ORDER BY ps.created_at ASC;
```

**Expected Timeline:**
```
status          | keterangan
masuk           | Pengaduan baru masuk
terdisposisi    | Pengaduan didisposisikan ke Bidang HI
```

**Jika hanya 1 entry** → Status history tidak ter-insert!

### Step 5: Cek API Call

**Buka browser console saat di /bidang page:**

```javascript
// Check API call
Network tab → Filter: pengaduan

// Should see:
GET /api/pengaduan?bidang_id=1&limit=100

// Response should contain pengaduan array
```

## 🔧 Solusi per Root Cause

### Solusi 1: Fix Bidang_id di Pengaduan

**Jika bidang_id = NULL setelah disposisi:**

```sql
-- Update manual (ganti dengan data Anda)
UPDATE pengaduan 
SET 
    bidang_id = 1,  -- ID bidang tujuan
    status = 'terdisposisi',
    updated_at = NOW()
WHERE kode_pengaduan = 'ADU-2025-0001';  -- Kode pengaduan

-- Verify
SELECT kode_pengaduan, status, bidang_id 
FROM pengaduan 
WHERE kode_pengaduan = 'ADU-2025-0001';
```

### Solusi 2: Fix User Bidang_id

**Jika user tidak punya bidang_id:**

```sql
-- Set bidang_id untuk user (ganti dengan data Anda)
UPDATE users 
SET bidang_id = 1  -- ID bidang
WHERE email = 'hi@example.com';  -- Email user bidang

-- Verify
SELECT email, role, bidang_id FROM users WHERE email = 'hi@example.com';
```

**Refresh browser setelah update!**

### Solusi 3: Fix Timeline

**Jika timeline kosong atau tidak lengkap:**

```sql
-- Insert status awal (masuk)
INSERT INTO pengaduan_status (pengaduan_id, status, keterangan, created_at)
SELECT 
    id,
    'masuk',
    'Pengaduan baru masuk',
    created_at
FROM pengaduan
WHERE kode_pengaduan = 'ADU-2025-0001'  -- GANTI
AND NOT EXISTS (
    SELECT 1 FROM pengaduan_status ps 
    WHERE ps.pengaduan_id = pengaduan.id 
    AND ps.status = 'masuk'
);

-- Insert status disposisi
INSERT INTO pengaduan_status (pengaduan_id, status, keterangan, created_at)
SELECT 
    p.id,
    'terdisposisi',
    CONCAT('Pengaduan didisposisikan ke ', b.nama_bidang),
    p.updated_at
FROM pengaduan p
LEFT JOIN bidang b ON p.bidang_id = b.id
WHERE p.kode_pengaduan = 'ADU-2025-0001'  -- GANTI
AND NOT EXISTS (
    SELECT 1 FROM pengaduan_status ps 
    WHERE ps.pengaduan_id = p.id 
    AND ps.status = 'terdisposisi'
);

-- Verify timeline
SELECT ps.*, p.kode_pengaduan
FROM pengaduan_status ps
LEFT JOIN pengaduan p ON ps.pengaduan_id = p.id
WHERE p.kode_pengaduan = 'ADU-2025-0001'  -- GANTI
ORDER BY ps.created_at;
```

### Solusi 4: Fix Disposisi Record

**Jika disposisi tidak ada di tabel:**

```sql
-- Insert disposisi manual
INSERT INTO disposisi (
    pengaduan_id, 
    dari_bidang_id, 
    ke_bidang_id, 
    keterangan,
    created_at
)
SELECT 
    id,
    NULL,  -- dari admin
    1,     -- ID bidang tujuan (GANTI)
    'Disposisi untuk tindak lanjut',
    updated_at
FROM pengaduan
WHERE kode_pengaduan = 'ADU-2025-0001'  -- GANTI
AND NOT EXISTS (
    SELECT 1 FROM disposisi d WHERE d.pengaduan_id = pengaduan.id
);

-- Verify
SELECT d.*, p.kode_pengaduan
FROM disposisi d
LEFT JOIN pengaduan p ON d.pengaduan_id = p.id
WHERE p.kode_pengaduan = 'ADU-2025-0001';  -- GANTI
```

## 🔄 Complete Fix Script

**Jika semua data bermasalah, jalankan script ini:**

```sql
-- === COMPLETE FIX SCRIPT ===
-- Ganti nilai yang ditandai dengan GANTI

-- Variables
-- KODE_PENGADUAN: 'ADU-2025-0001'
-- BIDANG_ID: 1 (HI), 2 (LATTAS), 3 (PTPK), dst
-- USER_EMAIL: email user bidang

-- 1. Fix pengaduan
UPDATE pengaduan 
SET 
    bidang_id = 1,  -- GANTI
    status = 'terdisposisi',
    updated_at = NOW()
WHERE kode_pengaduan = 'ADU-2025-0001';  -- GANTI

-- 2. Insert timeline (status masuk)
INSERT INTO pengaduan_status (pengaduan_id, status, keterangan, created_at)
SELECT 
    id,
    'masuk',
    'Pengaduan baru masuk',
    created_at
FROM pengaduan
WHERE kode_pengaduan = 'ADU-2025-0001'  -- GANTI
ON CONFLICT DO NOTHING;

-- 3. Insert timeline (status terdisposisi)
INSERT INTO pengaduan_status (pengaduan_id, status, keterangan, created_at)
SELECT 
    p.id,
    'terdisposisi',
    CONCAT('Pengaduan didisposisikan ke ', b.nama_bidang),
    NOW()
FROM pengaduan p
LEFT JOIN bidang b ON p.bidang_id = b.id
WHERE p.kode_pengaduan = 'ADU-2025-0001';  -- GANTI

-- 4. Insert disposisi
INSERT INTO disposisi (pengaduan_id, dari_bidang_id, ke_bidang_id, keterangan, created_at)
SELECT 
    id,
    NULL,
    1,  -- GANTI
    'Disposisi untuk tindak lanjut',
    NOW()
FROM pengaduan
WHERE kode_pengaduan = 'ADU-2025-0001';  -- GANTI

-- 5. Fix user bidang_id
UPDATE users 
SET bidang_id = 1  -- GANTI
WHERE email = 'hi@example.com';  -- GANTI

-- VERIFY ALL
SELECT 
    p.kode_pengaduan,
    p.status,
    p.bidang_id,
    b.nama_bidang,
    (SELECT COUNT(*) FROM pengaduan_status ps WHERE ps.pengaduan_id = p.id) as timeline_count,
    (SELECT COUNT(*) FROM disposisi d WHERE d.pengaduan_id = p.id) as disposisi_count
FROM pengaduan p
LEFT JOIN bidang b ON p.bidang_id = b.id
WHERE p.kode_pengaduan = 'ADU-2025-0001';  -- GANTI

-- Should return:
-- timeline_count: >= 2
-- disposisi_count: >= 1
-- bidang_id: NOT NULL
-- status: terdisposisi
```

## 🧪 Testing After Fix

### 1. Refresh Bidang Page

```bash
# Clear browser cache
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)

# Or hard refresh
Close tab → Open new tab → Navigate to /bidang
```

### 2. Check Console

**Browser console should show:**
```
=== LOAD PENGADUAN FOR BIDANG ===
Bidang ID: 1
📊 Total pengaduan from DB: 1
✅ Pengaduan loaded successfully
```

### 3. Check Network Tab

**API call:**
```
GET /api/pengaduan?bidang_id=1&limit=100

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "kode_pengaduan": "ADU-2025-0001",
      "bidang_id": 1,
      "status": "terdisposisi",
      ...
    }
  ]
}
```

### 4. Check Timeline

**Navigate to /tracking:**
```
Enter code: ADU-2025-0001

Timeline should show:
✓ Pengaduan Masuk (date 1)
✓ Pengaduan Terdisposisi (date 2)
```

## 📊 Diagnosis Commands

**Copy-paste ke Supabase SQL Editor untuk quick diagnosis:**

```sql
-- Quick Diagnosis Script
WITH pengaduan_check AS (
    SELECT 
        p.id,
        p.kode_pengaduan,
        p.status,
        p.bidang_id,
        b.nama_bidang,
        (SELECT COUNT(*) FROM pengaduan_status ps WHERE ps.pengaduan_id = p.id) as timeline_count,
        (SELECT COUNT(*) FROM disposisi d WHERE d.pengaduan_id = p.id) as disposisi_count
    FROM pengaduan p
    LEFT JOIN bidang b ON p.bidang_id = b.id
    WHERE p.created_at > NOW() - INTERVAL '7 days'  -- Last 7 days
    ORDER BY p.created_at DESC
    LIMIT 10
)
SELECT 
    *,
    CASE 
        WHEN bidang_id IS NULL THEN '❌ Belum didisposisi'
        WHEN timeline_count < 2 THEN '⚠️ Timeline tidak lengkap'
        WHEN disposisi_count = 0 THEN '⚠️ Disposisi record missing'
        ELSE '✅ OK'
    END as diagnosis
FROM pengaduan_check;
```

## 🎯 Prevention

**Untuk mencegah masalah ini di masa depan:**

### 1. Pastikan Disposisi API Bekerja

File: `app/api/disposisi/route.ts`

Sudah melakukan 3 hal:
1. ✅ Insert ke tabel `disposisi`
2. ✅ Update `pengaduan.bidang_id` dan `status`
3. ✅ Insert ke `pengaduan_status` (timeline)

### 2. Set User Bidang_id Saat Register

```sql
-- Saat create user bidang, set bidang_id
INSERT INTO users (email, nama_lengkap, role, bidang_id)
VALUES ('hi@example.com', 'User HI', 'bidang', 1);
```

### 3. Validate Sebelum Disposisi

Di admin page, pastikan:
- Bidang dipilih (tidak NULL)
- Keterangan diisi
- Pengaduan ID valid

### 4. Monitor Console Logs

Console akan show error jika ada masalah:
```
❌ Disposisi error: [error message]
```

## 📞 Quick Reference

### Bidang IDs
```
1 = Bidang Hubungan Industrial (HI)
2 = Bidang Latihan Kerja dan Produktivitas (LATTAS)
3 = Bidang PTPK
4 = UPTD BLK Pati
5 = Sekretariat
```

### Status Flow
```
masuk → terdisposisi → tindak_lanjut → selesai
```

### Files to Check
- `/app/api/disposisi/route.ts` - Disposisi API
- `/app/api/pengaduan/route.ts` - Get pengaduan dengan filter
- `/app/bidang/page.tsx` - Bidang dashboard
- `/app/admin/page.tsx` - Admin disposisi

## ✅ Checklist Verifikasi

Setelah fix, pastikan:

- [ ] `pengaduan.bidang_id` ter-set (tidak NULL)
- [ ] `pengaduan.status` = "terdisposisi"
- [ ] Ada record di tabel `disposisi`
- [ ] Ada minimal 2 timeline di `pengaduan_status`
- [ ] `users.bidang_id` ter-set untuk user bidang
- [ ] Pengaduan muncul di dashboard bidang
- [ ] Timeline lengkap di tracking page
- [ ] Console tidak ada error

**Jika semua ✓, sistem berfungsi dengan baik!**
