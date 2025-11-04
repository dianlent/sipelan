-- ============================================================================
-- SCRIPT UNTUK MEMBUAT USER ADMIN
-- ============================================================================
-- Password: admin123 (sudah di-hash dengan bcrypt)
-- 
-- Cara menggunakan:
-- 1. Buka Supabase Dashboard
-- 2. Pilih project Anda
-- 3. Klik "SQL Editor" di sidebar
-- 4. Copy-paste script di bawah ini
-- 5. Klik "Run" atau tekan Ctrl+Enter
-- ============================================================================

-- Insert user admin
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
);

-- Verifikasi user admin
SELECT 
    id,
    username,
    email,
    nama_lengkap,
    role,
    is_active,
    created_at
FROM users
WHERE role = 'admin';

-- Catatan:
-- Username: admin
-- Email: admin@sipelan.com
-- Password: admin123
-- Role: admin
