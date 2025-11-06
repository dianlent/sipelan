# 🔧 Fix: Pengaduan Tidak Muncul di Bidang Dashboard

## 🔍 Diagnosis

Jalankan query berikut di Supabase SQL Editor untuk cek masalahnya:

### 1. Check Table Disposisi
```sql
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'disposisi'
ORDER BY ordinal_position;
```

**Expected:** Harus ada 7 columns (id, pengaduan_id, dari_bidang_id, ke_bidang_id, keterangan, user_id, created_at)

### 2. Check Pengaduan Data
```sql
SELECT 
    id,
    kode_pengaduan,
    judul_pengaduan,
    status,
    bidang_id,
    created_at
FROM pengaduan
ORDER BY created_at DESC
LIMIT 10;
```

**Check:**
- Ada pengaduan dengan `bidang_id` tidak NULL?
- Status pengaduan: `terdisposisi`, `tindak_lanjut`, atau `selesai`?

### 3. Check Disposisi Records
```sql
SELECT 
    d.id,
    d.pengaduan_id,
    p.kode_pengaduan,
    d.ke_bidang_id,
    b.nama_bidang,
    d.created_at
FROM disposisi d
JOIN pengaduan p ON d.pengaduan_id = p.id
LEFT JOIN bidang b ON d.ke_bidang_id = b.id
ORDER BY d.created_at DESC;
```

**Check:** Ada record disposisi?

### 4. Check User Bidang
```sql
SELECT 
    id,
    email,
    nama_lengkap,
    role,
    bidang_id,
    kode_bidang
FROM users
WHERE role = 'bidang';
```

**Check:** User bidang punya `bidang_id` yang benar?

---

## ✅ Solutions

### Solution 1: Table Disposisi Belum Ada

**Jika table disposisi tidak ada:**

```sql
-- Run MIGRATION.sql yang sudah updated
-- Atau run ini:

CREATE TABLE IF NOT EXISTS disposisi (
    id SERIAL PRIMARY KEY,
    pengaduan_id UUID REFERENCES pengaduan(id) ON DELETE CASCADE,
    dari_bidang_id INTEGER REFERENCES bidang(id) ON DELETE SET NULL,
    ke_bidang_id INTEGER REFERENCES bidang(id) ON DELETE SET NULL,
    keterangan TEXT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_disposisi_pengaduan_id ON disposisi(pengaduan_id);
CREATE INDEX IF NOT EXISTS idx_disposisi_ke_bidang_id ON disposisi(ke_bidang_id);

ALTER TABLE disposisi ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read disposisi" ON disposisi;
DROP POLICY IF EXISTS "Allow insert disposisi" ON disposisi;

CREATE POLICY "Allow read disposisi" ON disposisi FOR SELECT USING (true);
CREATE POLICY "Allow insert disposisi" ON disposisi FOR INSERT WITH CHECK (true);

GRANT ALL ON disposisi TO authenticated;
GRANT ALL ON disposisi TO anon;
GRANT USAGE, SELECT ON SEQUENCE disposisi_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE disposisi_id_seq TO anon;
```

### Solution 2: Belum Ada Pengaduan yang Didisposisi

**Test dengan disposisi manual:**

```sql
-- 1. Cari pengaduan yang sudah terverifikasi
SELECT id, kode_pengaduan, judul_pengaduan, status
FROM pengaduan
WHERE status = 'terverifikasi'
LIMIT 1;

-- 2. Disposisi pengaduan tersebut (ganti UUID dan bidang_id)
INSERT INTO disposisi (pengaduan_id, dari_bidang_id, ke_bidang_id, keterangan)
VALUES (
    'PASTE_PENGADUAN_ID_HERE',  -- Dari query di atas
    NULL,                         -- Dari admin
    1,                            -- Ke bidang_id (1=HI, 2=LATTAS, dst)
    'Test disposisi dari admin'
);

-- 3. Update pengaduan
UPDATE pengaduan
SET 
    bidang_id = 1,              -- Sesuaikan dengan ke_bidang_id di atas
    status = 'terdisposisi',
    updated_at = NOW()
WHERE id = 'PASTE_PENGADUAN_ID_HERE';

-- 4. Insert timeline
INSERT INTO pengaduan_status (pengaduan_id, status, keterangan)
VALUES (
    'PASTE_PENGADUAN_ID_HERE',
    'terdisposisi',
    'Pengaduan didisposisikan ke bidang untuk ditindaklanjuti'
);
```

### Solution 3: Pengaduan Ada Tapi Tidak Muncul

**Check dan fix bidang_id:**

```sql
-- Check pengaduan dengan bidang_id tertentu
SELECT 
    p.id,
    p.kode_pengaduan,
    p.status,
    p.bidang_id,
    b.nama_bidang
FROM pengaduan p
LEFT JOIN bidang b ON p.bidang_id = b.id
WHERE p.bidang_id = 1  -- Ganti dengan bidang_id user Anda
AND p.status IN ('terdisposisi', 'tindak_lanjut', 'selesai');
```

