-- ============================================================================
-- SCRIPT UNTUK MENAMBAHKAN KOLOM kode_bidang KE TABEL users
-- ============================================================================
-- Kolom ini diperlukan untuk user dengan role 'bidang'
-- ============================================================================

-- Tambahkan kolom kode_bidang ke tabel users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS kode_bidang VARCHAR(20);

-- Tambahkan foreign key constraint ke tabel bidang
ALTER TABLE users
ADD CONSTRAINT fk_users_bidang 
FOREIGN KEY (kode_bidang) 
REFERENCES bidang(kode_bidang)
ON DELETE SET NULL;

-- Verifikasi kolom sudah ditambahkan
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users' 
AND column_name = 'kode_bidang';

-- ============================================================================
-- Setelah menjalankan script ini, Anda bisa menjalankan:
-- database/create_bidang_users.sql
-- ============================================================================
