-- ============================================
-- ALL-IN-ONE FIX: Pengaduan Muncul di Bidang Dashboard
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- 1. Create disposisi table (if not exists)
CREATE TABLE IF NOT EXISTS disposisi (
    id SERIAL PRIMARY KEY,
    pengaduan_id UUID REFERENCES pengaduan(id) ON DELETE CASCADE,
    dari_bidang_id INTEGER REFERENCES bidang(id) ON DELETE SET NULL,
    ke_bidang_id INTEGER REFERENCES bidang(id) ON DELETE SET NULL,
    keterangan TEXT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_disposisi_pengaduan_id ON disposisi(pengaduan_id);
CREATE INDEX IF NOT EXISTS idx_disposisi_dari_bidang_id ON disposisi(dari_bidang_id);
CREATE INDEX IF NOT EXISTS idx_disposisi_ke_bidang_id ON disposisi(ke_bidang_id);
CREATE INDEX IF NOT EXISTS idx_disposisi_created_at ON disposisi(created_at DESC);

-- 3. Enable RLS
ALTER TABLE disposisi ENABLE ROW LEVEL SECURITY;

-- 4. Drop and recreate policies
DROP POLICY IF EXISTS "Allow read disposisi" ON disposisi;
DROP POLICY IF EXISTS "Allow insert disposisi" ON disposisi;
DROP POLICY IF EXISTS "Allow update disposisi" ON disposisi;

CREATE POLICY "Allow read disposisi" ON disposisi FOR SELECT USING (true);
CREATE POLICY "Allow insert disposisi" ON disposisi FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update disposisi" ON disposisi FOR UPDATE USING (true);

-- 5. Grant permissions
GRANT ALL ON disposisi TO authenticated;
GRANT ALL ON disposisi TO anon;
GRANT USAGE, SELECT ON SEQUENCE disposisi_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE disposisi_id_seq TO anon;

-- 6. Fix user bidang - Set bidang_id berdasarkan kode_bidang
UPDATE users u
SET bidang_id = b.bidang_id
FROM bidang b
WHERE u.role = 'bidang'
AND u.kode_bidang = b.kode_bidang
AND u.bidang_id IS NULL;

-- 7. Sync pengaduan.bidang_id dari disposisi
UPDATE pengaduan p
SET bidang_id = d.ke_bidang_id
FROM disposisi d
WHERE p.id = d.pengaduan_id
AND (p.bidang_id IS NULL OR p.bidang_id != d.ke_bidang_id);

-- 8. Fix status pengaduan yang sudah didisposisi
UPDATE pengaduan p
SET status = 'terdisposisi'
FROM disposisi d
WHERE p.id = d.pengaduan_id
AND p.status = 'terverifikasi';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check 1: Users bidang dengan bidang_id
SELECT 
    u.id,
    u.email,
    u.nama_lengkap,
    u.bidang_id,
    u.kode_bidang,
    b.nama_bidang,
    CASE 
        WHEN u.bidang_id IS NOT NULL AND b.bidang_id IS NOT NULL THEN '✅ OK'
        WHEN u.bidang_id IS NULL THEN '❌ NULL bidang_id'
        ELSE '❌ Invalid bidang_id'
    END as status
FROM users u
LEFT JOIN bidang b ON u.bidang_id = b.bidang_id
WHERE u.role = 'bidang'
ORDER BY u.bidang_id;

-- Check 2: Pengaduan dengan bidang_id
SELECT 
    p.kode_pengaduan,
    p.judul_pengaduan,
    p.status,
    p.bidang_id,
    b.nama_bidang,
    p.created_at,
    CASE 
        WHEN p.bidang_id IS NOT NULL AND p.status IN ('terdisposisi', 'tindak_lanjut', 'selesai') THEN '✅ OK'
        WHEN p.bidang_id IS NULL AND p.status IN ('terdisposisi', 'tindak_lanjut', 'selesai') THEN '❌ Missing bidang_id'
        ELSE '⚠️ Not disposed yet'
    END as status_check
FROM pengaduan p
LEFT JOIN bidang b ON p.bidang_id = b.bidang_id
ORDER BY p.created_at DESC
LIMIT 20;

-- Check 3: Disposisi match dengan pengaduan
SELECT 
    p.kode_pengaduan,
    d.ke_bidang_id as disposisi_ke,
    p.bidang_id as pengaduan_bidang_id,
    b.nama_bidang,
    CASE 
        WHEN d.ke_bidang_id = p.bidang_id THEN '✅ MATCH'
        ELSE '❌ MISMATCH'
    END as match_status
FROM disposisi d
JOIN pengaduan p ON d.pengaduan_id = p.id
LEFT JOIN bidang b ON p.bidang_id = b.bidang_id
ORDER BY d.created_at DESC
LIMIT 10;

-- Check 4: Count pengaduan per bidang
SELECT 
    b.bidang_id,
    b.kode_bidang,
    b.nama_bidang,
    COUNT(p.id) as total_pengaduan,
    COUNT(CASE WHEN p.status = 'terdisposisi' THEN 1 END) as terdisposisi,
    COUNT(CASE WHEN p.status = 'tindak_lanjut' THEN 1 END) as tindak_lanjut,
    COUNT(CASE WHEN p.status = 'selesai' THEN 1 END) as selesai
FROM bidang b
LEFT JOIN pengaduan p ON b.bidang_id = p.bidang_id
GROUP BY b.bidang_id, b.kode_bidang, b.nama_bidang
ORDER BY b.bidang_id;

-- ============================================
-- FINAL RESULT
-- ============================================
-- Pengaduan yang HARUS MUNCUL di bidang dashboard
-- Ganti bidang_id sesuai kebutuhan (1=HI, 2=LATTAS, 3=PTPK, 4=BLK, 5=SEKRETARIAT)

SELECT 
    p.id,
    p.kode_pengaduan,
    p.judul_pengaduan,
    p.status,
    p.bidang_id,
    b.nama_bidang,
    p.nama_pelapor,
    p.created_at
FROM pengaduan p
LEFT JOIN bidang b ON p.bidang_id = b.bidang_id
WHERE p.bidang_id IS NOT NULL
AND p.status IN ('terdisposisi', 'tindak_lanjut', 'selesai')
ORDER BY p.created_at DESC;

-- ============================================
-- DONE!
-- ============================================
-- Setelah run script ini:
-- 1. Semua user bidang punya bidang_id
-- 2. Semua pengaduan terdisposisi punya bidang_id
-- 3. Table disposisi exists
-- 4. Pengaduan siap muncul di bidang dashboard
-- ============================================
