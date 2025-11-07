# Fix: Duplicate Key Error - Kode Pengaduan

## Masalah
Error: `duplicate key value violates unique constraint "pengaduan_kode_pengaduan_key"`

Terjadi karena race condition saat multiple requests bersamaan mencoba membuat pengaduan dengan kode yang sama.

## Solusi yang Diterapkan

### 1. Database Level - Advisory Lock
**File**: `QUICK_FIX_DUPLICATE.sql`

Menggunakan PostgreSQL advisory lock untuk mencegah race condition:
- `pg_advisory_xact_lock()` - Lock otomatis per tahun
- Lock akan otomatis release setelah transaction selesai
- Fallback mechanism dengan timestamp + random suffix jika terjadi collision

### 2. Application Level - Retry Logic
**File**: `models/Pengaduan.js`

Menambahkan retry logic dengan exponential backoff:
- Maximum 5 retry attempts
- Delay: 50ms, 100ms, 200ms, 400ms, 800ms
- Hanya retry untuk duplicate key error

### 3. Controller Simplification
**File**: `controllers/pengaduanController.js`

Menyederhanakan controller karena retry logic sudah ada di model.

## Cara Implementasi

### Step 1: Jalankan SQL Fix
1. Buka Supabase Dashboard → SQL Editor
2. Copy seluruh isi file `QUICK_FIX_DUPLICATE.sql`
3. Paste dan Run
4. Verifikasi hasil:
   - Trigger status harus "ENABLED ✓"
   - Total duplicates harus "0 rows"

### Step 2: Deploy Code Changes
File yang sudah diupdate:
- ✅ `models/Pengaduan.js` - Added retry logic
- ✅ `controllers/pengaduanController.js` - Simplified

Tidak perlu restart server jika menggunakan nodemon.

### Step 3: Test
Coba buat beberapa pengaduan secara bersamaan untuk memastikan tidak ada duplicate error.

## Penjelasan Teknis

### Advisory Lock
```sql
lock_key := ('x' || md5('pengaduan_kode_' || year_part))::bit(64)::bigint;
PERFORM pg_advisory_xact_lock(lock_key);
```
- Lock berdasarkan tahun (2025, 2026, dst)
- Tahun berbeda bisa proses concurrent
- Transaction-level lock (otomatis release)

### Fallback Mechanism
Jika setelah 100 attempts masih collision (sangat jarang):
```
ADU-2025-1234-A5F3
         ^^^^ ^^^^
         |    Random suffix (4 char)
         Timestamp modulo 10000
```

### Retry Logic
```javascript
for (let attempt = 0; attempt < 5; attempt++) {
    try {
        // Insert pengaduan
        return result;
    } catch (error) {
        if (duplicate && attempt < 4) {
            await sleep(50 * 2^attempt);
            continue;
        }
        throw error;
    }
}
```

## Monitoring

### Check Duplicates
```sql
SELECT kode_pengaduan, COUNT(*) 
FROM pengaduan 
GROUP BY kode_pengaduan 
HAVING COUNT(*) > 1;
```

### Check Trigger Status
```sql
SELECT tgname, tgenabled 
FROM pg_trigger 
WHERE tgname = 'trg_generate_kode_pengaduan';
```

### Check Recent Pengaduan
```sql
SELECT kode_pengaduan, created_at 
FROM pengaduan 
ORDER BY created_at DESC 
LIMIT 10;
```

## Troubleshooting

### Jika masih terjadi duplicate:
1. Pastikan trigger sudah dijalankan (check Step 1)
2. Check apakah ada kode yang manual set `kode_pengaduan`
3. Lihat log untuk warning fallback mechanism
4. Increase `max_attempts` di trigger jika perlu

### Jika performa lambat:
- Advisory lock bisa menyebabkan waiting
- Normal jika ada banyak concurrent requests
- Lock hanya berlaku per tahun, jadi impact minimal

### Jika ada kode dengan format aneh (ADU-2025-1234-A5F3):
- Ini fallback mechanism
- Berarti ada collision setelah 100 attempts
- Investigate kenapa bisa terjadi (mungkin ada bug lain)

## Rollback Plan

Jika perlu rollback:

```sql
-- Restore old trigger
DROP TRIGGER IF EXISTS trg_generate_kode_pengaduan ON pengaduan;
DROP FUNCTION IF EXISTS generate_kode_pengaduan();

-- Create simple trigger without lock
CREATE OR REPLACE FUNCTION generate_kode_pengaduan()
RETURNS TRIGGER AS $$
DECLARE
    year_part TEXT;
    sequence_num INTEGER;
BEGIN
    IF NEW.kode_pengaduan IS NULL OR NEW.kode_pengaduan = '' THEN
        year_part := EXTRACT(year FROM CURRENT_DATE)::TEXT;
        
        SELECT COALESCE(MAX(
            CAST(SUBSTRING(kode_pengaduan FROM 10 FOR 4) AS INTEGER)
        ), 0) + 1 INTO sequence_num
        FROM pengaduan
        WHERE kode_pengaduan LIKE 'ADU-' || year_part || '-%';
        
        NEW.kode_pengaduan := 'ADU-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_kode_pengaduan
    BEFORE INSERT ON pengaduan
    FOR EACH ROW
    EXECUTE FUNCTION generate_kode_pengaduan();
```

## Kesimpulan

Fix ini mengatasi duplicate key error dengan:
1. **Prevention** - Advisory lock di database
2. **Recovery** - Retry logic di application
3. **Fallback** - Timestamp + random suffix jika semua gagal

Kombinasi ini memastikan tidak ada duplicate key error dalam kondisi normal maupun high concurrency.
