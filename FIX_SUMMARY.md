# Fix Summary: Duplicate Kode Pengaduan Error

## 🔴 Problem
```
Error: duplicate key value violates unique constraint "pengaduan_kode_pengaduan_key"
```

## ✅ Solution Implemented

### 1. Database Level Fix

#### File: `QUICK_FIX_DUPLICATE.sql`
**Action Required:** Jalankan script ini di Supabase SQL Editor

**What it does:**
- ✅ Fixes existing duplicate kode_pengaduan in database
- ✅ Recreates trigger with improved collision handling
- ✅ Adds retry mechanism in trigger function
- ✅ Verifies trigger is active

**How to run:**
1. Buka Supabase Dashboard
2. Go to SQL Editor
3. Copy-paste seluruh isi `QUICK_FIX_DUPLICATE.sql`
4. Klik "Run"
5. Verify output shows "✓ Quick fix completed successfully!"

### 2. Application Level Fix

#### File: `models/Pengaduan.js`
**Status:** ✅ Already Updated

**Changes:**
```javascript
// Before
const { data: result, error } = await supabase
    .from('pengaduan')
    .insert([data])
    .select()
    .single();

// After
const insertData = { ...data };
delete insertData.kode_pengaduan; // Let trigger generate it

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
```

#### File: `controllers/pengaduanController.js`
**Status:** ✅ Already Updated

**Changes:**
- Added retry logic with exponential backoff
- Max 3 retry attempts for duplicate key errors
- User-friendly error messages
- Automatic retry on collision

```javascript
// Retry logic
for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
        const pengaduan = await Pengaduan.create(pengaduanData);
        return res.status(201).json({ success: true, data: pengaduan });
    } catch (error) {
        if (error.message.includes('kode_pengaduan') && attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, attempt)));
            continue;
        }
        throw error;
    }
}
```

## 📋 Implementation Steps

### Step 1: Run Database Fix (REQUIRED)
```bash
# Run this in Supabase SQL Editor
File: QUICK_FIX_DUPLICATE.sql
```

### Step 2: Verify Application Code (DONE)
- ✅ `models/Pengaduan.js` - Updated
- ✅ `controllers/pengaduanController.js` - Updated

### Step 3: Test
```bash
# Test creating new pengaduan
POST /api/pengaduan
{
  "kategori_id": 1,
  "judul_pengaduan": "Test",
  "isi_pengaduan": "Test content",
  "nama_pelapor": "Test User",
  "email_pelapor": "test@example.com"
}

# Should return success with unique kode_pengaduan
```

### Step 4: Monitor
```sql
-- Check for duplicates (should return 0 rows)
SELECT kode_pengaduan, COUNT(*) 
FROM pengaduan 
GROUP BY kode_pengaduan 
HAVING COUNT(*) > 1;

-- Check recent codes
SELECT kode_pengaduan, created_at 
FROM pengaduan 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🔧 Technical Details

### Improved Trigger Function
```sql
CREATE OR REPLACE FUNCTION generate_kode_pengaduan()
RETURNS TRIGGER AS $$
DECLARE
    year_part TEXT;
    sequence_num INTEGER;
    new_kode TEXT;
    attempt INTEGER := 0;
    max_attempts INTEGER := 50;
BEGIN
    IF NEW.kode_pengaduan IS NULL OR NEW.kode_pengaduan = '' THEN
        year_part := EXTRACT(year FROM CURRENT_DATE)::TEXT;
        
        LOOP
            -- Get next sequence with offset
            SELECT COALESCE(MAX(...), 0) + 1 + attempt INTO sequence_num
            FROM pengaduan
            WHERE kode_pengaduan LIKE 'ADU-' || year_part || '-%';
            
            new_kode := 'ADU-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
            
            -- Check if exists
            IF NOT EXISTS(SELECT 1 FROM pengaduan WHERE kode_pengaduan = new_kode) THEN
                NEW.kode_pengaduan := new_kode;
                EXIT;
            END IF;
            
            attempt := attempt + 1;
            IF attempt >= max_attempts THEN
                -- Fallback to timestamp-based
                NEW.kode_pengaduan := 'ADU-' || year_part || '-' || 
                                     LPAD(FLOOR(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP))::TEXT, 4, '0');
                EXIT;
            END IF;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Key Improvements
