# Troubleshooting: Duplicate Kode Pengaduan Error

## Error Message
```
duplicate key value violates unique constraint "pengaduan_kode_pengaduan_key"
```

## Penyebab
Error ini terjadi karena:
1. **Trigger database tidak berfungsi** - Function `generate_kode_pengaduan()` tidak berjalan
2. **Race condition** - Dua request bersamaan menghasilkan kode yang sama
3. **Data duplikat** - Ada kode pengaduan yang sudah ada di database
4. **Manual insert** - Kode pengaduan dikirim secara manual dari aplikasi

## Solusi

### 1. Jalankan Script Perbaikan
Jalankan file `FIX_DUPLICATE_KODE.sql` di Supabase SQL Editor:

```bash
# File: FIX_DUPLICATE_KODE.sql
```

Script ini akan:
- ✅ Drop dan recreate trigger dengan collision handling yang lebih baik
- ✅ Memperbaiki data duplikat yang sudah ada
- ✅ Menambahkan loop untuk mencari kode unik
- ✅ Verifikasi trigger sudah aktif

### 2. Verifikasi Trigger Aktif

```sql
-- Check if trigger exists and is enabled
SELECT 
    tgname as trigger_name,
    tgenabled as enabled,
    proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname = 'trg_generate_kode_pengaduan';
```

Expected output:
```
trigger_name                | enabled | function_name
----------------------------|---------|---------------------------
trg_generate_kode_pengaduan | O       | generate_kode_pengaduan
```

### 3. Check Existing Duplicates

```sql
-- Find duplicate kode_pengaduan
SELECT 
    kode_pengaduan, 
    COUNT(*) as count,
    array_agg(id) as duplicate_ids
FROM pengaduan
WHERE kode_pengaduan IS NOT NULL
GROUP BY kode_pengaduan
HAVING COUNT(*) > 1;
```

### 4. Fix Existing Duplicates Manually

Jika ada duplikat, jalankan:

```sql
-- Update duplicate codes
UPDATE pengaduan 
SET kode_pengaduan = kode_pengaduan || '-FIX-' || id::text
WHERE id IN (
    SELECT id FROM (
        SELECT id, 
               ROW_NUMBER() OVER (PARTITION BY kode_pengaduan ORDER BY created_at) as rn
        FROM pengaduan
        WHERE kode_pengaduan IS NOT NULL
    ) t
    WHERE rn > 1
);
```

## Pencegahan

### 1. Model Update
File `models/Pengaduan.js` sudah diupdate untuk:
- Menghapus `kode_pengaduan` dari data insert
- Membiarkan trigger database generate kode
- Handle error duplicate key dengan pesan yang jelas

```javascript
static async create(data) {
    // Remove kode_pengaduan to let trigger generate it
    const insertData = { ...data };
    delete insertData.kode_pengaduan;
    
    const { data: result, error } = await supabase
        .from('pengaduan')
        .insert([insertData])
        .select()
        .single();
    
    if (error) {
        if (error.code === '23505' && error.message.includes('kode_pengaduan')) {
            throw new Error('Kode pengaduan sudah ada. Silakan coba lagi.');
        }
        throw error;
    }
    return result;
}
```

### 2. Improved Trigger Function
Function baru memiliki:
- **Loop mechanism** untuk mencari kode unik
- **Collision detection** sebelum insert
- **Max attempts** untuk prevent infinite loop
- **Better sequence numbering**

### 3. Application Level Validation

Tambahkan retry logic di controller:

```javascript
async createPengaduan(req, res) {
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
        try {
            const pengaduan = await Pengaduan.create(data);
            return res.json({ success: true, data: pengaduan });
        } catch (error) {
            if (error.message.includes('kode_pengaduan') && attempt < maxRetries - 1) {
                attempt++;
                await new Promise(resolve => setTimeout(resolve, 100 * attempt));
                continue;
            }
            throw error;
        }
    }
}
```

## Testing

