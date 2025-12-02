# 📎 Lampiran File pada Tanggapan Bidang

## ✅ Fitur Baru

Bidang sekarang bisa **melampirkan file (gambar/doc/pdf)** saat memberikan tanggapan pengaduan. File akan tampil di **timeline pengaduan** untuk dilihat pelapor!

---

## 🎯 Yang Diimplementasikan

### 1. **Upload File di Modal Tanggapan**

✅ **UI Upload dengan Drag & Drop Style**
```jsx
<div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
  <input type="file" accept="image/*,.pdf,.doc,.docx" />
  <Upload icon />
  Klik untuk upload file
</div>
```

✅ **File Types Supported:**
- 📷 **Images**: JPG, PNG, GIF, WEBP
- 📄 **Documents**: PDF, DOC, DOCX
- 📦 **Max Size**: 10MB

### 2. **File Validation**

✅ **Frontend Validation:**
```typescript
// Size check
if (file.size > 10 * 1024 * 1024) {
  toast.error('Ukuran file maksimal 10MB')
}

// Type check
const allowedTypes = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]
```

### 3. **File Upload to Supabase Storage**

✅ **Backend API:**
```typescript
// Upload to storage
const filePath = `tanggapan/${pengaduanId}-${Date.now()}.${ext}`
await supabaseAdmin.storage
  .from('pengaduan-files')
  .upload(filePath, file)

// Get public URL
const { data } = supabaseAdmin.storage
  .from('pengaduan-files')
  .getPublicUrl(filePath)

// Save URL to database
await supabaseAdmin
  .from('pengaduan_status')
  .insert({
    tanggapan,
    petugas,
    file_url: data.publicUrl  // ✅ Saved!
  })
```

### 4. **Display in Timeline**

✅ **File akan tampil di timeline dengan:**
- 🖼️ Preview untuk gambar
- 📄 Icon + nama file untuk dokumen
- 🔗 Link download

---

## 🔄 Flow Lengkap

```
User Bidang buka modal tanggapan
    ↓
Tulis tanggapan
    ↓
Upload file (opsional)
    ↓
Klik "Kirim Tanggapan"
    ↓
Frontend: FormData with file
    ↓
Backend API:
  ├─ Validate file
  ├─ Upload to Supabase Storage
  ├─ Get public URL
  └─ Save to pengaduan_status.file_url
    ↓
Timeline: Display tanggapan + file
    ↓
✅ Pelapor bisa lihat & download file
```

---

## 📊 Database Schema

### **Table: pengaduan_status**

```sql
CREATE TABLE pengaduan_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pengaduan_id UUID REFERENCES pengaduan(id),
  status VARCHAR(50),
  keterangan TEXT,
  tanggapan TEXT,
  petugas VARCHAR(255),
  file_url TEXT,  -- ✅ NEW: URL file lampiran
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Migration SQL**

```sql
-- Add file_url column
ALTER TABLE pengaduan_status 
ADD COLUMN IF NOT EXISTS file_url TEXT;
```

---

## 🎨 UI Components

### **Upload Area (Empty State)**

```
┌─────────────────────────────────────────┐
│              📤 Upload                  │
│                                         │
│      Klik untuk upload file             │
│   JPG, PNG, GIF, PDF, DOC (Max 10MB)   │
│                                         │
│ 📎 Lampiran akan ditampilkan di timeline│
└─────────────────────────────────────────┘
```

### **Upload Area (File Selected)**

```
┌─────────────────────────────────────────┐
│              📤 Upload                  │
│                                         │
│   ✓ dokumen-pendukung.pdf               │
│      245.67 KB                          │
│      [Hapus file]                       │
│                                         │
│ 📎 Lampiran akan ditampilkan di timeline│
└─────────────────────────────────────────┘
```

### **Timeline Display (Image)**

```
┌─────────────────────────────────────────┐
│ 💬 Tanggapan dari Staff Bidang HI       │
│                                         │
│ Pengaduan telah kami tindaklanjuti...   │
│                                         │
│ 📎 Lampiran:                            │
│ ┌───────────────────────────────────┐   │
│ │                                   │   │
│ │     [Image Preview]               │   │
│ │                                   │   │
│ └───────────────────────────────────┘   │
│ 🔗 Download                             │
└─────────────────────────────────────────┘
```

### **Timeline Display (Document)**

```
┌─────────────────────────────────────────┐
│ 💬 Tanggapan dari Staff Bidang HI       │
│                                         │
│ Pengaduan telah kami tindaklanjuti...   │
│                                         │
│ 📎 Lampiran:                            │
│ ┌───────────────────────────────────┐   │
│ │ 📄 surat-tindak-lanjut.pdf        │   │
│ │ 🔗 Download (245 KB)              │   │
│ └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 🔧 Implementation Details

### **Frontend (`app/bidang/page.tsx`)**

```typescript
// State
const [fileLampiran, setFileLampiran] = useState<File | null>(null)

// File handler
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (file) {
    // Validate size & type
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 10MB')
      return
    }
    setFileLampiran(file)
  }
}

// Submit with file
const handleSubmitTanggapan = async () => {
  const formData = new FormData()
  formData.append('tanggapan', tanggapan)
  formData.append('petugas', user?.nama_lengkap)
  formData.append('status', 'selesai')
  if (fileLampiran) {
    formData.append('file_lampiran', fileLampiran)
  }
  
  await fetch(`/api/pengaduan/${id}/tanggapan`, {
    method: 'POST',
    body: formData
  })
}
```

