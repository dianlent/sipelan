# 🔧 Fix: Disposisi Table Error

## ❌ Error Message:
```
Gagal menyimpan disposisi: Could not find the 'dari_bidang_id' column of 'disposisi' in the schema cache
```

## 🔍 Root Cause:
Tabel `disposisi` belum dibuat di database Supabase.

## ✅ Solution: Create Disposisi Table

### Step 1: Buka Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select project: **pdsfruupgjezqzigncjv**
3. Click **SQL Editor** (sidebar kiri)

### Step 2: Run SQL Script

Copy dan paste SQL berikut, lalu klik **Run**:

```sql
-- ============================================
-- CREATE TABLE: disposisi
-- ============================================

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

-- Create policies for public access
CREATE POLICY "Allow read disposisi" ON disposisi
    FOR SELECT
    USING (true);

CREATE POLICY "Allow insert disposisi" ON disposisi
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow update disposisi" ON disposisi
    FOR UPDATE
    USING (true);

-- Grant permissions
GRANT ALL ON disposisi TO authenticated;
GRANT ALL ON disposisi TO anon;
GRANT USAGE, SELECT ON SEQUENCE disposisi_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE disposisi_id_seq TO anon;
```

### Step 3: Verify Table Created

Run query berikut untuk verify:

```sql
-- Check table structure
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'disposisi'
ORDER BY ordinal_position;
```

**Expected Output:**
```
table_name  | column_name      | data_type                  | is_nullable
disposisi   | id               | integer                    | NO
disposisi   | pengaduan_id     | uuid                       | YES
disposisi   | dari_bidang_id   | integer                    | YES
disposisi   | ke_bidang_id     | integer                    | YES
disposisi   | keterangan       | text                       | YES
disposisi   | user_id          | uuid                       | YES
disposisi   | created_at       | timestamp with time zone   | YES
```

### Step 4: Test Disposisi

1. **Refresh browser** (Ctrl + Shift + R)
2. **Login sebagai admin**
3. **Buka /admin page**
4. **Klik Verifikasi** pada pengaduan
5. **Klik Disposisi** → Pilih bidang → Submit
6. **Success!** ✅

## 📊 Table Structure

### disposisi table
```sql
id              SERIAL      Primary Key
pengaduan_id    UUID        Foreign Key → pengaduan(id)
dari_bidang_id  INTEGER     Foreign Key → bidang(id) (NULL = dari admin)
ke_bidang_id    INTEGER     Foreign Key → bidang(id) (bidang tujuan)
keterangan      TEXT        Catatan disposisi
user_id         UUID        Foreign Key → users(id) (admin yang disposisi)
created_at      TIMESTAMP   Timestamp otomatis
```

### Purpose
Menyimpan **history disposisi**:
- Siapa disposisi (user_id)
- Dari mana (dari_bidang_id) - NULL jika dari admin
- Ke mana (ke_bidang_id)
- Kapan (created_at)
- Catatan (keterangan)

## 🔄 What Happens After Create Table

1. **API `/api/disposisi` akan bekerja** ✅
2. **Admin bisa disposisi pengaduan** ✅
3. **History ter-record di database** ✅
4. **Timeline lengkap** ✅

## ⚠️ Important Notes

### Jika Error Lain Muncul

**Error: table "bidang" does not exist**
→ Run `MIGRATION.sql` terlebih dahulu

**Error: table "pengaduan" does not exist**
→ Run `MIGRATION.sql` terlebih dahulu

**Error: table "users" does not exist**
→ Run `MIGRATION.sql` terlebih dahulu

### Complete Migration Order

Jika fresh install, run SQL dalam urutan:
1. **`MIGRATION.sql`** - Create all base tables
2. **`CREATE_DISPOSISI_TABLE.sql`** - Create disposisi table
3. **Test** - Verifikasi semua berfungsi

## ✅ Verification Checklist

Setelah run SQL:

- [ ] Table `disposisi` exists
- [ ] Column `dari_bidang_id` exists
- [ ] Column `ke_bidang_id` exists
- [ ] RLS policies enabled
- [ ] Indexes created
- [ ] Permissions granted
- [ ] Test disposisi berhasil
- [ ] Data tersimpan di database

## 🎯 Quick Test

```sql
-- Test insert disposisi
INSERT INTO disposisi (
    pengaduan_id, 
    dari_bidang_id, 
    ke_bidang_id, 
    keterangan
)
SELECT 
    id, 
    NULL, 
    1, 
    'Test disposisi'
FROM pengaduan
LIMIT 1;

-- Check inserted data
SELECT * FROM disposisi ORDER BY created_at DESC LIMIT 5;
```

## ✅ Done!

Setelah run SQL, error akan hilang dan disposisi berfungsi normal! 🎉
