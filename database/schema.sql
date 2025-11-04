-- Sipelan Database Schema
-- Sistem Pengaduan Layanan Online Naker
-- Version: 2.0 (Fixed column lengths)

-- Drop existing tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS tanggapan CASCADE;
DROP TABLE IF EXISTS disposisi CASCADE;
DROP TABLE IF EXISTS pengaduan_status CASCADE;
DROP TABLE IF EXISTS pengaduan CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS bidang CASCADE;
DROP TABLE IF EXISTS kategori_pengaduan CASCADE;

-- Kategori Pengaduan
CREATE TABLE kategori_pengaduan (
    id SERIAL PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL UNIQUE,
    deskripsi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bidang/Unit Kerja
CREATE TABLE bidang (
    id SERIAL PRIMARY KEY,
    nama_bidang VARCHAR(100) NOT NULL UNIQUE,
    kode_bidang VARCHAR(20) NOT NULL UNIQUE,
    email_bidang VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users/Pengguna
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'masyarakat',
    bidang_id INTEGER REFERENCES bidang(id),
    kode_bidang VARCHAR(20) REFERENCES bidang(kode_bidang),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pengaduan
CREATE TABLE pengaduan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    kode_pengaduan VARCHAR(20) NOT NULL UNIQUE,
    user_id UUID REFERENCES users(id),
    kategori_id INTEGER REFERENCES kategori_pengaduan(id),
    judul_pengaduan VARCHAR(255) NOT NULL,
    isi_pengaduan TEXT NOT NULL,
    lokasi_kejadian VARCHAR(255),
    tanggal_kejadian DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'diterima',
    bidang_id INTEGER REFERENCES bidang(id),
    file_bukti VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tracking Status Pengaduan
CREATE TABLE pengaduan_status (
    id SERIAL PRIMARY KEY,
    pengaduan_id UUID REFERENCES pengaduan(id),
    status VARCHAR(20) NOT NULL,
    keterangan TEXT,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disposisi Pengaduan
CREATE TABLE disposisi (
    id SERIAL PRIMARY KEY,
    pengaduan_id UUID REFERENCES pengaduan(id),
    dari_bidang_id INTEGER REFERENCES bidang(id),
    ke_bidang_id INTEGER REFERENCES bidang(id),
    keterangan TEXT,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tanggapan Pengaduan
CREATE TABLE tanggapan (
    id SERIAL PRIMARY KEY,
    pengaduan_id UUID REFERENCES pengaduan(id),
    user_id UUID REFERENCES users(id),
    isi_tanggapan TEXT NOT NULL,
    file_lampiran VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default data
INSERT INTO kategori_pengaduan (nama_kategori, deskripsi) VALUES
('Pengupahan', 'Pengaduan terkait masalah gaji, upah minimum, tunjangan'),
('Ketenagakerjaan', 'Pengaduan terkait PHK, kontrak kerja, jam kerja'),
('K3', 'Pengaduan terkait keselamatan dan kesehatan kerja'),
('Pelatihan Kerja', 'Pengaduan terkait program pelatihan dan penempatan kerja'),
('Lainnya', 'Pengaduan yang tidak termasuk dalam kategori di atas');

INSERT INTO bidang (nama_bidang, kode_bidang, email_bidang) VALUES
('Bidang Hubungan Industrial', 'HI', 'hi@disnaker.go.id'),
('Bidang Latihan Kerja dan Produktivitas', 'LATTAS', 'lattas@disnaker.go.id'),
('Bidang Penempatan Tenaga Kerja dan Perluasan Kesempatan Kerja', 'PTPK', 'ptpk@disnaker.go.id'),
('UPTD BLK Pati', 'BLK', 'blkpati@disnaker.go.id'),
('Sekretariat', 'SEKRETARIAT', 'sekretariat@disnaker.go.id');

-- Create indexes for better performance
CREATE INDEX idx_pengaduan_kode ON pengaduan(kode_pengaduan);
CREATE INDEX idx_pengaduan_user ON pengaduan(user_id);
CREATE INDEX idx_pengaduan_status ON pengaduan(status);
CREATE INDEX idx_pengaduan_created ON pengaduan(created_at);
CREATE INDEX idx_pengaduan_status_pengaduan ON pengaduan_status(pengaduan_id);
CREATE INDEX idx_disposisi_pengaduan ON disposisi(pengaduan_id);
CREATE INDEX idx_tanggapan_pengaduan ON tanggapan(pengaduan_id);

-- Create function to generate tracking code
CREATE OR REPLACE FUNCTION generate_kode_pengaduan()
RETURNS TRIGGER AS $$
DECLARE
    year_part TEXT;
    sequence_num INTEGER;
    kode_pengaduan TEXT;
BEGIN
    year_part := EXTRACT(year FROM CURRENT_DATE)::TEXT;
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(kode_pengaduan FROM 9) AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM pengaduan
    WHERE kode_pengaduan LIKE 'ADU-' || year_part || '-%';
    
    kode_pengaduan := 'ADU-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
    NEW.kode_pengaduan := kode_pengaduan;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generating kode pengaduan
CREATE TRIGGER trg_generate_kode_pengaduan
    BEFORE INSERT ON pengaduan
    FOR EACH ROW
    EXECUTE FUNCTION generate_kode_pengaduan();

-- RLS (Row Level Security) for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengaduan ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengaduan_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE disposisi ENABLE ROW LEVEL SECURITY;
ALTER TABLE tanggapan ENABLE ROW LEVEL SECURITY;

-- Policy for users can only see their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Policy for users can insert their own data
CREATE POLICY "Users can insert own data" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy for users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Policy for pengaduan access
CREATE POLICY "Users can view own pengaduan" ON pengaduan
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pengaduan" ON pengaduan
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pengaduan" ON pengaduan
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for bidang users to access relevant pengaduan
CREATE POLICY "Bidang users can view assigned pengaduan" ON pengaduan
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.bidang_id = pengaduan.bidang_id
        )
    );

-- Verification query to check column lengths
SELECT 
    table_name, 
    column_name, 
    character_maximum_length,
    data_type
FROM information_schema.columns 
WHERE table_name IN ('bidang', 'users', 'pengaduan', 'kategori_pengaduan', 'disposisi', 'tanggapan', 'pengaduan_status') 
    AND data_type LIKE 'varchar%'
ORDER BY table_name, ordinal_position;
