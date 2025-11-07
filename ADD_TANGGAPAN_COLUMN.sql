-- Add tanggapan and petugas columns to pengaduan_status table
ALTER TABLE pengaduan_status 
ADD COLUMN IF NOT EXISTS tanggapan TEXT,
ADD COLUMN IF NOT EXISTS petugas VARCHAR(255);

-- Add comment to columns
COMMENT ON COLUMN pengaduan_status.tanggapan IS 'Tanggapan/keterangan dari bidang terkait';
COMMENT ON COLUMN pengaduan_status.petugas IS 'Nama petugas yang memberikan tanggapan';
