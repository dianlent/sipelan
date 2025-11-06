-- ============================================
-- RENAME: bidang.id -> bidang.bidang_id
-- WARNING: This will affect all foreign keys and primary key
-- Run this BEFORE running ALL_IN_ONE_FIX.sql
-- ============================================

-- Step 1: Drop all foreign key constraints that reference bidang
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_bidang_id_fkey;
ALTER TABLE pengaduan DROP CONSTRAINT IF EXISTS pengaduan_bidang_id_fkey;
ALTER TABLE disposisi DROP CONSTRAINT IF EXISTS disposisi_dari_bidang_id_fkey;
ALTER TABLE disposisi DROP CONSTRAINT IF EXISTS disposisi_ke_bidang_id_fkey;

-- Step 2: Drop primary key constraint (akan recreate nanti)
ALTER TABLE bidang DROP CONSTRAINT IF EXISTS bidang_pkey;

-- Step 3: Rename column in bidang table
ALTER TABLE bidang RENAME COLUMN id TO bidang_id;

-- Step 4: Recreate primary key
ALTER TABLE bidang ADD PRIMARY KEY (bidang_id);

-- Step 5: Recreate foreign key constraints
ALTER TABLE users 
ADD CONSTRAINT users_bidang_id_fkey 
FOREIGN KEY (bidang_id) REFERENCES bidang(bidang_id) ON DELETE SET NULL;

ALTER TABLE pengaduan 
ADD CONSTRAINT pengaduan_bidang_id_fkey 
FOREIGN KEY (bidang_id) REFERENCES bidang(bidang_id) ON DELETE SET NULL;

ALTER TABLE disposisi 
ADD CONSTRAINT disposisi_dari_bidang_id_fkey 
FOREIGN KEY (dari_bidang_id) REFERENCES bidang(bidang_id) ON DELETE SET NULL;

ALTER TABLE disposisi 
ADD CONSTRAINT disposisi_ke_bidang_id_fkey 
FOREIGN KEY (ke_bidang_id) REFERENCES bidang(bidang_id) ON DELETE SET NULL;

-- Step 4: Update kode_bidang foreign key
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_kode_bidang_fkey;
ALTER TABLE users 
ADD CONSTRAINT users_kode_bidang_fkey 
FOREIGN KEY (kode_bidang) REFERENCES bidang(kode_bidang) ON DELETE SET NULL;

-- Step 5: Verify changes
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'bidang'
ORDER BY ordinal_position;

-- Expected: bidang_id instead of id

-- Check foreign keys
SELECT
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND ccu.table_name = 'bidang';
