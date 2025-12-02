-- ============================================
-- 🔧 FIX LOGIN - COPY & PASTE KE SUPABASE
-- ============================================
-- Jalankan SQL ini di Supabase SQL Editor
-- Klik "Run" untuk execute
-- ============================================

-- 1. Hapus user lama (jika ada)
DELETE FROM users WHERE email IN ('admin@disnaker.go.id', 'hi@disnaker.go.id');

-- 2. Buat Admin User (Password: admin123)
INSERT INTO users (
  username, 
  email, 
  password_hash, 
  nama_lengkap, 
  role, 
  is_active
) VALUES (
  'admin',
  'admin@disnaker.go.id',
  '$2a$10$EDj6epq/y.mWpUPhSfkH5u2uRYm4T9Qlpz7w4pbYoyvIxN3KtB57K',
  'Administrator',
  'admin',
  true
);

-- 3. Buat Bidang HI User (Password: bidang123)
INSERT INTO users (
  username,
  email,
  password_hash,
  nama_lengkap,
  role,
  kode_bidang,
  bidang_id,
  is_active
) VALUES (
  'bidang_hi',
  'hi@disnaker.go.id',
  '$2a$10$DwON.ezoyRSsocfyXQKTPuWtQzr49LkInMMvK5C5hgBkLLfTh5WJa',
  'Staff Bidang HI',
  'bidang',
  'HI',
  (SELECT id FROM bidang WHERE kode_bidang = 'HI' LIMIT 1),
  true
);

-- 4. Verify users created
SELECT 
  username,
  email,
  role,
  is_active,
  LENGTH(password_hash) as hash_length,
  created_at
FROM users
WHERE email IN ('admin@disnaker.go.id', 'hi@disnaker.go.id');

-- ============================================
-- ✅ SELESAI! Sekarang coba login:
-- ============================================
-- 
-- Admin:
--   Email: admin@disnaker.go.id
--   Password: admin123
--
-- Bidang HI:
--   Email: hi@disnaker.go.id
--   Password: bidang123
--
-- ============================================
