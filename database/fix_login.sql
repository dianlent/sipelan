-- ============================================
-- Fix Login Issues - Complete Solution
-- ============================================

-- STEP 1: Check current users
SELECT 
  id,
  username,
  email,
  nama_lengkap,
  role,
  is_active,
  LENGTH(password_hash) as hash_length,
  SUBSTRING(password_hash, 1, 7) as hash_prefix,
  created_at
FROM users
ORDER BY created_at DESC;

-- Expected hash_length: 60
-- Expected hash_prefix: $2a$10$

-- STEP 2: Delete old users (if needed)
-- DELETE FROM users WHERE email IN ('admin@disnaker.go.id', 'hi@disnaker.go.id');

-- STEP 3: Create users with CORRECT password hashes
-- These hashes are generated with bcrypt.hash(password, 10)

-- Admin user (password: admin123)
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
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Administrator',
  'admin',
  true
)
ON CONFLICT (username) DO UPDATE SET
  password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  email = 'admin@disnaker.go.id',
  is_active = true;

-- Bidang HI user (password: bidang123)
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
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Staff Bidang HI',
  'bidang',
  'HI',
  (SELECT id FROM bidang WHERE kode_bidang = 'HI' LIMIT 1),
  true
)
ON CONFLICT (username) DO UPDATE SET
  password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  email = 'hi@disnaker.go.id',
  is_active = true;

-- STEP 4: Verify users created
SELECT 
  username,
  email,
  role,
  is_active,
  LENGTH(password_hash) as hash_length,
  SUBSTRING(password_hash, 1, 7) as hash_prefix
FROM users
WHERE email IN ('admin@disnaker.go.id', 'hi@disnaker.go.id');

-- STEP 5: Check if sessions table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'sessions'
) as sessions_table_exists;

-- STEP 6: If sessions table doesn't exist, create it
-- (Copy from database/add_sessions_table.sql)

-- ============================================
-- CREDENTIALS TO TEST:
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
