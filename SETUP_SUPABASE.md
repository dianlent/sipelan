# 🔌 Setup Supabase Integration - Complete Guide

## ⚠️ MASALAH: Invalid API Key

Koneksi ke Supabase gagal karena **SUPABASE_SERVICE_KEY tidak valid**.

---

## ✅ SOLUSI: Dapatkan API Keys yang Benar

### Step 1: Buka Supabase Dashboard

1. Login ke [https://supabase.com](https://supabase.com)
2. Pilih project: **pdsfruupgjezqzigncjv** (dari URL Anda)
3. Klik **Settings** (⚙️) di sidebar kiri
4. Klik **API**

### Step 2: Copy API Keys

Anda akan melihat 3 keys:

#### 1. **Project URL** ✅ (Sudah Benar)
```
https://pdsfruupgjezqzigncjv.supabase.co
```

#### 2. **anon public** ✅ (Sudah Benar)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkc2ZydXVwZ2plenF6aWduY2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2OTYzOTAsImV4cCI6MjA0NjI3MjM5MH0.dEuvP-ZjCrZ10-8Pk_Bke-gW3g4KD_wmnJRt7Tuw6o8
```

#### 3. **service_role secret** ⚠️ (PERLU DIGANTI)
- Klik **Reveal** untuk melihat
- Copy key yang **PANJANG** (biasanya 200+ karakter)
- **JANGAN** share key ini ke public!

### Step 3: Update .env File

```env
# File: .env

NEXT_PUBLIC_SUPABASE_URL=https://pdsfruupgjezqzigncjv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkc2ZydXVwZ2plenF6aWduY2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2OTYzOTAsImV4cCI6MjA0NjI3MjM5MH0.dEuvP-ZjCrZ10-8Pk_Bke-gW3g4KD_wmnJRt7Tuw6o8
SUPABASE_SERVICE_KEY=<PASTE_SERVICE_ROLE_KEY_HERE>
```

### Step 4: Restart Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 5: Test Connection

```bash
node scripts/test-supabase-connection.js
```

Harusnya output:
```
✅ Tables exist
✅ Found X users
✅ Sessions table exists
```

---

## 📋 Setup Database Schema

Jika tables belum ada, jalankan SQL ini di Supabase SQL Editor:

### 1. Create All Tables

```bash
# Copy & paste: database/schema.sql
# Klik "Run"
```

### 2. Create Sessions Table

```bash
# Copy & paste: database/add_sessions_table.sql
# Klik "Run"
```

### 3. Create Users

```bash
# Copy & paste: FIX_LOGIN_NOW.sql
# Klik "Run"
```

---

## 🔍 Verify Setup

### Check Tables

```sql
-- Run di Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected tables:
- ✅ bidang
- ✅ disposisi
- ✅ kategori_pengaduan
- ✅ pengaduan
- ✅ pengaduan_status
- ✅ sessions
- ✅ tanggapan
- ✅ users

### Check Users

```sql
SELECT username, email, role, is_active 
FROM users;
```

Expected:
- ✅ admin (admin@disnaker.go.id)
- ✅ bidang_hi (hi@disnaker.go.id)

---

## 🚀 Test Login

Setelah setup selesai:

1. Buka [http://localhost:5000/login](http://localhost:5000/login)
2. Login dengan:
   - Email: `admin@disnaker.go.id`
   - Password: `admin123`
3. Harusnya berhasil!

---

## 🔧 Troubleshooting

### Error: "Invalid API key"

**Penyebab:** SUPABASE_SERVICE_KEY salah

**Solusi:**
1. Buka Supabase Dashboard → Settings → API
2. Copy **service_role** key (yang panjang)
3. Update `.env`
4. Restart server

### Error: "relation does not exist"

**Penyebab:** Tables belum dibuat

**Solusi:**
1. Run `database/schema.sql` di Supabase SQL Editor
2. Run `database/add_sessions_table.sql`
3. Run `FIX_LOGIN_NOW.sql`

### Error: "Failed to create session"

**Penyebab:** Sessions table belum ada

**Solusi:**
1. Run `database/add_sessions_table.sql`

---

## 📸 Screenshot Lokasi API Keys

```
Supabase Dashboard
└── Settings (⚙️)
    └── API
        ├── Project URL ✅
        ├── Project API keys
        │   ├── anon public ✅
        │   └── service_role [Reveal] ⚠️ COPY INI!
        └── JWT Settings
```

---

## ✅ Checklist Setup

- [ ] Dapatkan service_role key dari Supabase
- [ ] Update SUPABASE_SERVICE_KEY di `.env`
- [ ] Restart dev server
- [ ] Run test connection script
- [ ] Run database/schema.sql
- [ ] Run database/add_sessions_table.sql
- [ ] Run FIX_LOGIN_NOW.sql
- [ ] Test login

---

## 📞 Need Help?

Jika masih error, jalankan:

```bash
# Test connection
node scripts/test-supabase-connection.js

# Check environment
node -e "console.log(require('dotenv').config({ path: '.env' })); console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL); console.log('Service Key length:', process.env.SUPABASE_SERVICE_KEY?.length);"
```

Service key yang benar biasanya **200+ karakter**.

---

**⚠️ PENTING: Jangan commit `.env` ke Git!**

File `.env` sudah ada di `.gitignore`.