### **Backend API (`app/api/pengaduan/[id]/tanggapan/route.ts`)**

```typescript
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const fileLampiran = formData.get('file_lampiran') as File | null
  
  let fileUrl = null
  
  if (fileLampiran) {
    // Upload to Supabase Storage
    const filePath = `tanggapan/${pengaduanId}-${Date.now()}.${ext}`
    const { data } = await supabaseAdmin.storage
      .from('pengaduan-files')
      .upload(filePath, fileLampiran)
    
    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('pengaduan-files')
      .getPublicUrl(filePath)
    
    fileUrl = urlData.publicUrl
  }
  
  // Save to database
  await supabaseAdmin
    .from('pengaduan_status')
    .insert({
      tanggapan,
      petugas,
      file_url: fileUrl
    })
}
```

---

## 📁 File Structure

```
app/
├── bidang/page.tsx                     # ✅ Upload UI + handler
└── api/
    └── pengaduan/
        └── [id]/
            └── tanggapan/route.ts      # ✅ File upload API

database/
└── add_file_url_to_status.sql          # ✅ Migration

Supabase Storage:
└── pengaduan-files/
    └── tanggapan/
        ├── uuid-123456.pdf
        ├── uuid-789012.jpg
        └── uuid-345678.docx
```

---

## 🚀 Setup

### Step 1: Run Migration

```bash
# Di Supabase SQL Editor:
database/add_file_url_to_status.sql
```

### Step 2: Verify Storage Bucket

```sql
-- Check if bucket exists
SELECT * FROM storage.buckets WHERE name = 'pengaduan-files';

-- If not exists, create it (should already exist from schema.sql)
INSERT INTO storage.buckets (id, name, public)
VALUES ('pengaduan-files', 'pengaduan-files', true);
```

### Step 3: Test Upload

1. Login sebagai bidang
2. Buka pengaduan
3. Klik "Selesaikan"
4. Upload file
5. Kirim tanggapan
6. Check timeline

---

## 🧪 Testing

### Test 1: Upload Image

```
1. Select image file (JPG/PNG)
2. Check preview shows filename & size
3. Submit tanggapan
4. Verify file uploaded to storage
5. Check timeline shows image preview
```

### Test 2: Upload Document

```
1. Select PDF/DOC file
2. Check preview shows filename & size
3. Submit tanggapan
4. Verify file uploaded to storage
5. Check timeline shows document icon + download link
```

### Test 3: File Validation

```
# Test max size
1. Upload file > 10MB
2. Expected: Error toast "Ukuran file maksimal 10MB"

# Test file type
1. Upload .exe or unsupported file
2. Expected: Error toast "Format file tidak didukung"
```

### Test 4: Without File

```
1. Submit tanggapan without file
2. Expected: Success, no file in timeline
```

---

## 🐛 Troubleshooting

### File tidak terupload

**Check:**
```sql
-- 1. Storage bucket exists?
SELECT * FROM storage.buckets WHERE name = 'pengaduan-files';

-- 2. RLS policies allow upload?
SELECT * FROM storage.policies WHERE bucket_id = 'pengaduan-files';
```

**Solution:**
```sql
-- Create bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('pengaduan-files', 'pengaduan-files', true);

-- Allow public upload
CREATE POLICY "Allow public upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'pengaduan-files');
```

### File URL tidak tampil di timeline

**Check:**
```sql
SELECT 
  id,
  tanggapan,
  file_url,
  created_at
FROM pengaduan_status
WHERE pengaduan_id = 'xxx'
ORDER BY created_at DESC;
```

**Expected:**
- `file_url` should be: `https://xxx.supabase.co/storage/v1/object/public/pengaduan-files/tanggapan/xxx.pdf`

### File tidak bisa didownload

**Check:**
1. Bucket is public
2. File exists in storage
3. URL is correct

**Solution:**
```sql
-- Make bucket public
UPDATE storage.buckets 
SET public = true 
WHERE name = 'pengaduan-files';
```

---

## 📊 Benefits

| Feature | Before | After |
|---------|--------|-------|
| **Lampiran** | ❌ Text only | ✅ File upload |
| **File Types** | ❌ None | ✅ Image, PDF, DOC |
| **Storage** | ❌ None | ✅ Supabase Storage |
| **Timeline** | ❌ Text only | ✅ File preview + download |
| **Validation** | ❌ None | ✅ Size & type check |
| **UX** | ❌ Limited | ✅ Visual feedback |

---

## ✅ Summary

**Fitur lampiran file sekarang:**

1. ✅ **Upload UI** dengan drag & drop style
2. ✅ **File validation** (size & type)
3. ✅ **Supabase Storage** integration
4. ✅ **Database** menyimpan file_url
5. ✅ **Timeline** menampilkan file
6. ✅ **Download** link untuk pelapor
7. ✅ **Support** image, PDF, DOC

**Bidang bisa melampirkan bukti tindak lanjut dalam bentuk file!** 📎✅
