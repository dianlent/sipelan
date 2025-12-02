-- ============================================
-- Add file_url column to pengaduan_status table
-- For storing file attachments in tanggapan
-- ============================================

-- Add file_url column
ALTER TABLE pengaduan_status 
ADD COLUMN IF NOT EXISTS file_url TEXT;

-- Add comment
COMMENT ON COLUMN pengaduan_status.file_url IS 'URL file lampiran untuk tanggapan (gambar/doc/pdf)';

-- Verify
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'pengaduan_status'
AND column_name = 'file_url';

-- Sample query to see tanggapan with files
SELECT 
  id,
  pengaduan_id,
  tanggapan,
  petugas,
  file_url,
  created_at
FROM pengaduan_status
WHERE file_url IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
