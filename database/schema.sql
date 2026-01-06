-- ============================================
-- SIPelan Database Schema - Complete Setup
-- Sistem Pengaduan Layanan Online Naker
-- Version: 3.0 (Updated: December 2024)
-- ============================================
-- 
-- Instruksi:
-- 1. Copy seluruh file ini
-- 2. Jalankan di PostgreSQL (psql atau DB client)
-- 3. Run sekali saja
-- 4. Database siap digunakan
--
-- ============================================

-- ============================================
-- PART 1: DROP EXISTING TABLES (Clean Install)
-- ============================================

DROP TABLE IF EXISTS tanggapan CASCADE;
DROP TABLE IF EXISTS disposisi CASCADE;
DROP TABLE IF EXISTS pengaduan_status CASCADE;
DROP TABLE IF EXISTS pengaduan CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS app_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS bidang CASCADE;
DROP TABLE IF EXISTS kategori_pengaduan CASCADE;

-- ============================================
-- PART 2: CREATE CORE TABLES
-- ============================================

-- Kategori Pengaduan
CREATE TABLE kategori_pengaduan (
    id SERIAL PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL UNIQUE,
    deskripsi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bidang/Unit Kerja
CREATE TABLE bidang (
    id SERIAL PRIMARY KEY,
    nama_bidang VARCHAR(100) NOT NULL UNIQUE,
    kode_bidang VARCHAR(20) NOT NULL UNIQUE,
    email_bidang VARCHAR(255),
    deskripsi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users/Pengguna
CREATE TABLE users (
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
CREATE TABLE pengaduan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    kode_pengaduan VARCHAR(20) UNIQUE,
    user_id UUID REFERENCES users(id),
    kategori_id INTEGER REFERENCES kategori_pengaduan(id),
    judul_pengaduan VARCHAR(255) NOT NULL,
    isi_pengaduan TEXT NOT NULL,
    lokasi_kejadian VARCHAR(255),
    tanggal_kejadian DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'masuk',
    bidang_id INTEGER REFERENCES bidang(id),
    kode_bidang VARCHAR(20) REFERENCES bidang(kode_bidang),
    file_bukti VARCHAR(255),
    nama_pelapor VARCHAR(255),
    email_pelapor VARCHAR(255),
    no_telepon VARCHAR(50),
    nik VARCHAR(20),
    anonim BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tracking Status Pengaduan
CREATE TABLE pengaduan_status (
    id SERIAL PRIMARY KEY,
    pengaduan_id UUID REFERENCES pengaduan(id),
    status VARCHAR(20) NOT NULL,
    keterangan TEXT,
    tanggapan TEXT,
    petugas VARCHAR(255),
    file_url TEXT,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disposisi Pengaduan
CREATE TABLE disposisi (
    id SERIAL PRIMARY KEY,
    pengaduan_id UUID REFERENCES pengaduan(id),
    dari_bidang_id INTEGER REFERENCES bidang(id),
    ke_bidang_id INTEGER REFERENCES bidang(id),
    keterangan TEXT,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tanggapan Pengaduan
CREATE TABLE tanggapan (
    id SERIAL PRIMARY KEY,
    pengaduan_id UUID REFERENCES pengaduan(id),
    user_id UUID REFERENCES users(id),
    isi_tanggapan TEXT NOT NULL,
    file_lampiran VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PART 3: SESSIONS TABLE (Server-Side Auth)
-- ============================================

CREATE TABLE sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    ip_address VARCHAR(45)
);

-- ============================================
-- PART 4: APP SETTINGS TABLE (Dynamic Config)
-- ============================================

CREATE TABLE app_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PART 5: INSERT DEFAULT DATA
-- ============================================

-- Kategori Pengaduan
INSERT INTO kategori_pengaduan (nama_kategori, deskripsi) VALUES
('Pengupahan', 'Pengaduan terkait masalah gaji, upah minimum, tunjangan'),
('Ketenagakerjaan', 'Pengaduan terkait PHK, kontrak kerja, jam kerja'),
('K3', 'Pengaduan terkait keselamatan dan kesehatan kerja'),
('Pelatihan Kerja', 'Pengaduan terkait program pelatihan dan penempatan kerja'),
('Lainnya', 'Pengaduan yang tidak termasuk dalam kategori di atas')
ON CONFLICT (nama_kategori) DO NOTHING;

-- Bidang/Unit Kerja
INSERT INTO bidang (nama_bidang, kode_bidang, email_bidang) VALUES
('Bidang Hubungan Industrial', 'HI', 'hi@disnaker.go.id'),
('Bidang Latihan Kerja dan Produktivitas', 'LATTAS', 'lattas@disnaker.go.id'),
('Bidang Penempatan Tenaga Kerja dan Perluasan Kesempatan Kerja', 'PTPK', 'ptpk@disnaker.go.id'),
('UPTD BLK Pati', 'BLK', 'blkpati@disnaker.go.id'),
('Sekretariat', 'SEKRETARIAT', 'sekretariat@disnaker.go.id')
ON CONFLICT (kode_bidang) DO NOTHING;

-- Default App Settings (reCAPTCHA)
INSERT INTO app_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('recaptcha_enabled', 'false', 'boolean', 'Enable/disable reCAPTCHA protection', true),
('recaptcha_site_key', '', 'string', 'reCAPTCHA v3 Site Key (public)', true),
('recaptcha_secret_key', '', 'string', 'reCAPTCHA v3 Secret Key (private)', false),
('recaptcha_score_threshold', '0.5', 'number', 'Minimum score to accept (0.0-1.0)', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Default App Settings (Branding)
INSERT INTO app_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('app_name', 'SIPelan', 'string', 'Nama aplikasi yang ditampilkan di homepage', true),
('app_logo_url', '', 'string', 'URL logo aplikasi', true)
ON CONFLICT (setting_key) DO NOTHING;

-- Default App Settings (Social Media)
INSERT INTO app_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('facebook_url', '', 'string', 'URL halaman Facebook', true),
('twitter_url', '', 'string', 'URL halaman Twitter/X', true),
('instagram_url', '', 'string', 'URL halaman Instagram', true),
('youtube_url', '', 'string', 'URL halaman Youtube', true)
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================
-- PART 6: CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_pengaduan_kode ON pengaduan(kode_pengaduan);
CREATE INDEX IF NOT EXISTS idx_pengaduan_user ON pengaduan(user_id);
CREATE INDEX IF NOT EXISTS idx_pengaduan_status ON pengaduan(status);
CREATE INDEX IF NOT EXISTS idx_pengaduan_created ON pengaduan(created_at);
CREATE INDEX IF NOT EXISTS idx_pengaduan_bidang ON pengaduan(bidang_id);
CREATE INDEX IF NOT EXISTS idx_pengaduan_status_pengaduan ON pengaduan_status(pengaduan_id);
CREATE INDEX IF NOT EXISTS idx_disposisi_pengaduan ON disposisi(pengaduan_id);
CREATE INDEX IF NOT EXISTS idx_tanggapan_pengaduan ON tanggapan(pengaduan_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_settings_key ON app_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_settings_public ON app_settings(is_public);

-- ============================================
-- PART 7: FUNCTIONS & TRIGGERS
-- ============================================

-- Function to generate tracking code
CREATE OR REPLACE FUNCTION generate_kode_pengaduan()
RETURNS TRIGGER AS $$
DECLARE
    year_part TEXT;
    sequence_num INTEGER;
    new_kode TEXT;
BEGIN
    -- Only generate if kode_pengaduan is not provided
    IF NEW.kode_pengaduan IS NULL OR NEW.kode_pengaduan = '' THEN
        year_part := EXTRACT(year FROM CURRENT_DATE)::TEXT;
        
        -- Get the next sequence number for this year
        SELECT COALESCE(MAX(CAST(SUBSTRING(kode_pengaduan FROM 9) AS INTEGER)), 0) + 1
        INTO sequence_num
        FROM pengaduan
        WHERE kode_pengaduan LIKE 'ADU-' || year_part || '-%';
        
        -- Generate the code: ADU-YYYY-####
        new_kode := 'ADU-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
        NEW.kode_pengaduan := new_kode;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS trg_generate_kode_pengaduan ON pengaduan;

-- Create trigger for auto-generating kode pengaduan
CREATE TRIGGER trg_generate_kode_pengaduan
    BEFORE INSERT ON pengaduan
    FOR EACH ROW
    EXECUTE FUNCTION generate_kode_pengaduan();

-- Function to cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to get public settings
CREATE OR REPLACE FUNCTION get_public_settings()
RETURNS TABLE (
    setting_key VARCHAR,
    setting_value TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        app_settings.setting_key,
        app_settings.setting_value
    FROM app_settings
    WHERE is_public = true;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PART 8: SECURITY NOTES
-- ============================================
-- RLS and storage bucket policies are Supabase-specific.
-- For self-hosted PostgreSQL, enforce access control at the app layer.

-- ============================================
-- PART 9: DEFAULT USERS
-- ============================================

-- Admin User (Password: admin123)
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqgBrSLGsQz7MjEqPqgqPqgqPqgqP
INSERT INTO users (username, email, password_hash, nama_lengkap, role, is_active)
VALUES (
    'admin',
    'admin@disnaker.go.id',
    '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqgBrSLGsQz7MjEqPqgqPqgqPqgqP',
    'Administrator',
    'admin',
    true
)
ON CONFLICT (username) DO NOTHING;

-- Bidang Users (Password: bidang123)
-- Hash: $2a$10$P..2nqQwepoyAROJPhQU7eHhM8L3didyiv.1wjwyRtqRP8jrMpU/m
INSERT INTO users (username, email, password_hash, nama_lengkap, role, kode_bidang, is_active) VALUES
('bidang_hi', 'hi@disnaker.go.id', '$2a$10$P..2nqQwepoyAROJPhQU7eHhM8L3didyiv.1wjwyRtqRP8jrMpU/m', 'Kepala Bidang Hubungan Industrial', 'bidang', 'HI', true),
('bidang_lattas', 'lattas@disnaker.go.id', '$2a$10$P..2nqQwepoyAROJPhQU7eHhM8L3didyiv.1wjwyRtqRP8jrMpU/m', 'Kepala Bidang Latihan Kerja dan Produktivitas', 'bidang', 'LATTAS', true),
('bidang_ptpk', 'ptpk@disnaker.go.id', '$2a$10$P..2nqQwepoyAROJPhQU7eHhM8L3didyiv.1wjwyRtqRP8jrMpU/m', 'Kepala Bidang PTPK', 'bidang', 'PTPK', true),
('bidang_blk', 'blk@disnaker.go.id', '$2a$10$P..2nqQwepoyAROJPhQU7eHhM8L3didyiv.1wjwyRtqRP8jrMpU/m', 'Kepala UPTD BLK Pati', 'bidang', 'BLK', true),
('bidang_sekretariat', 'sekretariat@disnaker.go.id', '$2a$10$P..2nqQwepoyAROJPhQU7eHhM8L3didyiv.1wjwyRtqRP8jrMpU/m', 'Kepala Sekretariat', 'bidang', 'SEKRETARIAT', true)
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- PART 10: COMMENTS
-- ============================================

COMMENT ON TABLE pengaduan IS 'Tabel utama untuk menyimpan data pengaduan';
COMMENT ON TABLE pengaduan_status IS 'Tracking status dan tanggapan pengaduan';
COMMENT ON TABLE sessions IS 'Server-side session management';
COMMENT ON TABLE app_settings IS 'Dynamic application settings (key-value)';

COMMENT ON COLUMN pengaduan.nama_pelapor IS 'Nama pelapor untuk pengaduan anonim atau non-login';
COMMENT ON COLUMN pengaduan.email_pelapor IS 'Email pelapor untuk pengaduan anonim atau non-login';
COMMENT ON COLUMN pengaduan.no_telepon IS 'Nomor telepon pelapor';
COMMENT ON COLUMN pengaduan.anonim IS 'Tandai jika pelapor ingin tetap anonim';
COMMENT ON COLUMN pengaduan_status.file_url IS 'URL file lampiran untuk tanggapan';
COMMENT ON COLUMN pengaduan_status.tanggapan IS 'Isi tanggapan dari petugas';
COMMENT ON COLUMN pengaduan_status.petugas IS 'Nama petugas yang memberikan tanggapan';

-- ============================================
-- PART 11: VERIFICATION QUERIES
-- ============================================

-- Check tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'trg_generate_kode_pengaduan';

-- Check data inserted
SELECT 'Kategori' as table_name, COUNT(*) as count FROM kategori_pengaduan
UNION ALL
SELECT 'Bidang', COUNT(*) FROM bidang
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'App Settings', COUNT(*) FROM app_settings;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- 
-- Default Credentials:
-- 
-- ADMIN:
--   Username: admin
--   Password: admin123
-- 
-- BIDANG USERS:
--   bidang_hi / bidang123
--   bidang_lattas / bidang123
--   bidang_ptpk / bidang123
--   bidang_blk / bidang123
--   bidang_sekretariat / bidang123
--
-- Next Steps:
-- 1. Update .env.local dengan DATABASE_URL
-- 2. Login dengan admin/admin123
-- 3. Ganti password di Settings
-- 4. Konfigurasi app settings (logo, nama, social media)
-- 5. Mulai gunakan aplikasi
--
-- ============================================
