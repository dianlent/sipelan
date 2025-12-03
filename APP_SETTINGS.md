# 🎨 Pengaturan Aplikasi (Logo & Nama)

## ✅ Fitur Baru

Admin sekarang bisa **upload logo dan ubah nama aplikasi** melalui settings, dan akan otomatis tampil di homepage!

---

## 🎯 Yang Diimplementasikan

### **1. Admin Settings - Tab Aplikasi**

✅ **Upload Logo:**
- Format: JPG, PNG, SVG
- Max size: 2MB
- Preview sebelum upload
- Remove logo option

✅ **Nama Aplikasi:**
- Input text field
- Default: "SIPelan"
- Tampil di header homepage

### **2. Database Schema**

```sql
ALTER TABLE app_settings 
ADD COLUMN app_name TEXT DEFAULT 'SIPelan';

ALTER TABLE app_settings 
ADD COLUMN app_logo_url TEXT;
```

### **3. API Endpoints**

✅ **POST `/api/settings/app`** (Admin only)
- Upload logo to Supabase Storage
- Save app_name and app_logo_url to database
- Return logo URL

✅ **GET `/api/settings/app/public`** (Public)
- Get app_name and app_logo_url
- No authentication required
- Used by homepage

### **4. Homepage Integration**

✅ **Dynamic Header:**
- Load app settings on mount
- Display custom logo (if exists)
- Display custom app name
- Fallback to default if no settings

---

## 💻 Implementation

### **Admin Settings UI**

```typescript
// State
const [logoFile, setLogoFile] = useState<File | null>(null)
const [logoPreview, setLogoPreview] = useState<string>('')
const [settings, setSettings] = useState({
  app: {
    nama_aplikasi: 'SIPelan',
    logo_url: ''
  }
})

// Upload handler
const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  
  // Validate type (JPG, PNG, SVG)
  // Validate size (max 2MB)
  
  setLogoFile(file)
  setLogoPreview(URL.createObjectURL(file))
}

// Save handler
const handleSaveApp = async () => {
  const formData = new FormData()
  formData.append('app_name', settings.app.nama_aplikasi)
  
  if (logoFile) {
    formData.append('logo', logoFile)
  }

  const response = await fetch('/api/settings/app', {
    method: 'POST',
    body: formData
  })
}
```

### **API Route - Upload & Save**

```typescript
// app/api/settings/app/route.ts
export async function POST(request: NextRequest) {
  // Parse FormData
  const formData = await request.formData()
  const appName = formData.get('app_name') as string
  const logoFile = formData.get('logo') as File | null

  let logoUrl = ''

  // Upload logo to Supabase Storage
  if (logoFile) {
    const fileName = `logo-${Date.now()}.${fileExt}`
    const filePath = `app/${fileName}`
    
    const { data, error } = await supabaseAdmin
      .storage
      .from('pengaduan-files')
      .upload(filePath, buffer)
    
    logoUrl = getPublicUrl(filePath)
  }

  // Save to database
  await supabaseAdmin
    .from('app_settings')
    .update({
      app_name: appName,
      app_logo_url: logoUrl
    })
}
```

### **Homepage - Load & Display**

```typescript
// State
const [appName, setAppName] = useState('SIPelan')
const [appLogo, setAppLogo] = useState<string | null>(null)

// Fetch settings
const fetchAppSettings = async () => {
  const response = await fetch('/api/settings/app/public')
  const result = await response.json()
  
  setAppName(result.data.app_name || 'SIPelan')
  setAppLogo(result.data.app_logo_url)
}

// Display in header
{appLogo ? (
  <img src={appLogo} alt={appName} />
) : (
  <ClipboardCheck /> // Default icon
)}
<span>{appName}</span>
```

---

## 🔄 Flow Lengkap

```
Admin Settings:
1. Upload logo (JPG/PNG/SVG)
2. Input nama aplikasi
3. Klik "Simpan Pengaturan"
    ↓
API /api/settings/app:
1. Validate file (type, size)
2. Upload to Supabase Storage (bucket: pengaduan-files/app/)
3. Get public URL
4. Save to app_settings table
    ↓
Database:
app_settings {
  app_name: "Sistem Pengaduan Disnaker",
  app_logo_url: "https://...supabase.co/.../logo-123.png"
}
    ↓
Homepage:
1. Fetch /api/settings/app/public
2. Load app_name and app_logo_url
3. Display in header
    ↓
✅ Logo dan nama custom tampil di homepage!
```

---

## 🎨 UI Preview

### **Admin Settings - Tab Aplikasi**

```
┌─────────────────────────────────────────────────────┐
│ 🎨 Pengaturan Aplikasi                              │
│ Kelola logo dan nama aplikasi                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Nama Aplikasi                                       │
│ ┌─────────────────────────────────────────────┐    │
│ │ Sistem Pengaduan Disnaker                   │    │
│ └─────────────────────────────────────────────┘    │
│ Nama aplikasi akan ditampilkan di header homepage  │
│                                                     │
│ Logo Aplikasi                                       │
│ ┌─────────┐                                         │
│ │  [IMG]  │ ×  ← Remove button                     │
│ └─────────┘                                         │
│                                                     │
│ [📤 Upload Logo]                                    │
│ Format: JPG, PNG, SVG (Max 2MB)                    │
│                                                     │
│ ─────────────────────────────────────────────────  │
│ [💾 Simpan Pengaturan]                             │
└─────────────────────────────────────────────────────┘
```

