# 🔐 reCAPTCHA v3 Setup - Dynamic Configuration

## ✅ Sistem Baru: Database-Based Configuration

reCAPTCHA settings sekarang disimpan di **database** dan bisa diubah melalui **Admin Settings** tanpa perlu edit `.env` atau restart server!

---

## 🎯 Keuntungan

### Sebelum (Environment Variables):
- ❌ Harus edit `.env` file
- ❌ Harus restart server
- ❌ Tidak bisa diubah oleh admin
- ❌ Sulit untuk production

### Sesudah (Database):
- ✅ Ubah via Admin Dashboard
- ✅ Langsung aktif (no restart)
- ✅ Admin bisa manage sendiri
- ✅ Easy production deployment

---

## 📋 Setup (3 Langkah)

### Step 1: Create Settings Table

```bash
# Di Supabase SQL Editor, run:
database/add_settings_table.sql
```

### Step 2: Get reCAPTCHA Keys

1. Buka [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)
2. Pilih **reCAPTCHA v3**
3. Daftarkan domain:
   - Development: `localhost`
   - Production: `sipelan.vercel.app`
4. Copy **Site Key** dan **Secret Key**

### Step 3: Configure via Admin Dashboard

1. Login sebagai admin
2. Buka **Settings** → **reCAPTCHA** tab
3. Toggle **Aktifkan reCAPTCHA**
4. Paste **Site Key** dan **Secret Key**
5. Set **Score Threshold** (0.5 recommended)
6. Klik **Simpan Konfigurasi reCAPTCHA**
7. **Done!** reCAPTCHA langsung aktif

---

## 🗄️ Database Schema

```sql
CREATE TABLE app_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- reCAPTCHA Settings
INSERT INTO app_settings (setting_key, setting_value, is_public) VALUES
('recaptcha_enabled', 'false', true),
('recaptcha_site_key', '', true),
('recaptcha_secret_key', '', false),
('recaptcha_score_threshold', '0.5', false);
```

---

## 🔄 How It Works

### 1. Admin Saves Settings

```
Admin Dashboard → Settings → reCAPTCHA
  ↓
POST /api/settings
  ↓
Save to app_settings table
  ↓
✅ Saved!
```

### 2. Frontend Loads Settings

```
ReCaptchaProvider (on mount)
  ↓
GET /api/settings/public
  ↓
Load recaptcha_enabled & recaptcha_site_key
  ↓
Initialize GoogleReCaptchaProvider
  ↓
✅ reCAPTCHA Active!
```

### 3. Form Submission

```
User submits form
  ↓
executeRecaptcha() → Get token
  ↓
POST /api/pengaduan (with token)
  ↓
Backend verifies token with secret_key
  ↓
Check score >= threshold
  ↓
✅ Accept or ❌ Reject
```

---

## 📁 File Structure

```
database/
└── add_settings_table.sql      # Create settings table

app/api/
├── settings/
│   ├── route.ts                # Admin: Get/Update settings
│   └── public/route.ts         # Public: Get public settings
└── pengaduan/route.ts          # Verify reCAPTCHA token

components/
└── ReCaptchaProvider.tsx       # Load settings from DB

app/admin/settings/
└── page.tsx                    # Admin UI for reCAPTCHA config
```

---

## 🚀 Usage

### Admin: Configure reCAPTCHA

```typescript
// Admin Settings Page
1. Toggle "Aktifkan reCAPTCHA"
2. Input Site Key & Secret Key
3. Set Score Threshold (0.0 - 1.0)
4. Click "Simpan"
```

### Frontend: Auto-Load

```typescript
// ReCaptchaProvider automatically loads from database
<ReCaptchaProvider>
  <App />
</ReCaptchaProvider>

// Settings loaded from /api/settings/public
// If enabled, GoogleReCaptchaProvider initialized
```

### Form: Use reCAPTCHA

