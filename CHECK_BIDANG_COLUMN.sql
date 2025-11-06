-- Check bidang table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'bidang'
ORDER BY ordinal_position;

-- Expected output should show:
-- id (or bidang_id) as the primary key column

-- Check if column is 'id' or 'bidang_id'
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'bidang' 
AND column_name IN ('id', 'bidang_id');

-- Check foreign keys referencing bidang
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

-- Check data in bidang table
SELECT * FROM bidang ORDER BY bidang_id LIMIT 10;
