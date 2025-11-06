-- Verify Complete Flow: Submit -> Verifikasi -> Disposisi -> Muncul di Bidang
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: Check Bidang Table
-- ============================================
SELECT * FROM bidang ORDER BY id;
-- Expected:
-- id=1, kode_bidang='HI', nama_bidang='Hubungan Industrial'
-- id=2, kode_bidang='LATTAS', nama_bidang='Pelatihan dan Penempatan Tenaga Kerja'
-- id=3, kode_bidang='PTPK', nama_bidang='Pengawasan dan Perlindungan Tenaga Kerja'
-- id=4, kode_bidang='BLK', nama_bidang='Balai Latihan Kerja'
-- id=5, kode_bidang='SEKRETARIAT', nama_bidang='Sekretariat'

-- ============================================
-- STEP 2: Check Users Bidang
-- ============================================
SELECT 
    u.id,
    u.email,
    u.nama_lengkap,
    u.role,
    u.bidang_id,
    u.kode_bidang,
    b.nama_bidang
FROM users u
LEFT JOIN bidang b ON u.bidang_id = b.id
WHERE u.role = 'bidang'
ORDER BY u.bidang_id;

-- Expected: Setiap user bidang punya bidang_id yang match dengan bidang table

-- ============================================
-- STEP 3: Check Pengaduan
-- ============================================
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
ORDER BY p.created_at DESC
LIMIT 10;

-- Check:
-- - Ada pengaduan dengan status 'terdisposisi'?
-- - bidang_id terisi dengan benar?

-- ============================================
-- STEP 4: Check Disposisi
-- ============================================
SELECT 
    d.id,
    p.kode_pengaduan,
    p.judul_pengaduan,
    d.dari_bidang_id,
    b1.nama_bidang as dari_bidang,
    d.ke_bidang_id,
    b2.nama_bidang as ke_bidang,
    p.bidang_id as pengaduan_bidang_id,
    p.status as pengaduan_status,
    d.keterangan,
    d.created_at
FROM disposisi d
JOIN pengaduan p ON d.pengaduan_id = p.id
LEFT JOIN bidang b1 ON d.dari_bidang_id = b1.id
LEFT JOIN bidang b2 ON d.ke_bidang_id = b2.id
ORDER BY d.created_at DESC
LIMIT 10;

-- Verify:
-- - ke_bidang_id harus sama dengan pengaduan.bidang_id
-- - pengaduan_status harus 'terdisposisi'

-- ============================================
-- STEP 5: Pengaduan yang Seharusnya Muncul di Bidang
-- ============================================

-- Contoh: Pengaduan untuk bidang_id = 1 (Hubungan Industrial)
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
WHERE p.bidang_id = 1  -- Ganti dengan bidang_id yang ingin dicek
AND p.status IN ('terdisposisi', 'tindak_lanjut', 'selesai')
ORDER BY p.created_at DESC;

-- ============================================
-- STEP 6: Check Timeline/Status History
-- ============================================
SELECT 
    ps.id,
    p.kode_pengaduan,
    ps.status,
    ps.keterangan,
    ps.created_at
FROM pengaduan_status ps
JOIN pengaduan p ON ps.pengaduan_id = p.id
WHERE p.bidang_id = 1  -- Ganti dengan bidang_id yang ingin dicek
ORDER BY p.kode_pengaduan, ps.created_at;

-- ============================================
-- DIAGNOSTIC QUERIES
-- ============================================

-- Count pengaduan per bidang
SELECT 
    b.id,
    b.nama_bidang,
    COUNT(p.id) as total_pengaduan,
    COUNT(CASE WHEN p.status = 'terdisposisi' THEN 1 END) as terdisposisi,
    COUNT(CASE WHEN p.status = 'tindak_lanjut' THEN 1 END) as tindak_lanjut,
    COUNT(CASE WHEN p.status = 'selesai' THEN 1 END) as selesai
FROM bidang b
LEFT JOIN pengaduan p ON b.id = p.bidang_id
GROUP BY b.id, b.nama_bidang
ORDER BY b.id;

-- Pengaduan yang bidang_id NULL (orphan)
SELECT 
    p.id,
    p.kode_pengaduan,
    p.judul_pengaduan,
    p.status,
    p.bidang_id,
    p.created_at
FROM pengaduan p
WHERE p.status IN ('terdisposisi', 'tindak_lanjut', 'selesai')
AND p.bidang_id IS NULL
ORDER BY p.created_at DESC;

-- Disposisi yang bidang_id tidak match
SELECT 
    d.id,
    p.kode_pengaduan,
    d.ke_bidang_id as disposisi_ke,
    p.bidang_id as pengaduan_bidang,
    CASE 
        WHEN d.ke_bidang_id = p.bidang_id THEN 'MATCH ✅'
        ELSE 'MISMATCH ❌'
    END as status_match
FROM disposisi d
JOIN pengaduan p ON d.pengaduan_id = p.id
ORDER BY d.created_at DESC;

-- ============================================
-- FIX QUERIES (if needed)
-- ============================================

-- Fix 1: Sync bidang_id dari disposisi ke pengaduan
UPDATE pengaduan p
SET bidang_id = d.ke_bidang_id
FROM disposisi d
WHERE p.id = d.pengaduan_id
AND (p.bidang_id IS NULL OR p.bidang_id != d.ke_bidang_id);

-- Fix 2: Update status pengaduan yang sudah didisposisi
UPDATE pengaduan p
SET status = 'terdisposisi'
FROM disposisi d
WHERE p.id = d.pengaduan_id
AND p.status = 'terverifikasi';

-- Fix 3: Set bidang_id untuk user bidang
UPDATE users
SET bidang_id = b.id
FROM bidang b
WHERE users.role = 'bidang'
AND users.kode_bidang = b.kode_bidang
AND users.bidang_id IS NULL;

-- ============================================
-- FINAL VERIFICATION
-- ============================================

-- Full join untuk verify semua data match
SELECT 
    p.kode_pengaduan,
    p.judul_pengaduan,
    p.status as pengaduan_status,
    p.bidang_id as pengaduan_bidang_id,
    b.nama_bidang as pengaduan_bidang,
    d.ke_bidang_id as disposisi_bidang_id,
    b2.nama_bidang as disposisi_bidang,
    CASE 
        WHEN p.bidang_id = d.ke_bidang_id THEN '✅ OK'
        WHEN p.bidang_id IS NULL THEN '❌ NULL'
        ELSE '❌ MISMATCH'
    END as check_status,
    p.created_at
FROM pengaduan p
LEFT JOIN disposisi d ON p.id = d.pengaduan_id
LEFT JOIN bidang b ON p.bidang_id = b.id
LEFT JOIN bidang b2 ON d.ke_bidang_id = b2.id
WHERE p.status IN ('terdisposisi', 'tindak_lanjut', 'selesai')
ORDER BY p.created_at DESC
LIMIT 20;

-- Expected: Semua harus status '✅ OK'
