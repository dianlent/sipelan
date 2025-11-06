-- ============================================
-- DEBUG: Pengaduan Tidak Muncul di Bidang Dashboard
-- ============================================

-- Step 1: Check if disposisi table exists
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'disposisi'
ORDER BY ordinal_position;

-- Step 2: Check pengaduan data
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

-- Step 3: Check disposisi records
SELECT 
    d.id,
    d.pengaduan_id,
    p.kode_pengaduan,
    d.dari_bidang_id,
    d.ke_bidang_id,
    b.nama_bidang as bidang_tujuan,
    d.keterangan,
    d.created_at
FROM disposisi d
JOIN pengaduan p ON d.pengaduan_id = p.id
LEFT JOIN bidang b ON d.ke_bidang_id = b.id
ORDER BY d.created_at DESC
LIMIT 10;

-- Step 4: Check pengaduan dengan bidang_id tertentu (contoh: bidang_id = 1)
-- Ganti 1 dengan bidang_id yang sesuai
SELECT 
    p.id,
    p.kode_pengaduan,
    p.judul_pengaduan,
    p.status,
    p.bidang_id,
    b.nama_bidang,
    b.kode_bidang,
    p.created_at
FROM pengaduan p
LEFT JOIN bidang b ON p.bidang_id = b.id
WHERE p.bidang_id = 1  -- Ganti dengan bidang_id Anda
ORDER BY p.created_at DESC;

-- Step 5: Check pengaduan dengan status terdisposisi
SELECT 
    p.id,
    p.kode_pengaduan,
    p.judul_pengaduan,
    p.status,
    p.bidang_id,
    b.nama_bidang,
    p.created_at
FROM pengaduan p
LEFT JOIN bidang b ON p.bidang_id = b.id
WHERE p.status IN ('terdisposisi', 'tindak_lanjut', 'selesai')
ORDER BY p.created_at DESC;

-- Step 6: Check users dengan role bidang
SELECT 
    id,
    email,
    nama_lengkap,
    role,
    bidang_id,
    kode_bidang
FROM users
WHERE role = 'bidang'
ORDER BY bidang_id;

-- Step 7: Full join - pengaduan yang seharusnya muncul di bidang
SELECT 
    p.id,
    p.kode_pengaduan,
    p.judul_pengaduan,
    p.status,
    p.bidang_id,
    b.nama_bidang as bidang_pengaduan,
    d.ke_bidang_id as disposisi_ke_bidang,
    bd.nama_bidang as bidang_disposisi,
    p.created_at
FROM pengaduan p
LEFT JOIN bidang b ON p.bidang_id = b.id
LEFT JOIN disposisi d ON p.id = d.pengaduan_id
LEFT JOIN bidang bd ON d.ke_bidang_id = bd.id
WHERE p.bidang_id IS NOT NULL
ORDER BY p.created_at DESC
LIMIT 20;

-- ============================================
-- EXPECTED RESULTS:
-- ============================================
-- 1. Table disposisi harus ada dengan columns: id, pengaduan_id, dari_bidang_id, ke_bidang_id, keterangan, user_id, created_at
-- 2. Pengaduan harus punya bidang_id yang sesuai
-- 3. Status pengaduan harus: terdisposisi, tindak_lanjut, atau selesai
-- 4. Disposisi record harus ada untuk pengaduan yang didisposisi

-- ============================================
-- QUICK FIX QUERIES (if needed):
-- ============================================

-- Fix 1: Update pengaduan yang sudah didisposisi tapi bidang_id NULL
-- UPDATE pengaduan p
-- SET bidang_id = d.ke_bidang_id
-- FROM disposisi d
-- WHERE p.id = d.pengaduan_id
-- AND p.bidang_id IS NULL;

-- Fix 2: Update status pengaduan yang sudah didisposisi
-- UPDATE pengaduan p
-- SET status = 'terdisposisi'
-- FROM disposisi d
-- WHERE p.id = d.pengaduan_id
-- AND p.status NOT IN ('terdisposisi', 'tindak_lanjut', 'selesai');

-- Fix 3: Create sample disposisi (for testing)
-- INSERT INTO disposisi (pengaduan_id, dari_bidang_id, ke_bidang_id, keterangan)
-- SELECT 
--     id,
--     NULL,
--     1,  -- Ganti dengan bidang_id tujuan
--     'Test disposisi dari admin'
-- FROM pengaduan
-- WHERE status = 'terverifikasi'
-- LIMIT 1;
