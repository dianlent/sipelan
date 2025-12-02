# 📎 Tampilan Lampiran di Timeline Pengaduan

## ✅ Fitur Baru

Timeline pengaduan sekarang **menampilkan lampiran file** dari tanggapan bidang dengan preview gambar dan link download!

---

## 🎯 Yang Diimplementasikan

### 1. **Interface Update**

✅ **Tambah `file_url` ke Timeline:**
```typescript
interface TimelineStep {
  tanggapan?: string
  petugas?: string
  file_url?: string  // ✅ NEW
}

interface PengaduanTimelineProps {
  timeline?: Array<{
    tanggapan?: string
    petugas?: string
    file_url?: string  // ✅ NEW
  }>
}
```

### 2. **File Type Detection**

✅ **Helper Functions:**
```typescript
const getFileExtension = (url: string) => {
  return url.split('.').pop()?.toLowerCase() || ''
}

const isImageFile = (url: string) => {
  const ext = getFileExtension(url)
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)
}

const getFileName = (url: string) => {
  return url.split('/').pop() || 'file'
}
```

### 3. **UI Display**

✅ **Image Files (JPG, PNG, GIF, WEBP):**
- 🖼️ Preview gambar (max height 256px)
- 🔗 Download button

✅ **Document Files (PDF, DOC, DOCX):**
- 📄 File icon + nama file
- 📦 File extension badge
- 🔗 Click to download

---

## 🎨 UI Preview

### **Timeline dengan Lampiran Gambar**

```
┌─────────────────────────────────────────────────────┐
│ 💬 Tanggapan Bidang • Staff Bidang HI               │
│                                                     │
│ Pengaduan telah kami tindaklanjuti dan diselesaikan│
│                                                     │
│ ─────────────────────────────────────────────────  │
│ 📎 Lampiran:                                        │
│ ┌─────────────────────────────────────────────┐    │
│ │                                             │    │
│ │         [Image Preview]                     │    │
│ │                                             │    │
│ └─────────────────────────────────────────────┘    │
│ [Download Gambar]                                  │
└─────────────────────────────────────────────────────┘
```

### **Timeline dengan Lampiran Dokumen**

```
┌─────────────────────────────────────────────────────┐
│ 💬 Tanggapan Bidang • Staff Bidang HI               │
│                                                     │
│ Pengaduan telah kami tindaklanjuti dan diselesaikan│
│                                                     │
│ ─────────────────────────────────────────────────  │
│ 📎 Lampiran:                                        │
│ ┌─────────────────────────────────────────────┐    │
│ │ 📄  surat-tindak-lanjut.pdf                 │    │
│ │     PDF file                          ⬇️    │    │
│ └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Flow Lengkap

```
Bidang upload file saat tanggapan
    ↓
File disimpan ke Supabase Storage
    ↓
file_url disimpan ke pengaduan_status
    ↓
Timeline fetch data dari API
    ↓
PengaduanTimeline component:
  ├─ Detect file type (image/document)
  ├─ IF image: Show preview + download
  └─ IF document: Show icon + download link
    ↓
✅ Pelapor bisa lihat & download file
```

---

## 💻 Implementation

### **Component: PengaduanTimeline.tsx**

```typescript
// Import icons
import { Paperclip, Download, FileIcon } from 'lucide-react'

// Helper functions
const getFileExtension = (url: string) => {
  return url.split('.').pop()?.toLowerCase() || ''
}

const isImageFile = (url: string) => {
  const ext = getFileExtension(url)
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)
}

const getFileName = (url: string) => {
  return url.split('/').pop() || 'file'
}

// In render
{step.file_url && (
  <div className="mt-3 pt-3 border-t border-purple-200">
    <div className="flex items-center gap-2 mb-2">
      <Paperclip className="w-4 h-4 text-purple-600" />
      <span className="text-xs font-semibold text-purple-700">Lampiran:</span>
    </div>
    
    {isImageFile(step.file_url) ? (
      // Image preview
      <div className="space-y-2">
        <div className="relative rounded-lg overflow-hidden border-2 border-purple-200 bg-white">
          <img 
            src={step.file_url} 
            alt="Lampiran"
            className="w-full max-h-64 object-contain"
          />
        </div>
        <a href={step.file_url} target="_blank" rel="noopener noreferrer">
          <Download /> Download Gambar
        </a>
      </div>
    ) : (
      // Document link
      <a href={step.file_url} target="_blank" rel="noopener noreferrer">
        <FileIcon />
        <div>
          <p>{getFileName(step.file_url)}</p>
          <p>{getFileExtension(step.file_url)} file</p>
        </div>
        <Download />
      </a>
    )}
  </div>
)}
```

---

## 📊 Data Flow

### **Database → API → Component**

```sql
-- Database: pengaduan_status
SELECT 
  tanggapan,
  petugas,
  file_url  -- ✅ Contains Supabase Storage URL
