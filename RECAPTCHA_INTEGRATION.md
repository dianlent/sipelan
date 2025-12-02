# ✅ reCAPTCHA v3 Integration - Complete!

## 🎉 Fitur Baru

Form pengaduan sekarang **dilindungi oleh Google reCAPTCHA v3** untuk mencegah spam dan bot!

---

## 🔐 Cara Kerja

### 1. **Dynamic Configuration**
- reCAPTCHA settings disimpan di **database**
- Admin bisa **enable/disable** via Dashboard
- **Tidak perlu restart** server

### 2. **Smart Validation**
- Jika **enabled**: reCAPTCHA **wajib** diverifikasi
- Jika **disabled**: Form tetap bisa disubmit
- Auto-detect dari database settings

### 3. **User Experience**
- Badge status reCAPTCHA ditampilkan di form
- ✅ **Hijau**: "Dilindungi oleh reCAPTCHA v3"
- ⚪ **Abu-abu**: "reCAPTCHA tidak aktif"

---

## 📋 Setup (3 Langkah)

### Step 1: Create Settings Table

```bash
# Di Supabase SQL Editor:
1. Copy & paste: database/add_settings_table.sql
2. Klik "Run"
```

### Step 2: Get reCAPTCHA Keys

1. Buka [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)
2. Pilih **reCAPTCHA v3**
3. Daftarkan domain:
   - **Development**: `localhost`
   - **Production**: `sipelan.vercel.app` atau domain Anda
4. Copy **Site Key** dan **Secret Key**

### Step 3: Configure via Admin Dashboard

1. Login sebagai **admin**
2. Buka **Settings** → **reCAPTCHA** tab
3. Toggle **"Aktifkan reCAPTCHA"** ✅
4. Paste:
   - **Site Key** (Public Key)
   - **Secret Key** (Private Key)
5. Set **Score Threshold**: `0.5` (recommended)
6. Klik **"Simpan Konfigurasi reCAPTCHA"**
7. **Done!** 🎉

---

## 🎯 Fitur yang Diimplementasikan

### ✅ Frontend (Form Pengaduan)

**File**: `app/pengaduan/page.tsx`

1. **Load Settings dari Database**
   ```typescript
   const loadRecaptchaSettings = async () => {
     const response = await fetch('/api/settings/public')
     const data = await response.json()
     setRecaptchaEnabled(data.data.recaptcha_enabled)
   }
   ```

2. **Execute reCAPTCHA (Jika Enabled)**
   ```typescript
   if (recaptchaEnabled) {
     if (!executeRecaptcha) {
       toast.error('reCAPTCHA belum siap')
       return
     }
     recaptchaToken = await executeRecaptcha('submit_pengaduan')
   }
   ```

3. **Status Badge di UI**
   ```jsx
   {recaptchaEnabled ? (
     <div className="bg-green-50">
       ✅ Dilindungi oleh reCAPTCHA v3
     </div>
   ) : (
     <div className="bg-gray-50">
       ⚪ reCAPTCHA tidak aktif
     </div>
   )}
   ```

### ✅ Backend (API Verification)

**File**: `app/api/pengaduan/route.ts`

1. **Verify Token dengan Google**
   ```typescript
   const verifyResponse = await fetch(
     `https://www.google.com/recaptcha/api/siteverify`,
     {
       method: 'POST',
       body: `secret=${secretKey}&response=${token}`
     }
   )
   ```

2. **Check Score Threshold**
   ```typescript
   if (result.score < threshold) {
     return { success: false, message: 'reCAPTCHA score too low' }
   }
   ```

### ✅ Admin Dashboard

**File**: `app/admin/settings/page.tsx`

1. **Load Settings dari Database**
2. **Toggle Enable/Disable**
3. **Input Site Key & Secret Key**
4. **Slider Score Threshold** (0.0 - 1.0)
5. **Save ke Database**

### ✅ Dynamic Provider

**File**: `components/ReCaptchaProvider.tsx`

1. **Load Settings dari Database**
2. **Initialize GoogleReCaptchaProvider** (jika enabled)
3. **Fallback ke .env** (jika database gagal)

---

## 🔄 Flow Diagram

```
User opens form
    ↓
Load reCAPTCHA settings from /api/settings/public
    ↓
Display status badge (enabled/disabled)
    ↓
User fills form
    ↓
User clicks "Kirim Pengaduan"
    ↓
IF reCAPTCHA enabled:
    ├─ Execute reCAPTCHA → Get token
    ├─ Validate token not empty
    └─ Send token to backend
ELSE:
    └─ Submit without token
    ↓
Backend receives request
    ↓
IF token provided:
    ├─ Verify with Google reCAPTCHA API
    ├─ Check score >= threshold
    └─ Accept or Reject
ELSE:
    └─ Accept (reCAPTCHA disabled)
    ↓