```typescript
// In form component
const { executeRecaptcha } = useGoogleReCaptcha()

const handleSubmit = async () => {
  if (executeRecaptcha) {
    const token = await executeRecaptcha('submit_pengaduan')
    formData.append('recaptcha_token', token)
  }
  
  // Submit form
  await fetch('/api/pengaduan', { method: 'POST', body: formData })
}
```

---

## 🔧 API Endpoints

### GET /api/settings (Admin Only)

Get all settings including private keys.

**Response:**
```json
{
  "success": true,
  "data": {
    "recaptcha_enabled": true,
    "recaptcha_site_key": "6L...",
    "recaptcha_secret_key": "6L...",
    "recaptcha_score_threshold": 0.5
  }
}
```

### POST /api/settings (Admin Only)

Update settings.

**Request:**
```json
{
  "settings": {
    "recaptcha_enabled": true,
    "recaptcha_site_key": "6L...",
    "recaptcha_secret_key": "6L...",
    "recaptcha_score_threshold": 0.5
  }
}
```

### GET /api/settings/public (Public)

Get public settings only (site_key, enabled).

**Response:**
```json
{
  "success": true,
  "data": {
    "recaptcha_enabled": true,
    "recaptcha_site_key": "6L..."
  }
}
```

---

## 🔒 Security

### Public Settings (is_public = true)
- ✅ `recaptcha_enabled`
- ✅ `recaptcha_site_key`

### Private Settings (is_public = false)
- 🔒 `recaptcha_secret_key` (admin only)
- 🔒 `recaptcha_score_threshold` (admin only)

---

## 📊 Score Threshold

| Score | Meaning | Recommendation |
|-------|---------|----------------|
| 0.0 - 0.3 | Likely bot | Reject |
| 0.3 - 0.5 | Suspicious | Review |
| 0.5 - 0.7 | Probably human | **Accept** (Recommended) |
| 0.7 - 1.0 | Definitely human | Accept |

**Default: 0.5** (Balanced)

---

## ✅ Testing

### 1. Check Settings Table

```sql
SELECT * FROM app_settings WHERE setting_key LIKE 'recaptcha%';
```

### 2. Test Public API

```bash
curl http://localhost:5000/api/settings/public
```

### 3. Test Admin Save

1. Login as admin
2. Go to Settings → reCAPTCHA
3. Enable and save
4. Check database updated

### 4. Test Form

1. Open pengaduan form
2. Check browser console for reCAPTCHA logs
3. Submit form
4. Verify token sent to backend

---

## 🐛 Troubleshooting

### reCAPTCHA not loading

**Check:**
```sql
SELECT setting_key, setting_value 
FROM app_settings 
WHERE setting_key IN ('recaptcha_enabled', 'recaptcha_site_key');
```

**Expected:**
- `recaptcha_enabled`: `'true'`
- `recaptcha_site_key`: `'6L...'` (not empty)

### Settings not saving

**Check:**
1. User is admin
2. Session valid
3. Database connection OK
4. Check browser console for errors

### Token verification fails

**Check:**
1. Secret key correct
2. Domain registered in Google reCAPTCHA
3. Score threshold not too high

---

## 🔄 Migration from .env

If you had reCAPTCHA in `.env` before:

```sql
-- Copy from .env to database
UPDATE app_settings 
SET setting_value = 'true' 
WHERE setting_key = 'recaptcha_enabled';

UPDATE app_settings 
SET setting_value = 'YOUR_SITE_KEY_FROM_ENV' 
WHERE setting_key = 'recaptcha_site_key';

UPDATE app_settings 
SET setting_value = 'YOUR_SECRET_KEY_FROM_ENV' 
WHERE setting_key = 'recaptcha_secret_key';
```

Then remove from `.env` (optional).

---

## ✅ Checklist

- [ ] Run `database/add_settings_table.sql`
- [ ] Get reCAPTCHA keys from Google
- [ ] Configure via Admin Dashboard
- [ ] Test form submission
- [ ] Verify token in backend
- [ ] Check score threshold working

---

**✅ reCAPTCHA sekarang fully dynamic dan bisa diubah kapan saja via Admin Dashboard!** 🎉
