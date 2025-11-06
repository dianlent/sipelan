-- Add reporter info columns to pengaduan table
-- This allows anonymous submissions without requiring a user account

ALTER TABLE pengaduan 
ADD COLUMN IF NOT EXISTS nama_pelapor VARCHAR(255),
ADD COLUMN IF NOT EXISTS email_pelapor VARCHAR(255),
ADD COLUMN IF NOT EXISTS no_telepon VARCHAR(50),
ADD COLUMN IF NOT EXISTS anonim BOOLEAN DEFAULT false;

-- Make user_id nullable for anonymous submissions
ALTER TABLE pengaduan 
ALTER COLUMN user_id DROP NOT NULL;

-- Make kode_pengaduan nullable temporarily to allow trigger to set it
ALTER TABLE pengaduan 
ALTER COLUMN kode_pengaduan DROP NOT NULL;

-- Create or replace function to generate tracking code
CREATE OR REPLACE FUNCTION generate_kode_pengaduan()
RETURNS TRIGGER AS $$
DECLARE
    year_part TEXT;
    sequence_num INTEGER;
    new_kode TEXT;
BEGIN
    -- Only generate if kode_pengaduan is not provided
    IF NEW.kode_pengaduan IS NULL OR NEW.kode_pengaduan = '' THEN
        year_part := EXTRACT(year FROM CURRENT_DATE)::TEXT;
        
        -- Get the next sequence number for this year
        SELECT COALESCE(MAX(CAST(SUBSTRING(kode_pengaduan FROM 9) AS INTEGER)), 0) + 1
        INTO sequence_num
        FROM pengaduan
        WHERE kode_pengaduan LIKE 'ADU-' || year_part || '-%';
        
        -- Generate the code: ADU-YYYY-####
        new_kode := 'ADU-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
        NEW.kode_pengaduan := new_kode;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS trg_generate_kode_pengaduan ON pengaduan;

-- Create trigger for auto-generating kode pengaduan
CREATE TRIGGER trg_generate_kode_pengaduan
    BEFORE INSERT ON pengaduan
    FOR EACH ROW
    EXECUTE FUNCTION generate_kode_pengaduan();

-- Update policies (drop all existing insert and select policies first)
DROP POLICY IF EXISTS "Users can insert own pengaduan" ON pengaduan;
DROP POLICY IF EXISTS "Anyone can insert pengaduan" ON pengaduan;
DROP POLICY IF EXISTS "Users can view own pengaduan" ON pengaduan;
DROP POLICY IF EXISTS "Anyone can view pengaduan by kode" ON pengaduan;

CREATE POLICY "Anyone can insert pengaduan" ON pengaduan
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view pengaduan by kode" ON pengaduan
    FOR SELECT USING (true);

COMMENT ON COLUMN pengaduan.nama_pelapor IS 'Nama pelapor untuk pengaduan anonim atau non-login';
COMMENT ON COLUMN pengaduan.email_pelapor IS 'Email pelapor untuk pengaduan anonim atau non-login';
COMMENT ON COLUMN pengaduan.no_telepon IS 'Nomor telepon pelapor untuk pengaduan anonim atau non-login';
COMMENT ON COLUMN pengaduan.anonim IS 'Tandai jika pelapor ingin tetap anonim';