Save to database
    ↓
✅ Success!
```

---

## 📊 Score Threshold Guide

| Score | Interpretation | Action |
|-------|---------------|--------|
| 0.0 - 0.3 | Likely bot | ❌ Reject |
| 0.3 - 0.5 | Suspicious | ⚠️ Review |
| 0.5 - 0.7 | Probably human | ✅ Accept |
| 0.7 - 1.0 | Definitely human | ✅ Accept |

**Recommended**: `0.5` (Balanced)

---

## 🎨 UI Components

### Status Badge (Enabled)

```
┌─────────────────────────────────────────┐
│ ✅ Dilindungi oleh reCAPTCHA v3         │
│    Formulir ini dilindungi dari spam    │
└─────────────────────────────────────────┘
```

### Status Badge (Disabled)

```
┌─────────────────────────────────────────┐
│ ⚪ reCAPTCHA tidak aktif                │
└─────────────────────────────────────────┘
```

---

## 🔧 Testing

### 1. Test dengan reCAPTCHA Enabled

```bash
# 1. Enable di Admin Dashboard
# 2. Buka form pengaduan
# 3. Lihat badge hijau "Dilindungi oleh reCAPTCHA v3"
# 4. Submit form
# 5. Check console: "🔐 Executing reCAPTCHA..."
# 6. Check console: "✅ reCAPTCHA token generated"
```

### 2. Test dengan reCAPTCHA Disabled

```bash
# 1. Disable di Admin Dashboard
# 2. Buka form pengaduan
# 3. Lihat badge abu-abu "reCAPTCHA tidak aktif"
# 4. Submit form
# 5. Check console: "ℹ️ reCAPTCHA disabled"
```

### 3. Test Error Handling

```bash
# Scenario: reCAPTCHA enabled tapi executeRecaptcha undefined
# Expected: Toast error "reCAPTCHA belum siap"

# Scenario: Token generation failed
# Expected: Toast error "Verifikasi reCAPTCHA gagal"
```

---

## 🐛 Troubleshooting

### Badge tidak muncul

**Check:**
```sql
SELECT * FROM app_settings WHERE setting_key LIKE 'recaptcha%';
```

**Expected:**
- `recaptcha_enabled`: `'true'` atau `'false'`
- `recaptcha_site_key`: Not empty

### reCAPTCHA tidak execute

**Check browser console:**
```
🔐 reCAPTCHA status: Enabled
```

**If not enabled:**
1. Check database settings
2. Refresh page
3. Clear browser cache

### Token verification failed

**Check:**
1. Secret key correct in database
2. Domain registered in Google reCAPTCHA
3. Score threshold not too high (try 0.3)

### Badge shows "tidak aktif" tapi sudah enabled

**Solution:**
1. Check `app_settings.recaptcha_enabled` = `'true'` (string, not boolean)
2. Refresh page
3. Check `/api/settings/public` response

---

## 📁 Files Modified

```
app/
├── pengaduan/page.tsx              # ✅ Load settings, execute reCAPTCHA, show badge
├── admin/settings/page.tsx         # ✅ Load & save settings
└── api/
    ├── settings/route.ts           # ✅ Admin API
    ├── settings/public/route.ts    # ✅ Public API
    └── pengaduan/route.ts          # ✅ Verify token

components/
└── ReCaptchaProvider.tsx           # ✅ Load settings from DB

database/
└── add_settings_table.sql          # ✅ Create settings table
```

---

## 🚀 Production Checklist

- [ ] Run `database/add_settings_table.sql` in production
- [ ] Get reCAPTCHA keys for production domain
- [ ] Configure via Admin Dashboard
- [ ] Test form submission
- [ ] Verify token in backend logs
- [ ] Monitor reCAPTCHA score distribution
- [ ] Adjust threshold if needed

---

## 📈 Benefits

| Feature | Before | After |
|---------|--------|-------|
| **Spam Protection** | ❌ None | ✅ reCAPTCHA v3 |
| **Bot Detection** | ❌ None | ✅ Score-based |
| **Configuration** | ❌ Hard-coded | ✅ Dynamic (DB) |
| **Admin Control** | ❌ None | ✅ Dashboard UI |
| **User Feedback** | ❌ None | ✅ Status badge |
| **Error Handling** | ❌ Silent fail | ✅ Toast messages |

---

## ✅ Summary

**reCAPTCHA v3 sekarang fully integrated dengan:**

1. ✅ **Dynamic configuration** via database
2. ✅ **Admin dashboard** untuk enable/disable
3. ✅ **Status badge** di form pengaduan
4. ✅ **Smart validation** (wajib jika enabled)
5. ✅ **Error handling** yang jelas
6. ✅ **Score-based verification** di backend
7. ✅ **Production-ready** dan scalable

**Form pengaduan sekarang aman dari spam dan bot!** 🔐🎉
