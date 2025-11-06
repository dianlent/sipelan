-- Quick Fix: Pengaduan Tidak Muncul di Bidang Dashboard
-- Run this in Supabase SQL Editor

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

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_disposisi_pengaduan_id ON disposisi(pengaduan_id);
CREATE INDEX IF NOT EXISTS idx_disposisi_ke_bidang_id ON disposisi(ke_bidang_id);

-- 3. Enable RLS
ALTER TABLE disposisi ENABLE ROW LEVEL SECURITY;

-- 4. Drop and recreate policies
DROP POLICY IF EXISTS "Allow read disposisi" ON disposisi;
DROP POLICY IF EXISTS "Allow insert disposisi" ON disposisi;

CREATE POLICY "Allow read disposisi" ON disposisi FOR SELECT USING (true);
CREATE POLICY "Allow insert disposisi" ON disposisi FOR INSERT WITH CHECK (true);

-- 5. Grant permissions
GRANT ALL ON disposisi TO authenticated;
GRANT ALL ON disposisi TO anon;
GRANT USAGE, SELECT ON SEQUENCE disposisi_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE disposisi_id_seq TO anon;

-- 6. Fix existing pengaduan - sync bidang_id from disposisi
UPDATE pengaduan p
SET bidang_id = d.ke_bidang_id
FROM disposisi d
WHERE p.id = d.pengaduan_id
AND p.bidang_id IS NULL;

-- 7. Fix status for disposed pengaduan
UPDATE pengaduan p
SET status = 'terdisposisi'
FROM disposisi d
WHERE p.id = d.pengaduan_id
AND p.status = 'terverifikasi';

-- 8. Verify - Check pengaduan yang seharusnya muncul di bidang
SELECT 
    p.kode_pengaduan,
    p.judul_pengaduan,
    p.status,
    p.bidang_id,
    b.nama_bidang,
    p.created_at
FROM pengaduan p
LEFT JOIN bidang b ON p.bidang_id = b.id
WHERE p.bidang_id IS NOT NULL
AND p.status IN ('terdisposisi', 'tindak_lanjut', 'selesai')
ORDER BY p.created_at DESC;
