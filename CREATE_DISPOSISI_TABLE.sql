-- ============================================
-- CREATE TABLE: disposisi
-- ============================================
-- This table stores the history of pengaduan dispositions

-- Drop table if exists (untuk clean install)
DROP TABLE IF EXISTS disposisi CASCADE;

-- Create disposisi table
CREATE TABLE disposisi (
    id SERIAL PRIMARY KEY,
    pengaduan_id UUID REFERENCES pengaduan(id) ON DELETE CASCADE,
    dari_bidang_id INTEGER REFERENCES bidang(id) ON DELETE SET NULL,
    ke_bidang_id INTEGER REFERENCES bidang(id) ON DELETE SET NULL,
    keterangan TEXT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_disposisi_pengaduan_id ON disposisi(pengaduan_id);
CREATE INDEX idx_disposisi_dari_bidang_id ON disposisi(dari_bidang_id);
CREATE INDEX idx_disposisi_ke_bidang_id ON disposisi(ke_bidang_id);
CREATE INDEX idx_disposisi_created_at ON disposisi(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE disposisi ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow read disposisi" ON disposisi;
DROP POLICY IF EXISTS "Allow insert disposisi" ON disposisi;
DROP POLICY IF EXISTS "Allow update disposisi" ON disposisi;

-- Create policies for public access (adjust based on your needs)
-- Policy: Anyone can read disposisi
CREATE POLICY "Allow read disposisi" ON disposisi
    FOR SELECT
    USING (true);

-- Policy: Authenticated users can insert disposisi
CREATE POLICY "Allow insert disposisi" ON disposisi
    FOR INSERT
    WITH CHECK (true);

-- Policy: Authenticated users can update disposisi
CREATE POLICY "Allow update disposisi" ON disposisi
    FOR UPDATE
    USING (true);

-- Grant permissions
GRANT ALL ON disposisi TO authenticated;
GRANT ALL ON disposisi TO anon;
GRANT USAGE, SELECT ON SEQUENCE disposisi_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE disposisi_id_seq TO anon;

-- Verify table created
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'disposisi'
ORDER BY ordinal_position;

-- ============================================
-- DONE!
-- ============================================
-- Table disposisi created successfully
-- Now you can use the disposisi API