FROM pengaduan_status
WHERE pengaduan_id = 'xxx';
```

```typescript
// API Response
{
  timeline: [
    {
      status: 'tindak_lanjut',
      tanggapan: 'Pengaduan telah ditindaklanjuti',
      petugas: 'Staff Bidang HI',
      file_url: 'https://xxx.supabase.co/storage/v1/object/public/pengaduan-files/tanggapan/xxx.pdf'
    }
  ]
}
```

```typescript
// Component receives
<PengaduanTimeline 
  timeline={[
    {
      tanggapan: '...',
      petugas: '...',
      file_url: 'https://...'  // ✅ Displayed
    }
  ]}
/>
```

---

## 🎨 UI Components Detail

### **Image Preview Component**

```jsx
<div className="space-y-2">
  {/* Image Container */}
  <div className="relative rounded-lg overflow-hidden border-2 border-purple-200 bg-white">
    <img 
      src={step.file_url} 
      alt="Lampiran"
      className="w-full max-h-64 object-contain"
    />
  </div>
  
  {/* Download Button */}
  <a
    href={step.file_url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700"
  >
    <Download className="w-4 h-4" />
    <span>Download Gambar</span>
  </a>
</div>
```

### **Document Link Component**

```jsx
<a
  href={step.file_url}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-3 p-3 bg-white border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all group"
>
  {/* Icon */}
  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
    <FileIcon className="w-5 h-5 text-purple-600" />
  </div>
  
  {/* File Info */}
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium text-gray-900 truncate">
      {getFileName(step.file_url)}
    </p>
    <p className="text-xs text-gray-500 uppercase">
      {getFileExtension(step.file_url)} file
    </p>
  </div>
  
  {/* Download Icon */}
  <Download className="w-5 h-5 text-purple-600 flex-shrink-0" />
</a>
```

---

## 📁 File Structure

```
components/
└── PengaduanTimeline.tsx
    ├── Import: Paperclip, Download, FileIcon
    ├── Interface: file_url added
    ├── Helpers: getFileExtension, isImageFile, getFileName
    └── UI: Image preview / Document link

app/
└── tracking/page.tsx
    └── Pass timeline with file_url to PengaduanTimeline

database/
└── pengaduan_status
    └── file_url column (TEXT)
```

---

## 🧪 Testing

### Test 1: Image Attachment

```
1. Bidang upload image (JPG/PNG)
2. Submit tanggapan
3. Pelapor buka tracking
4. Expected:
   ✅ Image preview tampil
   ✅ Download button ada
   ✅ Klik image → open in new tab
   ✅ Klik download → download file
```

### Test 2: Document Attachment

```
1. Bidang upload PDF/DOC
2. Submit tanggapan
3. Pelapor buka tracking
4. Expected:
   ✅ File icon + nama tampil
   ✅ Extension badge tampil (PDF/DOC)
   ✅ Hover effect works
   ✅ Klik → download file
```

### Test 3: No Attachment

```
1. Bidang submit tanggapan tanpa file
2. Pelapor buka tracking
3. Expected:
   ✅ Tanggapan tampil normal
   ❌ Tidak ada section "Lampiran"
```

### Test 4: Multiple Timeline Items

```
1. Timeline dengan beberapa tanggapan
2. Beberapa punya lampiran, beberapa tidak
3. Expected:
   ✅ Hanya tanggapan dengan file yang show lampiran
   ✅ Setiap file tampil dengan benar
```

---

## 🐛 Troubleshooting

### Lampiran tidak tampil

**Check:**
```sql
-- 1. file_url ada di database?
SELECT 
  id,
  tanggapan,
  file_url,
  created_at
FROM pengaduan_status
WHERE pengaduan_id = 'xxx'
AND file_url IS NOT NULL;
```

**Expected:**
- `file_url` should contain full Supabase Storage URL

### Image tidak load

**Check:**
1. URL valid dan accessible
2. File exists in Supabase Storage
3. Bucket is public
4. CORS configured

**Solution:**
```sql
-- Make bucket public
UPDATE storage.buckets 
SET public = true 
WHERE name = 'pengaduan-files';
```

### Download tidak work

**Check:**
1. Link opens in new tab
2. File accessible
3. Browser not blocking download

---

## 📊 Benefits

| Feature | Before | After |
|---------|--------|-------|
| **Lampiran** | ❌ Text only | ✅ File display |
| **Image Preview** | ❌ None | ✅ Inline preview |
| **Document** | ❌ None | ✅ Icon + download |
| **UX** | ❌ Limited | ✅ Visual & interactive |
| **Download** | ❌ None | ✅ Direct download |

---

## ✅ Summary

**Timeline pengaduan sekarang:**

1. ✅ **Menampilkan lampiran file** dari tanggapan bidang
2. ✅ **Image preview** untuk JPG, PNG, GIF, WEBP
3. ✅ **Document link** untuk PDF, DOC, DOCX
4. ✅ **Download button** untuk semua file
5. ✅ **Responsive UI** dengan hover effects
6. ✅ **Auto-detect** file type
7. ✅ **Seamless integration** dengan timeline

**Pelapor bisa melihat bukti tindak lanjut dari bidang dalam bentuk file!** 📎✅
