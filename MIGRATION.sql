-- Migration: Add reporter info and auto-generate kode_pengaduan
-- Run this in Supabase SQL Editor

-- Add reporter info columns to pengaduan table
ALTER TABLE pengaduan 
ADD COLUMN IF NOT EXISTS nama_pelapor VARCHAR(255),
ADD COLUMN IF NOT EXISTS email_pelapor VARCHAR(255),
ADD COLUMN IF NOT EXISTS no_telepon VARCHAR(50),
ADD COLUMN IF NOT EXISTS anonim BOOLEAN DEFAULT false;

-- Make user_id nullable for anonymous submissions
ALTER TABLE pengaduan 
ALTER COLUMN user_id DROP NOT NULL;

-- Make kode_pengaduan nullable to allow trigger to set it
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
    IF NEW.kode_pengaduan IS NULL OR NEW.kode_pengaduan = '' THEN
        year_part := EXTRACT(year FROM CURRENT_DATE)::TEXT;
        
        SELECT COALESCE(MAX(CAST(SUBSTRING(kode_pengaduan FROM 9) AS INTEGER)), 0) + 1
        INTO sequence_num
        FROM pengaduan
        WHERE kode_pengaduan LIKE 'ADU-' || year_part || '-%';
        
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