1. **Loop mechanism** - Tries multiple sequence numbers
2. **Collision detection** - Checks if code exists before using
3. **Fallback strategy** - Uses timestamp if max attempts reached
4. **Application retry** - 3 attempts with exponential backoff
5. **Better error messages** - User-friendly error handling

## 🎯 Expected Results

### Before Fix
```
❌ Error: duplicate key value violates unique constraint
❌ Multiple pengaduan with same kode_pengaduan
❌ Users cannot create new pengaduan
```

### After Fix
```
✅ Unique kode_pengaduan generated automatically
✅ No duplicate keys in database
✅ Automatic retry on collision
✅ User-friendly error messages
✅ Smooth pengaduan creation
```

## 📊 Verification Queries

### Check Trigger Status
```sql
SELECT 
    tgname as trigger_name,
    CASE tgenabled 
        WHEN 'O' THEN 'ENABLED ✓'
        ELSE 'DISABLED ✗'
    END as status
FROM pg_trigger
WHERE tgname = 'trg_generate_kode_pengaduan';
```

### Check for Duplicates
```sql
SELECT 
    kode_pengaduan, 
    COUNT(*) as count,
    array_agg(id) as ids
FROM pengaduan
WHERE kode_pengaduan IS NOT NULL
GROUP BY kode_pengaduan
HAVING COUNT(*) > 1;
```

### Check Sequence Numbers
```sql
SELECT 
    SUBSTRING(kode_pengaduan FROM 1 FOR 8) as prefix,
    MAX(CAST(SUBSTRING(kode_pengaduan FROM 10 FOR 4) AS INTEGER)) as max_seq,
    COUNT(*) as total
FROM pengaduan
WHERE kode_pengaduan ~ '^ADU-[0-9]{4}-[0-9]{4}$'
GROUP BY SUBSTRING(kode_pengaduan FROM 1 FOR 8)
ORDER BY prefix DESC;
```

## 🚨 Troubleshooting

### If error still occurs:

1. **Verify trigger is active**
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'trg_generate_kode_pengaduan';
   ```

2. **Check RLS policies**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'pengaduan';
   ```

3. **Manual fix duplicates**
   ```sql
   UPDATE pengaduan 
   SET kode_pengaduan = kode_pengaduan || '-FIX-' || id::text
   WHERE id IN (
       SELECT id FROM (
           SELECT id, ROW_NUMBER() OVER (PARTITION BY kode_pengaduan ORDER BY created_at) as rn
           FROM pengaduan
       ) t WHERE rn > 1
   );
   ```

4. **Check logs**
   - Supabase Dashboard → Logs
   - Look for trigger execution errors

## 📚 Related Files

- `QUICK_FIX_DUPLICATE.sql` - Quick fix script (RUN THIS FIRST)
- `FIX_DUPLICATE_KODE.sql` - Detailed fix with explanations
- `TROUBLESHOOT_DUPLICATE_KODE.md` - Complete troubleshooting guide
- `models/Pengaduan.js` - Updated model
- `controllers/pengaduanController.js` - Updated controller

## ✅ Checklist

- [ ] Run `QUICK_FIX_DUPLICATE.sql` in Supabase
- [ ] Verify trigger is active
- [ ] Check no duplicates exist
- [ ] Test creating new pengaduan
- [ ] Monitor for 24 hours
- [ ] Update documentation if needed

## 📞 Support

If issues persist after following all steps:
1. Check all verification queries
2. Review Supabase logs
3. Ensure RLS policies are correct
4. Contact database administrator

---

**Status:** ✅ Fix Ready to Deploy
**Last Updated:** 2025-01-07
**Priority:** HIGH - Run database fix immediately
