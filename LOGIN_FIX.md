# 🔧 Login Troubleshooting Guide

## ❌ Masalah: Tidak Bisa Login

### Kemungkinan Penyebab:

1. ❌ Table `sessions` belum dibuat
2. ❌ User belum ada di database
3. ❌ Password hash tidak valid
4. ❌ Environment variables tidak lengkap

---

## ✅ Solusi Cepat (5 Menit)

### Step 1: Cek Table Sessions

```sql
-- Run di Supabase SQL Editor
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'sessions'
) as sessions_exists;
```

**Jika `false`:**
```bash
# Copy & paste database/add_sessions_table.sql ke Supabase SQL Editor
# Klik Run
```

### Step 2: Cek User Exists

```sql
-- Cek semua users
SELECT username, email, role, is_active FROM users;
```

**Jika kosong atau admin tidak ada:**
```sql
-- Create admin user
-- Password: admin123
INSERT INTO users (username, email, password_hash, nama_lengkap, role, is_active)
VALUES (
    'admin',
    'admin@disnaker.go.id',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Administrator',
    'admin',
    true
)
ON CONFLICT (username) DO UPDATE 
SET password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
```

### Step 3: Cek Environment Variables

```bash
# File: .env atau .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key  # ⚠️ WAJIB!
```

### Step 4: Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 5: Test Login

**Admin:**
- Email: `admin@disnaker.go.id`
- Password: `admin123`

**Bidang HI:**
- Email: `hi@disnaker.go.id`
- Password: `bidang123`

---

## 🔍 Debug Mode

### Enable Console Logging

Tambahkan di `app/login/page.tsx`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  try {
    console.log('🔐 Attempting login...', { email: formData.email })
    
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    console.log('📡 Response status:', response.status)
    const data = await response.json()
    console.log('📦 Response data:', data)

    if (data.success) {
      console.log('✅ Login successful!')
      // ... rest of code
    } else {
      console.error('❌ Login failed:', data.message)
      toast.error(data.message || 'Login gagal')
    }
  } catch (error) {
    console.error('💥 Login error:', error)
    toast.error('Terjadi kesalahan saat login')
  } finally {
    setIsLoading(false)
  }
}
```

### Check Browser Console

1. Buka DevTools (F12)
2. Tab **Console**
3. Coba login
4. Lihat error messages

### Check Network Tab

1. Buka DevTools (F12)
2. Tab **Network**
3. Coba login
4. Klik request `/api/auth/login`
5. Lihat **Response**

---

## 🛠️ Generate Password Hash Baru

Jika password hash rusak:

```bash
# Generate hash baru
node scripts/generate-password.js admin123

# Output akan memberikan SQL untuk update
```

---

## 📊 Verification Queries

### Check Sessions Table

```sql
SELECT 
  COUNT(*) as total_sessions,
  COUNT(*) FILTER (WHERE expires_at > NOW()) as active_sessions
FROM sessions;
```

### Check Users

```sql
SELECT 
  username,
  email,
  role,
  is_active,
  LENGTH(password_hash) as hash_length,
  created_at
FROM users
ORDER BY created_at DESC;
```

### Check Recent Login Attempts

```sql
-- If you have logging table
SELECT * FROM sessions 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🚨 Common Errors

### Error: "Email atau password salah"

**Penyebab:**
- User tidak ada di database
- Password hash tidak match
- Email typo

**Solusi:**
```sql
-- Reset password admin
UPDATE users 
SET password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE username = 'admin';
```

### Error: "Akun tidak aktif"

**Solusi:**
```sql
-- Aktifkan user
UPDATE users 
SET is_active = true 
WHERE username = 'admin';
```

### Error: "Internal server error"

**Penyebab:**
- Table sessions tidak ada
- SUPABASE_SERVICE_KEY tidak set
- Database connection error

**Solusi:**
1. Run `database/add_sessions_table.sql`
2. Check `.env` file
3. Restart server

### Error: "Failed to create session"

**Penyebab:**
- Table sessions tidak ada
- Foreign key constraint error

**Solusi:**
```sql
-- Recreate sessions table
DROP TABLE IF EXISTS sessions CASCADE;

-- Then run add_sessions_table.sql
```

---

## ✅ Quick Test

### Test API Directly

```bash
# Test login API
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@disnaker.go.id","password":"admin123"}' \
  -v

# Should return:
# {"success":true,"message":"Login berhasil","data":{"user":{...}}}
```

### Test Session

```bash
# After login, test session
curl http://localhost:5000/api/auth/me \
  -H "Cookie: session_token=..." \
  -v
```

---

## 📞 Still Not Working?

### Checklist:

- [ ] Table `sessions` exists
- [ ] User exists in database
- [ ] Password hash is valid (60 chars, starts with `$2a$10$`)
- [ ] User `is_active = true`
- [ ] Environment variables set
- [ ] Dev server restarted
- [ ] Browser cache cleared
- [ ] No console errors

### Get Help:

1. Check browser console for errors
2. Check terminal for API errors
3. Run `database/troubleshoot_login.sql`
4. Check Supabase logs

---

## 🎯 Default Credentials

### Admin
```
Email: admin@disnaker.go.id
Password: admin123
```

### Bidang HI
```
Email: hi@disnaker.go.id  
Password: bidang123
```

### Bidang LATTAS
```
Email: lattas@disnaker.go.id
Password: bidang123
```

---

**✅ Setelah berhasil login, segera ganti password!**
