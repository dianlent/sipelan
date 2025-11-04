-- ============================================================================
-- SETUP LENGKAP DATABASE SIPELAN
-- ============================================================================
-- Jalankan script ini secara berurutan di Supabase SQL Editor
-- Copy dan paste setiap section, lalu klik "Run"
-- ============================================================================

-- ============================================================================
-- SECTION 1: DROP EXISTING TABLES (Optional - hanya jika ingin fresh install)
-- ============================================================================
-- PERINGATAN: Ini akan menghapus semua data!
-- Uncomment jika ingin fresh install

/*
DROP TABLE IF EXISTS tanggapan CASCADE;
DROP TABLE IF EXISTS disposisi CASCADE;
DROP TABLE IF EXISTS pengaduan_status CASCADE;
DROP TABLE IF EXISTS pengaduan CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS bidang CASCADE;
DROP TABLE IF EXISTS kategori_pengaduan CASCADE;
*/

-- ============================================================================
-- SECTION 2: CREATE TABLES
-- ============================================================================

-- Kategori Pengaduan
CREATE TABLE IF NOT EXISTS kategori_pengaduan (
    id SERIAL PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL UNIQUE,
    deskripsi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bidang/Unit Kerja
CREATE TABLE IF NOT EXISTS bidang (
    id SERIAL PRIMARY KEY,
    nama_bidang VARCHAR(100) NOT NULL UNIQUE,
    kode_bidang VARCHAR(20) NOT NULL UNIQUE,
    email_bidang VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users/Pengguna
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'masyarakat',
    bidang_id INTEGER REFERENCES bidang(id),
    kode_bidang VARCHAR(20) REFERENCES bidang(kode_bidang),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pengaduan
CREATE TABLE IF NOT EXISTS pengaduan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    kode_pengaduan VARCHAR(20) NOT NULL UNIQUE,
    user_id UUID REFERENCES users(id),
    kategori_id INTEGER REFERENCES kategori_pengaduan(id),
    judul_pengaduan VARCHAR(255) NOT NULL,
    isi_pengaduan TEXT NOT NULL,
    nama_pelapor VARCHAR(255) NOT NULL,
    email_pelapor VARCHAR(255) NOT NULL,
    no_telepon VARCHAR(20),
    lokasi_kejadian TEXT,
    tanggal_kejadian DATE,
    file_bukti VARCHAR(255),
    status VARCHAR(20) DEFAULT 'diterima',
    bidang_id INTEGER REFERENCES bidang(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disposisi
CREATE TABLE IF NOT EXISTS disposisi (
    id SERIAL PRIMARY KEY,
    pengaduan_id UUID REFERENCES pengaduan(id) ON DELETE CASCADE,
    dari_user_id UUID REFERENCES users(id),
    ke_bidang_id INTEGER REFERENCES bidang(id),
    keterangan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Status History
CREATE TABLE IF NOT EXISTS pengaduan_status (
    id SERIAL PRIMARY KEY,
    pengaduan_id UUID REFERENCES pengaduan(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    keterangan TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tanggapan
CREATE TABLE IF NOT EXISTS tanggapan (
    id SERIAL PRIMARY KEY,
    pengaduan_id UUID REFERENCES pengaduan(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    isi_tanggapan TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTION 3: INSERT DATA MASTER
-- ============================================================================

-- Insert Kategori Pengaduan
INSERT INTO kategori_pengaduan (nama_kategori, deskripsi) VALUES
('Pengupahan', 'Masalah gaji, upah minimum, tunjangan'),
('Ketenagakerjaan', 'PHK, kontrak kerja, jam kerja'),
('K3', 'Keselamatan dan kesehatan kerja'),
('Pelatihan Kerja', 'Program pelatihan dan penempatan'),
('Lainnya', 'Pengaduan lainnya')
ON CONFLICT (nama_kategori) DO NOTHING;

-- Insert Bidang
INSERT INTO bidang (kode_bidang, nama_bidang, email_bidang) VALUES
('HI', 'Bidang Hubungan Industrial', 'hi@disnaker.go.id'),
('LATTAS', 'Bidang Latihan Kerja dan Produktivitas', 'lattas@disnaker.go.id'),
('PTPK', 'Bidang PTPK', 'ptpk@disnaker.go.id'),
('BLK', 'UPTD BLK Pati', 'blk@disnaker.go.id'),
('SEKRETARIAT', 'Sekretariat', 'sekretariat@disnaker.go.id')
ON CONFLICT (kode_bidang) DO NOTHING;

-- ============================================================================
-- SECTION 4: CREATE ADMIN USER
-- ============================================================================

-- Insert Admin User
-- Email: admin@sipelan.com
-- Password: admin123
INSERT INTO users (
    username,
    email,
    password_hash,
    nama_lengkap,
    role,
    is_active
) VALUES (
    'admin',
    'admin@sipelan.com',
    '$2a$10$cMyyHuv7DFDW2r0Erf6qWe19XfK8sZpwZvUQxnxkc/.oHDFV3YH8u',
    'Administrator SIPelan',
    'admin',
    true
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- SECTION 5: CREATE BIDANG USERS
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
)
ON CONFLICT (email) DO NOTHING;

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
)
ON CONFLICT (email) DO NOTHING;

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
)
ON CONFLICT (email) DO NOTHING;

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
)
ON CONFLICT (email) DO NOTHING;

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
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- SECTION 6: VERIFIKASI
-- ============================================================================

-- Verifikasi Tables
SELECT 
    table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verifikasi Kategori
SELECT * FROM kategori_pengaduan ORDER BY id;

-- Verifikasi Bidang
SELECT * FROM bidang ORDER BY kode_bidang;

-- Verifikasi Users
SELECT 
    username,
    email,
    nama_lengkap,
    role,
    kode_bidang,
    is_active
FROM users
ORDER BY 
    CASE role 
        WHEN 'admin' THEN 1 
        WHEN 'bidang' THEN 2 
        ELSE 3 
    END,
    kode_bidang;

-- ============================================================================
-- SETUP SELESAI!
-- ============================================================================
-- 
-- KREDENSIAL LOGIN:
-- 
-- ADMIN:
--   Email    : admin@sipelan.com
--   Password : admin123
--   URL      : http://localhost:5000/admin
--
-- BIDANG HI:
--   Email    : hi@disnaker.go.id
--   Password : bidang123
--
-- BIDANG LATTAS:
--   Email    : lattas@disnaker.go.id
--   Password : bidang123
--
-- BIDANG PTPK:
--   Email    : ptpk@disnaker.go.id
--   Password : bidang123
--
-- BIDANG BLK:
--   Email    : blk@disnaker.go.id
--   Password : bidang123
--
-- BIDANG SEKRETARIAT:
--   Email    : sekretariat@disnaker.go.id
--   Password : bidang123
--
-- ============================================================================
