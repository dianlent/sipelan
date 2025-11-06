# Setup Database untuk Form Pengaduan

## Perubahan yang Dibuat

### 1. Database Schema
File migration: `database/add_reporter_info.sql`

Kolom baru yang ditambahkan ke tabel `pengaduan`:
- `nama_pelapor` - Nama pelapor (VARCHAR 255)
- `email_pelapor` - Email pelapor (VARCHAR 255)
- `no_telepon` - Nomor telepon pelapor (VARCHAR 50)
- `anonim` - Flag untuk pengaduan anonim (BOOLEAN)

**PENTING**: `user_id` sekarang nullable untuk mendukung pengaduan anonim tanpa login.

### 2. API Routes Baru

#### a. POST /api/pengaduan
- Menerima form data pengaduan
- Menyimpan langsung ke database Supabase
- Mengembalikan kode tracking yang di-generate otomatis
- Mendukung upload file bukti

#### b. GET /api/pengaduan/tracking/[kode]
- Mencari pengaduan berdasarkan kode tracking
- Menampilkan detail pengaduan dan timeline status

#### c. GET /api/categories
- Mengambil daftar kategori pengaduan dari database

### 3. Form Pengaduan (app/pengaduan/page.tsx)
- **TIDAK LAGI menggunakan localStorage**
- Submit langsung ke API `/api/pengaduan`
- Load kategori dari database via API
- Menampilkan kode tracking setelah berhasil submit

### 4. Tracking Page (app/tracking/page.tsx)
- **TIDAK LAGI menggunakan localStorage**
- Fetch data langsung dari API
- Menampilkan data real-time dari database

## Cara Setup

### Langkah 1: Jalankan Migration SQL
Buka Supabase Dashboard dan jalankan file SQL berikut:

```bash
# File yang perlu dijalankan
database/add_reporter_info.sql
```

**Atau jalankan manual di SQL Editor Supabase:**

```sql
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

-- Update policies
DROP POLICY IF EXISTS "Users can insert own pengaduan" ON pengaduan;

CREATE POLICY "Anyone can insert pengaduan" ON pengaduan
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view pengaduan by kode" ON pengaduan
    FOR SELECT USING (true);
```

### Langkah 2: Setup Environment Variables
Pastikan file `.env.local` memiliki variabel berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

### Langkah 3: Setup Storage Bucket (Opsional)
Jika ingin upload file bukti, buat bucket di Supabase Storage:

1. Buka Supabase Dashboard → Storage
2. Buat bucket baru dengan nama: `pengaduan-files`
3. Set policy untuk public access (atau sesuai kebutuhan)

### Langkah 4: Test Aplikasi
```bash
npm run dev
```

Akses:
- Form: http://localhost:5000/pengaduan
- Tracking: http://localhost:5000/tracking

## Fitur yang Berfungsi

✅ Submit pengaduan langsung ke database
✅ Auto-generate kode tracking (ADU-YYYY-####)
✅ Upload file bukti (optional)
✅ Pengaduan anonim (checkbox)
✅ Tracking pengaduan dengan kode
✅ Timeline status pengaduan
✅ Load kategori dari database

## Catatan Penting

⚠️ **LocalStorage sudah dihapus** - Semua data sekarang disimpan di database Supabase
⚠️ **RLS Policies** - Pastikan policies sudah benar agar public bisa submit dan tracking
⚠️ **File Upload** - Perlu setup storage bucket jika ingin fitur upload berfungsi

## Troubleshooting

### Error: "null value in column kode_pengaduan violates not-null constraint"
**Penyebab**: Trigger function untuk auto-generate kode_pengaduan belum dibuat atau tidak berjalan.

**Solusi**:
1. Jalankan SQL migration lengkap yang sudah include trigger function (lihat di atas)
2. Pastikan trigger sudah dibuat dengan query:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'trg_generate_kode_pengaduan';
   ```
3. Test trigger dengan insert manual:
   ```sql
   INSERT INTO pengaduan (kategori_id, judul_pengaduan, isi_pengaduan, nama_pelapor, email_pelapor, no_telepon, status)
   VALUES (1, 'Test', 'Test content', 'Test User', 'test@test.com', '08123456789', 'masuk')
   RETURNING kode_pengaduan;
   ```

### Error: "Missing Supabase environment variables"
- Pastikan `.env.local` sudah ada dan isinya benar
- Restart dev server setelah update environment variables

### Error: "Failed to save pengaduan"
- Check apakah migration SQL sudah dijalankan
- Check RLS policies di Supabase
- Check logs di console browser untuk detail error

### Kategori tidak muncul
- Pastikan tabel `kategori_pengaduan` sudah terisi data
- Jalankan insert default di `database/schema.sql`

### File upload gagal
- Pastikan bucket `pengaduan-files` sudah dibuat
- Check storage policies di Supabase

## Testing Flow

1. **Submit Pengaduan**:
   - Buka http://localhost:5000/pengaduan
   - Isi form lengkap
   - Klik Submit
   - Catat kode tracking yang muncul

2. **Tracking Pengaduan**:
   - Buka http://localhost:5000/tracking
   - Masukkan kode tracking
   - Klik Cari
   - Lihat detail dan timeline

3. **Verifikasi Database**:
   - Buka Supabase Dashboard → Table Editor
   - Check tabel `pengaduan` untuk data baru
   - Check tabel `pengaduan_status` untuk timeline
