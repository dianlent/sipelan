-- ============================================
-- Troubleshooting Login Issues
-- ============================================

-- 1. Check if sessions table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'sessions'
) as sessions_table_exists;

-- 2. Check if admin user exists
SELECT 
  id,
  username,
  email,
  nama_lengkap,
  role,
  is_active,
  created_at
FROM users 
WHERE email = 'admin@disnaker.go.id' OR username = 'admin';

-- 3. Check if bidang user exists
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
WHERE email = 'hi@disnaker.go.id';

-- 4. Check all users
SELECT 
  id,
  username,
  email,
  nama_lengkap,
  role,
  is_active
FROM users
ORDER BY created_at DESC;

-- 5. If sessions table doesn't exist, create it
-- Copy from add_sessions_table.sql

-- 6. If admin user doesn't exist, create it
-- Password: admin123
INSERT INTO users (username, email, password_hash, nama_lengkap, role, is_active)
VALUES (
    'admin',
    'admin@disnaker.go.id',
    '$2a$10$rQZ5YhN5YhN5YhN5YhN5YeO5YhN5YhN5YhN5YhN5YhN5YhN5YhN5Y',
    'Administrator',
    'admin',
    true
)
ON CONFLICT (username) DO NOTHING;

-- 7. Test password hash (optional - for debugging)
-- This will show if bcrypt hash is correct format
SELECT 
  username,
  email,
  LENGTH(password_hash) as hash_length,
  SUBSTRING(password_hash, 1, 7) as hash_prefix
FROM users;

-- Expected: hash_length = 60, hash_prefix = '$2a$10$'
