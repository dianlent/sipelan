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

-- Create disposisi table if not exists
CREATE TABLE IF NOT EXISTS disposisi (
    id SERIAL PRIMARY KEY,
    pengaduan_id UUID REFERENCES pengaduan(id) ON DELETE CASCADE,
    dari_bidang_id INTEGER REFERENCES bidang(id) ON DELETE SET NULL,
    ke_bidang_id INTEGER REFERENCES bidang(id) ON DELETE SET NULL,
    keterangan TEXT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for disposisi table
CREATE INDEX IF NOT EXISTS idx_disposisi_pengaduan_id ON disposisi(pengaduan_id);
CREATE INDEX IF NOT EXISTS idx_disposisi_dari_bidang_id ON disposisi(dari_bidang_id);
CREATE INDEX IF NOT EXISTS idx_disposisi_ke_bidang_id ON disposisi(ke_bidang_id);
CREATE INDEX IF NOT EXISTS idx_disposisi_created_at ON disposisi(created_at DESC);

-- Enable RLS for disposisi
ALTER TABLE disposisi ENABLE ROW LEVEL SECURITY;

-- Drop existing disposisi policies
DROP POLICY IF EXISTS "Allow read disposisi" ON disposisi;
DROP POLICY IF EXISTS "Allow insert disposisi" ON disposisi;
DROP POLICY IF EXISTS "Allow update disposisi" ON disposisi;

-- Create disposisi policies
CREATE POLICY "Allow read disposisi" ON disposisi
    FOR SELECT USING (true);

CREATE POLICY "Allow insert disposisi" ON disposisi
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update disposisi" ON disposisi
    FOR UPDATE USING (true);

-- Grant permissions for disposisi
GRANT ALL ON disposisi TO authenticated;
GRANT ALL ON disposisi TO anon;
GRANT USAGE, SELECT ON SEQUENCE disposisi_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE disposisi_id_seq TO anon;
