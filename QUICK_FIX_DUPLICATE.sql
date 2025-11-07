-- QUICK FIX: Duplicate Kode Pengaduan
-- Copy and paste this entire script into Supabase SQL Editor and run it

-- Step 1: Fix existing duplicates immediately
DO $$
DECLARE
    dup_record RECORD;
    counter INTEGER;
    new_id UUID;
BEGIN
    RAISE NOTICE 'Checking for duplicates...';
    
    FOR dup_record IN 
        SELECT kode_pengaduan, array_agg(id ORDER BY created_at) as ids
        FROM pengaduan
        WHERE kode_pengaduan IS NOT NULL
        GROUP BY kode_pengaduan
        HAVING COUNT(*) > 1
    LOOP
        counter := 1;
        RAISE NOTICE 'Found duplicate: %', dup_record.kode_pengaduan;
        
        -- Keep the first one, update the rest
        FOREACH new_id IN ARRAY dup_record.ids[2:array_length(dup_record.ids, 1)]
        LOOP
            UPDATE pengaduan 
            SET kode_pengaduan = dup_record.kode_pengaduan || '-R' || counter
            WHERE id = new_id;
            
            RAISE NOTICE 'Updated % to %', new_id, dup_record.kode_pengaduan || '-R' || counter;
            counter := counter + 1;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Duplicate fix completed!';
END $$;

-- Step 2: Recreate trigger with advisory lock to prevent race conditions
DROP TRIGGER IF EXISTS trg_generate_kode_pengaduan ON pengaduan;
DROP FUNCTION IF EXISTS generate_kode_pengaduan();

CREATE OR REPLACE FUNCTION generate_kode_pengaduan()
RETURNS TRIGGER AS $$
DECLARE
    year_part TEXT;
    sequence_num INTEGER;
    new_kode TEXT;
    attempt INTEGER := 0;
    max_attempts INTEGER := 100;
    lock_key BIGINT;
    random_suffix TEXT;
BEGIN
    -- Only generate if kode_pengaduan is not provided
    IF NEW.kode_pengaduan IS NULL OR NEW.kode_pengaduan = '' THEN
        year_part := EXTRACT(year FROM CURRENT_DATE)::TEXT;
        
        -- Use advisory lock to prevent concurrent access
        -- Lock key based on year to allow different years to process concurrently
        lock_key := ('x' || md5('pengaduan_kode_' || year_part))::bit(64)::bigint;
        
        -- Acquire advisory lock (will wait if another transaction has it)
        PERFORM pg_advisory_xact_lock(lock_key);
        
        LOOP
            -- Get next sequence number
            SELECT COALESCE(MAX(
                CASE 
                    WHEN kode_pengaduan ~ '^ADU-[0-9]{4}-[0-9]{4}(-[A-Z0-9]+)?$' 
                    THEN CAST(SUBSTRING(kode_pengaduan FROM 10 FOR 4) AS INTEGER)
                    ELSE 0
                END
            ), 0) + 1 INTO sequence_num
            FROM pengaduan
            WHERE kode_pengaduan LIKE 'ADU-' || year_part || '-%';
            
            new_kode := 'ADU-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
            
            -- Double check if exists (should not happen with lock, but safety check)
            IF NOT EXISTS(SELECT 1 FROM pengaduan WHERE kode_pengaduan = new_kode) THEN
                NEW.kode_pengaduan := new_kode;
                EXIT;
            END IF;
            
            attempt := attempt + 1;
            IF attempt >= max_attempts THEN
                -- Use timestamp + random suffix as ultimate fallback
                random_suffix := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 4));
                NEW.kode_pengaduan := 'ADU-' || year_part || '-' || 
                                     LPAD((EXTRACT(EPOCH FROM CLOCK_TIMESTAMP())::BIGINT % 10000)::TEXT, 4, '0') || 
                                     '-' || random_suffix;
                
                RAISE WARNING 'Used fallback kode_pengaduan after % attempts: %', max_attempts, NEW.kode_pengaduan;
                EXIT;
            END IF;
        END LOOP;
        
        -- Advisory lock is automatically released at transaction end
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_kode_pengaduan
    BEFORE INSERT ON pengaduan
    FOR EACH ROW
    EXECUTE FUNCTION generate_kode_pengaduan();

-- Step 3: Verify
SELECT 
    'Trigger Status' as check_type,
    tgname as name,
    CASE tgenabled 
        WHEN 'O' THEN 'ENABLED ✓'
        ELSE 'DISABLED ✗'
    END as status
FROM pg_trigger
WHERE tgname = 'trg_generate_kode_pengaduan'

UNION ALL

SELECT 
    'Duplicate Check' as check_type,
    'Total Duplicates' as name,
    COUNT(*)::TEXT || ' rows' as status
FROM (
    SELECT kode_pengaduan
    FROM pengaduan
    WHERE kode_pengaduan IS NOT NULL
    GROUP BY kode_pengaduan
    HAVING COUNT(*) > 1
) dup;

-- Done!
SELECT '✓ Quick fix completed successfully!' as message;
