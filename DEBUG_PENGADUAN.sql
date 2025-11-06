-- ============================================
-- DEBUG: Pengaduan Tidak Muncul di Bidang
-- ============================================

-- 1. CEK SEMUA PENGADUAN
-- Lihat semua pengaduan yang ada dengan status dan bidang_id
SELECT 
    id,
    kode_pengaduan,
    judul_pengaduan,
    status,
    bidang_id,
    created_at,
    updated_at
FROM pengaduan
ORDER BY created_at DESC
LIMIT 20;

-- 2. CEK PENGADUAN DENGAN BIDANG
-- Lihat pengaduan yang sudah didisposisi dengan detail bidang
SELECT 
    p.id,
    p.kode_pengaduan,
    p.judul_pengaduan,
    p.status,
    p.bidang_id,
    b.nama_bidang,
    b.kode_bidang,
    p.created_at,
    p.updated_at
FROM pengaduan p
LEFT JOIN bidang b ON p.bidang_id = b.id
WHERE p.bidang_id IS NOT NULL
ORDER BY p.updated_at DESC;

-- 3. CEK DISPOSISI HISTORY
-- Lihat semua history disposisi
SELECT 
    d.id,
    d.pengaduan_id,
    p.kode_pengaduan,
    d.dari_bidang_id,
    fb.nama_bidang as dari_bidang,
    d.ke_bidang_id,
    tb.nama_bidang as ke_bidang,
    d.keterangan,
    d.created_at
FROM disposisi d
LEFT JOIN pengaduan p ON d.pengaduan_id = p.id
LEFT JOIN bidang fb ON d.dari_bidang_id = fb.id
LEFT JOIN bidang tb ON d.ke_bidang_id = tb.id
ORDER BY d.created_at DESC;

-- 4. CEK TIMELINE PENGADUAN
-- Lihat timeline/status history untuk pengaduan tertentu
-- GANTI 'ADU-2025-0001' dengan kode pengaduan Anda
SELECT 
    ps.id,
    ps.pengaduan_id,
    p.kode_pengaduan,
    ps.status,
    ps.keterangan,
    ps.created_at,
    u.nama_lengkap as petugas
FROM pengaduan_status ps
LEFT JOIN pengaduan p ON ps.pengaduan_id = p.id
LEFT JOIN users u ON ps.user_id = u.id
WHERE p.kode_pengaduan = 'ADU-2025-0001'  -- GANTI dengan kode Anda
ORDER BY ps.created_at ASC;

-- 5. CEK PENGADUAN PER BIDANG
-- Lihat pengaduan yang masuk ke setiap bidang
SELECT 
    b.id,
    b.nama_bidang,
    b.kode_bidang,
    COUNT(p.id) as jumlah_pengaduan,
    COUNT(CASE WHEN p.status = 'terdisposisi' THEN 1 END) as terdisposisi,
    COUNT(CASE WHEN p.status = 'tindak_lanjut' THEN 1 END) as tindak_lanjut,
    COUNT(CASE WHEN p.status = 'selesai' THEN 1 END) as selesai
FROM bidang b
LEFT JOIN pengaduan p ON b.id = p.bidang_id
GROUP BY b.id, b.nama_bidang, b.kode_bidang
ORDER BY b.id;

-- 6. CEK USER BIDANG
-- Lihat user yang terhubung ke bidang mana
SELECT 
    u.id,
    u.email,
    u.nama_lengkap,
    u.role,
    u.bidang_id,
    b.nama_bidang,
    b.kode_bidang
FROM users u
LEFT JOIN bidang b ON u.bidang_id = b.id
WHERE u.role = 'bidang'
ORDER BY u.bidang_id;

-- 7. CEK PENGADUAN SPECIFIC BIDANG
-- GANTI bidang_id = 1 dengan ID bidang Anda
SELECT 
    p.id,
    p.kode_pengaduan,
    p.judul_pengaduan,
    p.status,
    p.bidang_id,
    b.nama_bidang,
    k.nama_kategori,
    p.nama_pelapor,
    p.email_pelapor,
    p.created_at
FROM pengaduan p
LEFT JOIN bidang b ON p.bidang_id = b.id
LEFT JOIN kategori_pengaduan k ON p.kategori_id = k.id
WHERE p.bidang_id = 1  -- GANTI dengan bidang_id user Anda
ORDER BY p.created_at DESC;