### Test 1: Single Insert
```sql
INSERT INTO pengaduan (
    kategori_id, 
    judul_pengaduan, 
    isi_pengaduan,
    nama_pelapor,
    email_pelapor,
    status
) VALUES (
    1,
    'Test Pengaduan 1',
    'Test isi pengaduan',
    'Test User',
    'test@example.com',
    'diterima'
) RETURNING kode_pengaduan;
```

Expected: `ADU-2025-0001` (atau nomor sequence berikutnya)

### Test 2: Multiple Concurrent Inserts
```javascript
// Test concurrent inserts
const promises = Array(10).fill(null).map((_, i) => 
    Pengaduan.create({
        kategori_id: 1,
        judul_pengaduan: `Test ${i}`,
        isi_pengaduan: 'Test',
        nama_pelapor: 'Test',
        email_pelapor: 'test@example.com',
        status: 'diterima'
    })
);

const results = await Promise.all(promises);
console.log(results.map(r => r.kode_pengaduan));
```

Expected: 10 unique codes without duplicates

### Test 3: Verify No Duplicates
```sql
-- Should return 0 rows
SELECT kode_pengaduan, COUNT(*) 
FROM pengaduan 
GROUP BY kode_pengaduan 
HAVING COUNT(*) > 1;
```

## Monitoring

### Check Sequence Numbers
```sql
SELECT 
    SUBSTRING(kode_pengaduan FROM 1 FOR 8) as year_prefix,
    MAX(CAST(SUBSTRING(kode_pengaduan FROM 10 FOR 4) AS INTEGER)) as max_sequence,
    COUNT(*) as total_count
FROM pengaduan
WHERE kode_pengaduan ~ '^ADU-[0-9]{4}-[0-9]{4}$'
GROUP BY SUBSTRING(kode_pengaduan FROM 1 FOR 8)
ORDER BY year_prefix DESC;
```

### Check Recent Codes
```sql
SELECT 
    kode_pengaduan,
    created_at,
    judul_pengaduan
FROM pengaduan
ORDER BY created_at DESC
LIMIT 20;
```

## Emergency Fix

Jika masih terjadi error setelah semua langkah di atas:

### Option 1: Reset Sequence
```sql
-- Find the highest sequence number
SELECT MAX(CAST(SUBSTRING(kode_pengaduan FROM 10 FOR 4) AS INTEGER)) 
FROM pengaduan
WHERE kode_pengaduan LIKE 'ADU-2025-%';

-- Manually set next inserts to start from safe number
-- (This is handled automatically by the improved function)
```

### Option 2: Temporary Disable Constraint
```sql
-- NOT RECOMMENDED - Only for emergency
ALTER TABLE pengaduan DROP CONSTRAINT IF EXISTS pengaduan_kode_pengaduan_key;

-- Fix all duplicates first, then recreate
ALTER TABLE pengaduan ADD CONSTRAINT pengaduan_kode_pengaduan_key UNIQUE (kode_pengaduan);
```

### Option 3: Use UUID Suffix
```sql
-- Add random suffix to prevent collision
CREATE OR REPLACE FUNCTION generate_kode_pengaduan()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.kode_pengaduan IS NULL OR NEW.kode_pengaduan = '' THEN
        NEW.kode_pengaduan := 'ADU-' || 
                              EXTRACT(year FROM CURRENT_DATE)::TEXT || '-' ||
                              LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0') || '-' ||
                              SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 4);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Support

Jika masalah masih berlanjut:
1. Check Supabase logs untuk error details
2. Verify RLS policies tidak blocking trigger
3. Check database connection pool settings
4. Contact database administrator

## Checklist

- [ ] Jalankan `FIX_DUPLICATE_KODE.sql`
- [ ] Verify trigger aktif
- [ ] Check dan fix existing duplicates
- [ ] Test insert baru
- [ ] Update application code
- [ ] Monitor untuk 24 jam
- [ ] Document any additional issues

---

**Last Updated:** 2025-01-07
**Status:** ✅ Fixed with improved trigger function
