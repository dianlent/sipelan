-- Fix: User Bidang Tidak Punya bidang_id
-- Run this in Supabase SQL Editor

-- 1. Check users dengan role bidang
SELECT 
    id,
    email,
    nama_lengkap,
    role,
    bidang_id,
    kode_bidang,
    created_at
FROM users
WHERE role = 'bidang'
ORDER BY bidang_id;

-- Expected: Setiap user bidang harus punya bidang_id yang sesuai

-- 2. Check bidang table
SELECT * FROM bidang ORDER BY id;

-- 3. Fix user bidang yang tidak punya bidang_id
-- Cara 1: Set bidang_id berdasarkan kode_bidang

UPDATE users
SET bidang_id = b.id
FROM bidang b
WHERE users.role = 'bidang'
AND users.kode_bidang = b.kode_bidang
AND users.bidang_id IS NULL;

-- Cara 2: Set manual per user (sesuaikan dengan data Anda)
-- UPDATE users SET bidang_id = 1, kode_bidang = 'HI' WHERE email = 'hi@disnaker.go.id';
-- UPDATE users SET bidang_id = 2, kode_bidang = 'LATTAS' WHERE email = 'lattas@disnaker.go.id';
-- UPDATE users SET bidang_id = 3, kode_bidang = 'PTPK' WHERE email = 'ptpk@disnaker.go.id';
-- UPDATE users SET bidang_id = 4, kode_bidang = 'BLK' WHERE email = 'blk@disnaker.go.id';
-- UPDATE users SET bidang_id = 5, kode_bidang = 'SEKRETARIAT' WHERE email = 'sekretariat@disnaker.go.id';

-- 4. Verify fix
SELECT 
    u.id,
    u.email,
    u.nama_lengkap,
    u.role,
    u.bidang_id,
    u.kode_bidang,
    b.nama_bidang
FROM users u
LEFT JOIN bidang b ON u.bidang_id = b.id
WHERE u.role = 'bidang'
ORDER BY u.bidang_id;

-- Expected: Semua user bidang punya bidang_id dan nama_bidang muncul
