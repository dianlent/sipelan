-- Verification queries
-- Run these AFTER running MIGRATION.sql

-- 1. Check if trigger exists
SELECT tgname, tgtype, tgenabled 
FROM pg_trigger 
WHERE tgname = 'trg_generate_kode_pengaduan';

-- 2. Check if columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pengaduan' 
AND column_name IN ('nama_pelapor', 'email_pelapor', 'no_telepon', 'anonim', 'kode_pengaduan', 'user_id')
ORDER BY column_name;

-- 3. Test insert (will auto-generate kode)
INSERT INTO pengaduan (
    kategori_id, 
    judul_pengaduan, 
    isi_pengaduan, 
    nama_pelapor, 
    email_pelapor, 
    no_telepon, 
    status
)
VALUES (
    1, 
    'Test Pengaduan', 
    'Ini adalah test pengaduan untuk verifikasi trigger', 
    'Test User', 
    'test@example.com', 
    '08123456789', 
    'masuk'
)
RETURNING id, kode_pengaduan, judul_pengaduan, nama_pelapor, created_at;

-- Expected result: kode_pengaduan should be like ADU-2025-0001
