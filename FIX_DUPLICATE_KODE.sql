-- Fix Duplicate Kode Pengaduan Issue
-- Run this in Supabase SQL Editor

-- Step 1: Drop existing trigger and function
DROP TRIGGER IF EXISTS trg_generate_kode_pengaduan ON pengaduan;
DROP FUNCTION IF EXISTS generate_kode_pengaduan();

-- Step 2: Create improved function with better collision handling
CREATE OR REPLACE FUNCTION generate_kode_pengaduan()
RETURNS TRIGGER AS $$
DECLARE
    year_part TEXT;
    sequence_num INTEGER;
    new_kode TEXT;
    max_attempts INTEGER := 100;
    attempt INTEGER := 0;
    kode_exists BOOLEAN;
BEGIN
    -- Only generate if kode_pengaduan is not provided
    IF NEW.kode_pengaduan IS NULL OR NEW.kode_pengaduan = '' THEN
        year_part := EXTRACT(year FROM CURRENT_DATE)::TEXT;
        
        -- Loop until we find a unique code
        LOOP
            attempt := attempt + 1;
            
            -- Get the next sequence number
            SELECT COALESCE(MAX(
                CASE 
                    WHEN kode_pengaduan ~ '^ADU-[0-9]{4}-[0-9]{4}$' 
                    THEN CAST(SUBSTRING(kode_pengaduan FROM 10 FOR 4) AS INTEGER)
                    ELSE 0
                END
            ), 0) + attempt INTO sequence_num
            FROM pengaduan
            WHERE kode_pengaduan LIKE 'ADU-' || year_part || '-%';
            
            -- Format the new code
            new_kode := 'ADU-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
            
            -- Check if this code already exists
            SELECT EXISTS(
                SELECT 1 FROM pengaduan WHERE kode_pengaduan = new_kode
            ) INTO kode_exists;
            
            -- If code doesn't exist, use it
            IF NOT kode_exists THEN
                NEW.kode_pengaduan := new_kode;
                EXIT;
            END IF;
            
            -- Prevent infinite loop
            IF attempt >= max_attempts THEN
                RAISE EXCEPTION 'Could not generate unique kode_pengaduan after % attempts', max_attempts;
            END IF;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create trigger
CREATE TRIGGER trg_generate_kode_pengaduan
    BEFORE INSERT ON pengaduan
    FOR EACH ROW
    EXECUTE FUNCTION generate_kode_pengaduan();

-- Step 4: Verify the trigger is created
SELECT 
    tgname as trigger_name,
    tgenabled as enabled,
    proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname = 'trg_generate_kode_pengaduan';

-- Step 5: Check for any duplicate kode_pengaduan in existing data
SELECT 
    kode_pengaduan, 
    COUNT(*) as count
FROM pengaduan
WHERE kode_pengaduan IS NOT NULL
GROUP BY kode_pengaduan
HAVING COUNT(*) > 1;

-- Step 6: If duplicates exist, fix them
DO $$
DECLARE
    dup_record RECORD;
    new_kode TEXT;
    counter INTEGER;
BEGIN
    FOR dup_record IN 
        SELECT kode_pengaduan, array_agg(id ORDER BY created_at) as ids
        FROM pengaduan
        WHERE kode_pengaduan IS NOT NULL
        GROUP BY kode_pengaduan
        HAVING COUNT(*) > 1
    LOOP
        counter := 1;
        -- Keep the first one, update the rest
        FOREACH new_kode IN ARRAY dup_record.ids[2:array_length(dup_record.ids, 1)]
        LOOP
            UPDATE pengaduan 
            SET kode_pengaduan = dup_record.kode_pengaduan || '-DUP' || counter
            WHERE id = new_kode::uuid;
            counter := counter + 1;
        END LOOP;
    END LOOP;
END $$;

-- Step 7: Test the function
-- This should create a unique kode automatically
-- INSERT INTO pengaduan (
--     kategori_id, 
--     judul_pengaduan, 
--     isi_pengaduan,
--     nama_pelapor,
--     email_pelapor,
--     status
-- ) VALUES (
--     1,
--     'Test Pengaduan',
--     'Test isi pengaduan',
--     'Test User',
--     'test@example.com',
--     'diterima'
-- ) RETURNING kode_pengaduan;

COMMIT;