### **Homepage Header - Before**

```
┌─────────────────────────────────────────────────────┐
│ [📋] SIPelan                    [Beranda] [Login]  │
│      Pengaduan Online                               │
└─────────────────────────────────────────────────────┘
```

### **Homepage Header - After**

```
┌─────────────────────────────────────────────────────┐
│ [🏢] Sistem Pengaduan Disnaker  [Beranda] [Login]  │
│ LOGO Pengaduan Online                               │
└─────────────────────────────────────────────────────┘
```

---

## 📁 File Structure

```
app/
├── admin/settings/page.tsx
│   ├── Tab "Aplikasi" (new)
│   ├── Upload logo UI
│   └── Nama aplikasi input
│
├── api/settings/app/
│   ├── route.ts (POST - upload & save)
│   └── public/route.ts (GET - public access)
│
├── page.tsx (Homepage)
│   ├── fetchAppSettings()
│   └── Dynamic logo & name display
│
database/
└── add_app_settings_columns.sql
    ├── app_name column
    └── app_logo_url column
```

---

## 🧪 Testing

### Test 1: Upload Logo

```
1. Login sebagai admin
2. Buka /admin/settings
3. Klik tab "Aplikasi"
4. Klik "Upload Logo"
5. Pilih file JPG/PNG (< 2MB)
6. Expected:
   ✅ Preview tampil
   ✅ Remove button muncul
7. Klik "Simpan Pengaturan"
8. Expected:
   ✅ Success toast
   ✅ Logo tersimpan
```

### Test 2: Ubah Nama Aplikasi

```
1. Di tab "Aplikasi"
2. Ubah nama dari "SIPelan" ke "Sistem Pengaduan Disnaker"
3. Klik "Simpan Pengaturan"
4. Expected:
   ✅ Success toast
   ✅ Nama tersimpan
```

### Test 3: Homepage Display

```
1. Buka homepage (/)
2. Expected:
   ✅ Logo custom tampil di header
   ✅ Nama custom tampil di header
   ✅ Fallback ke default jika belum ada settings
```

### Test 4: File Validation

```
1. Upload file > 2MB
2. Expected: ❌ Error "Ukuran file maksimal 2MB"

3. Upload file PDF
4. Expected: ❌ Error "Format file harus JPG, PNG, atau SVG"
```

---

## 🐛 Troubleshooting

### Logo tidak tampil di homepage

**Check:**
```typescript
// 1. API response
console.log(await fetch('/api/settings/app/public'))
// Expected: { success: true, data: { app_logo_url: "..." } }

// 2. State
console.log(appLogo)
// Expected: "https://...supabase.co/..."

// 3. Render condition
{appLogo ? <img src={appLogo} /> : <DefaultIcon />}
```

**Solution:**
- Pastikan logo ter-upload ke Supabase Storage
- Pastikan bucket `pengaduan-files` is public
- Check CORS settings

### Upload gagal

**Check:**
```typescript
// 1. File size
console.log(file.size / 1024 / 1024) // MB
// Must be < 2

// 2. File type
console.log(file.type)
// Must be: image/jpeg, image/png, image/svg+xml

// 3. Supabase Storage
// Check bucket exists and is public
```

---

## 📊 Benefits

| Feature | Before | After |
|---------|--------|-------|
| **Logo** | ❌ Fixed icon | ✅ Custom logo |
| **Nama** | ❌ Fixed "SIPelan" | ✅ Custom name |
| **Branding** | ❌ Generic | ✅ Personalized |
| **Admin Control** | ❌ None | ✅ Full control |
| **User Experience** | ❌ Standard | ✅ Professional |

---

## ✅ Summary

**Admin sekarang bisa:**

1. ✅ **Upload logo** (JPG, PNG, SVG)
2. ✅ **Ubah nama aplikasi**
3. ✅ **Preview sebelum save**
4. ✅ **Remove logo**

**Homepage otomatis:**

1. ✅ **Load app settings** dari database
2. ✅ **Display custom logo** (jika ada)
3. ✅ **Display custom nama**
4. ✅ **Fallback ke default** (jika belum ada settings)

**Flow:**
```
Admin Settings → Upload & Save → Database → Homepage Display
```

**Hasil:**
- 🎨 Branding yang lebih profesional
- 🏢 Logo instansi tampil
- 📝 Nama aplikasi sesuai kebutuhan

**Contoh:**
- Logo: Logo Disnaker
- Nama: "Sistem Pengaduan Dinas Tenaga Kerja"

**✅ Aplikasi sekarang bisa di-customize sesuai branding instansi!** 🎨✅
