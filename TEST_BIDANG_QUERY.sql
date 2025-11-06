-- Test query untuk debug error bidang_1.id

-- 1. Simple query tanpa join
SELECT 
    id,
    kode_pengaduan,
    judul_pengaduan,
    status,
    bidang_id,
    created_at
FROM pengaduan
WHERE bidang_id = 1
AND status IN ('terdisposisi', 'tindak_lanjut', 'selesai')
ORDER BY created_at DESC
LIMIT 10;

-- 2. Query dengan join bidang (manual)
SELECT 
    p.id,
    p.kode_pengaduan,
    p.judul_pengaduan,
    p.status,
    p.bidang_id,
    b.bidang_id as bidang_table_id,
    b.nama_bidang,
    b.kode_bidang,
    p.created_at
FROM pengaduan p
LEFT JOIN bidang b ON p.bidang_id = b.bidang_id
WHERE p.bidang_id = 1
AND p.status IN ('terdisposisi', 'tindak_lanjut', 'selesai')
ORDER BY p.created_at DESC
LIMIT 10;

-- 3. Check if bidang column is id or bidang_id
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bidang' AND column_name='id') 
        THEN 'Column is: id'
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bidang' AND column_name='bidang_id') 
        THEN 'Column is: bidang_id'
        ELSE 'ERROR: No primary key column found!'
    END as bidang_pk_column;

-- 4. Test data exists
SELECT 
    COUNT(*) as total_pengaduan,
    COUNT(CASE WHEN bidang_id IS NOT NULL THEN 1 END) as dengan_bidang,
    COUNT(CASE WHEN bidang_id = 1 THEN 1 END) as bidang_1,
    COUNT(CASE WHEN status IN ('terdisposisi', 'tindak_lanjut', 'selesai') THEN 1 END) as status_valid
FROM pengaduan;

-- 5. Expected results for bidang_id = 1
SELECT 
    p.kode_pengaduan,
    p.status,
    p.bidang_id,
    b.nama_bidang
FROM pengaduan p
LEFT JOIN bidang b ON p.bidang_id = b.bidang_id
WHERE p.bidang_id = 1
LIMIT 5;