-- 8. CEK LAST PENGADUAN YANG DIDISPOSISI
-- Lihat pengaduan terakhir yang didisposisi dengan detail lengkap
SELECT 
    p.*,
    b.nama_bidang,
    b.kode_bidang,
    k.nama_kategori,
    (
        SELECT json_agg(
            json_build_object(
                'status', ps.status,
                'keterangan', ps.keterangan,
                'created_at', ps.created_at
            ) ORDER BY ps.created_at
        )
        FROM pengaduan_status ps
        WHERE ps.pengaduan_id = p.id
    ) as timeline
FROM pengaduan p
LEFT JOIN bidang b ON p.bidang_id = b.id
LEFT JOIN kategori_pengaduan k ON p.kategori_id = k.id
WHERE p.status = 'terdisposisi'
ORDER BY p.updated_at DESC
LIMIT 5;

-- ============================================
-- TROUBLESHOOTING COMMANDS
-- ============================================

-- JIKA PENGADUAN TIDAK MUNCUL, CEK:

-- A. Apakah bidang_id ter-set?
SELECT kode_pengaduan, status, bidang_id 
FROM pengaduan 
WHERE kode_pengaduan = 'ADU-2025-0001';  -- GANTI

-- B. Apakah user punya bidang_id?
SELECT email, nama_lengkap, role, bidang_id 
FROM users 
WHERE email = 'user_bidang@example.com';  -- GANTI

-- C. Apakah ada data di disposisi?
SELECT * FROM disposisi 
WHERE pengaduan_id = (
    SELECT id FROM pengaduan WHERE kode_pengaduan = 'ADU-2025-0001'  -- GANTI
)
ORDER BY created_at DESC;

-- D. Apakah ada timeline?
SELECT * FROM pengaduan_status 
WHERE pengaduan_id = (
    SELECT id FROM pengaduan WHERE kode_pengaduan = 'ADU-2025-0001'  -- GANTI
)
ORDER BY created_at ASC;

-- ============================================
-- FIX COMMANDS (Jika diperlukan)
-- ============================================

-- FIX 1: Update bidang_id manually (jika disposisi gagal)
-- UPDATE pengaduan 
-- SET bidang_id = 1, status = 'terdisposisi', updated_at = NOW()
-- WHERE kode_pengaduan = 'ADU-2025-0001';  -- GANTI

-- FIX 2: Insert disposisi record manually
-- INSERT INTO disposisi (pengaduan_id, dari_bidang_id, ke_bidang_id, keterangan)
-- VALUES (
--     (SELECT id FROM pengaduan WHERE kode_pengaduan = 'ADU-2025-0001'),  -- GANTI
--     NULL,
--     1,  -- ID bidang tujuan
--     'Disposisi manual untuk testing'
-- );

-- FIX 3: Insert status timeline manually
-- INSERT INTO pengaduan_status (pengaduan_id, status, keterangan)
-- VALUES (
--     (SELECT id FROM pengaduan WHERE kode_pengaduan = 'ADU-2025-0001'),  -- GANTI
--     'terdisposisi',
--     'Pengaduan didisposisikan ke Bidang Hubungan Industrial'
-- );

-- FIX 4: Set user bidang_id
-- UPDATE users 
-- SET bidang_id = 1  -- ID bidang
-- WHERE email = 'user_bidang@example.com';  -- GANTI

-- ============================================
-- EXPECTED RESULTS
-- ============================================

-- Pengaduan akan muncul di bidang dashboard jika:
-- 1. pengaduan.bidang_id = user.bidang_id ✓
-- 2. pengaduan.status = 'terdisposisi' (atau status lain) ✓
-- 3. API call: /api/pengaduan?bidang_id={user.bidang_id} ✓

-- Example pengaduan yang benar:
-- {
--   "id": "uuid",
--   "kode_pengaduan": "ADU-2025-0001",
--   "bidang_id": 1,
--   "status": "terdisposisi",
--   ...
-- }

-- Example user bidang yang benar:
-- {
--   "id": "uuid",
--   "email": "hi@example.com",
--   "role": "bidang",
--   "bidang_id": 1,
--   ...
-- }
