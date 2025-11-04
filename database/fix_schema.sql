-- Fix Schema for existing database
-- Run this script if you already created the database and got the "value too long" error

-- Fix kode_bidang length from VARCHAR(10) to VARCHAR(20)
ALTER TABLE bidang ALTER COLUMN kode_bidang TYPE VARCHAR(20);

-- Fix email_bidang length from VARCHAR(100) to VARCHAR(255)  
ALTER TABLE bidang ALTER COLUMN email_bidang TYPE VARCHAR(255);

-- Fix username length from VARCHAR(50) to VARCHAR(100)
ALTER TABLE users ALTER COLUMN username TYPE VARCHAR(100);

-- Fix email length from VARCHAR(100) to VARCHAR(255)
ALTER TABLE users ALTER COLUMN email TYPE VARCHAR(255);

-- Fix nama_lengkap length from VARCHAR(100) to VARCHAR(255)
ALTER TABLE users ALTER COLUMN nama_lengkap TYPE VARCHAR(255);

-- Fix judul_pengaduan length from VARCHAR(200) to VARCHAR(255)
ALTER TABLE pengaduan ALTER COLUMN judul_pengaduan TYPE VARCHAR(255);

-- Fix lokasi_kejadian length from VARCHAR(200) to VARCHAR(255)
ALTER TABLE pengaduan ALTER COLUMN lokasi_kejadian TYPE VARCHAR(255);

-- Update the existing data if needed
UPDATE bidang SET kode_bidang = 'LATTAS' WHERE kode_bidang = 'LATTAS';
UPDATE bidang SET kode_bidang = 'PTPK' WHERE kode_bidang = 'PTPK';
UPDATE bidang SET kode_bidang = 'SEKRETARIAT' WHERE kode_bidang = 'SEKRETARIAT';

-- Verify the changes
SELECT 
    table_name, 
    column_name, 
    character_maximum_length 
FROM information_schema.columns 
WHERE table_name IN ('bidang', 'users', 'pengaduan') 
    AND data_type LIKE 'varchar%'
ORDER BY table_name, column_name;