**Jika tidak ada hasil, fix dengan:**

```sql
-- Sync bidang_id dari disposisi
UPDATE pengaduan p
SET bidang_id = d.ke_bidang_id
FROM disposisi d
WHERE p.id = d.pengaduan_id
AND p.bidang_id IS NULL;
```

### Solution 4: RLS Policy Issue

**Check dan update RLS policies:**

```sql
-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'pengaduan';

-- Update policies untuk allow read
DROP POLICY IF EXISTS "Anyone can view pengaduan by kode" ON pengaduan;

CREATE POLICY "Anyone can view pengaduan by kode" ON pengaduan
    FOR SELECT USING (true);
```

---

## 🧪 Test Flow

Setelah fix, test dengan flow lengkap:

### 1. Submit Pengaduan Baru
```
- Buka: /pengaduan
- Isi form
- Submit
- Catat kode pengaduan (contoh: ADU-2025-0001)
```

### 2. Admin Verifikasi
```
- Login sebagai admin
- Buka: /admin
- Klik "Verifikasi" pada pengaduan
- Status berubah: masuk → terverifikasi
```

### 3. Admin Disposisi
```
- Klik "Disposisi"
- Pilih bidang (contoh: Bidang Hubungan Industrial)
- Isi keterangan
- Submit
- Status berubah: terverifikasi → terdisposisi
```

### 4. Check Bidang Dashboard
```
- Login sebagai user bidang
- Buka: /bidang
- Pengaduan HARUS MUNCUL ✅
```

### 5. Verify Database
```sql
-- Check pengaduan
SELECT kode_pengaduan, status, bidang_id
FROM pengaduan
WHERE kode_pengaduan = 'ADU-2025-0001';

-- Expected:
-- status = 'terdisposisi'
-- bidang_id = 1 (atau sesuai bidang yang dipilih)

-- Check disposisi
SELECT * FROM disposisi
WHERE pengaduan_id = (
    SELECT id FROM pengaduan WHERE kode_pengaduan = 'ADU-2025-0001'
);

-- Expected: Ada 1 record
```

---

## 🔍 Debug Console

Buka browser console (F12) saat di halaman `/bidang`:

**Expected logs:**
```
✅ Authenticated as bidang, loading data
=== LOADING BIDANG PENGADUAN FROM DATABASE ===
Bidang ID: 1
Fetching: /api/pengaduan?bidang_id=1&limit=100
API Response: {success: true, data: [...]}
Total pengaduan from DB: X
✅ Total pengaduan ditemukan: X
```

**Jika error:**
```
❌ Load error: [error message]
```

Check error message dan fix accordingly.

---

## 📋 Checklist

- [ ] Table `disposisi` exists
- [ ] Pengaduan sudah diverifikasi (status: terverifikasi)
- [ ] Pengaduan sudah didisposisi via admin
- [ ] Pengaduan punya `bidang_id` tidak NULL
- [ ] Status pengaduan: terdisposisi/tindak_lanjut/selesai
- [ ] User bidang punya `bidang_id` yang benar
- [ ] RLS policies allow read
- [ ] Browser console tidak ada error
- [ ] API response success
- [ ] Pengaduan muncul di dashboard ✅

---

## 🚀 Quick Fix Command

Run semua ini di Supabase SQL Editor:

```sql
-- 1. Ensure disposisi table exists
CREATE TABLE IF NOT EXISTS disposisi (
    id SERIAL PRIMARY KEY,
    pengaduan_id UUID REFERENCES pengaduan(id) ON DELETE CASCADE,
    dari_bidang_id INTEGER REFERENCES bidang(id) ON DELETE SET NULL,
    ke_bidang_id INTEGER REFERENCES bidang(id) ON DELETE SET NULL,
    keterangan TEXT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Fix bidang_id from disposisi
UPDATE pengaduan p
SET bidang_id = d.ke_bidang_id
FROM disposisi d
WHERE p.id = d.pengaduan_id
AND p.bidang_id IS NULL;

-- 3. Fix status
UPDATE pengaduan p
SET status = 'terdisposisi'
FROM disposisi d
WHERE p.id = d.pengaduan_id
AND p.status = 'terverifikasi';

-- 4. Check result
SELECT 
    p.kode_pengaduan,
    p.status,
    p.bidang_id,
    b.nama_bidang
FROM pengaduan p
LEFT JOIN bidang b ON p.bidang_id = b.id
WHERE p.bidang_id IS NOT NULL
ORDER BY p.created_at DESC;
```

---

File debug lengkap: `DEBUG_BIDANG_DASHBOARD.sql`
