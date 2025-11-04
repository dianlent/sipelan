-- ============================================================================
-- SCRIPT UNTUK MEMBUAT USER UNTUK SETIAP BIDANG
-- ============================================================================
-- Password untuk semua bidang: bidang123 (sudah di-hash dengan bcrypt)
-- 
-- Cara menggunakan:
-- 1. Buka Supabase Dashboard
-- 2. Pilih project Anda
-- 3. Klik "SQL Editor" di sidebar
-- 4. Copy-paste script di bawah ini
-- 5. Klik "Run" atau tekan Ctrl+Enter
-- ============================================================================

-- 1. User untuk Bidang Hubungan Industrial (HI)
INSERT INTO users (
    username,
    email,
    password_hash,
    nama_lengkap,
    role,
    kode_bidang,
    is_active
) VALUES (
    'bidang_hi',
    'hi@disnaker.go.id',
    '$2a$10$P..2nqQwepoyAROJPhQU7eHhM8L3didyiv.1wjwyRtqRP8jrMpU/m',
    'Kepala Bidang Hubungan Industrial',
    'bidang',
    'HI',
    true
);

-- 2. User untuk Bidang Latihan Kerja dan Produktivitas (LATTAS)
INSERT INTO users (
    username,
    email,
    password_hash,
    nama_lengkap,
    role,
    kode_bidang,
    is_active
) VALUES (
    'bidang_lattas',
    'lattas@disnaker.go.id',
    '$2a$10$P..2nqQwepoyAROJPhQU7eHhM8L3didyiv.1wjwyRtqRP8jrMpU/m',
    'Kepala Bidang Latihan Kerja dan Produktivitas',
    'bidang',
    'LATTAS',
    true
);

-- 3. User untuk Bidang PTPK
INSERT INTO users (
    username,
    email,
    password_hash,
    nama_lengkap,
    role,
    kode_bidang,
    is_active
) VALUES (
    'bidang_ptpk',
    'ptpk@disnaker.go.id',
    '$2a$10$P..2nqQwepoyAROJPhQU7eHhM8L3didyiv.1wjwyRtqRP8jrMpU/m',
    'Kepala Bidang PTPK',
    'bidang',
    'PTPK',
    true
);

-- 4. User untuk UPTD BLK Pati
INSERT INTO users (
    username,
    email,
    password_hash,
    nama_lengkap,
    role,
    kode_bidang,
    is_active
) VALUES (
    'bidang_blk',
    'blk@disnaker.go.id',
    '$2a$10$P..2nqQwepoyAROJPhQU7eHhM8L3didyiv.1wjwyRtqRP8jrMpU/m',
    'Kepala UPTD BLK Pati',
    'bidang',
    'BLK',
    true
);

-- 5. User untuk Sekretariat
INSERT INTO users (
    username,
    email,
    password_hash,
    nama_lengkap,
    role,
    kode_bidang,
    is_active
) VALUES (
    'bidang_sekretariat',
    'sekretariat@disnaker.go.id',
    '$2a$10$P..2nqQwepoyAROJPhQU7eHhM8L3didyiv.1wjwyRtqRP8jrMpU/m',
    'Kepala Sekretariat',
    'bidang',
    'SEKRETARIAT',
    true
);

-- ============================================================================
-- VERIFIKASI USER BIDANG
-- ============================================================================

-- Lihat semua user bidang yang sudah dibuat
SELECT 
    id,
    username,
    email,
    nama_lengkap,
    role,
    kode_bidang,
    is_active,
    created_at
FROM users
WHERE role = 'bidang'
ORDER BY kode_bidang;

-- ============================================================================
-- KREDENSIAL LOGIN UNTUK SETIAP BIDANG
-- ============================================================================
-- 
-- 1. BIDANG HUBUNGAN INDUSTRIAL (HI)
--    Email    : hi@disnaker.go.id
--    Password : bidang123
--    Username : bidang_hi
--
-- 2. BIDANG LATIHAN KERJA DAN PRODUKTIVITAS (LATTAS)
--    Email    : lattas@disnaker.go.id
--    Password : bidang123
--    Username : bidang_lattas
--
-- 3. BIDANG PTPK
--    Email    : ptpk@disnaker.go.id
--    Password : bidang123
--    Username : bidang_ptpk
--
-- 4. UPTD BLK PATI (BLK)
--    Email    : blk@disnaker.go.id
--    Password : bidang123
--    Username : bidang_blk
--
-- 5. SEKRETARIAT
--    Email    : sekretariat@disnaker.go.id
--    Password : bidang123
--    Username : bidang_sekretariat
--
-- ============================================================================
