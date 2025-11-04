# 📊 Database Setup Guide - SIPelan

## 🚀 Langkah-Langkah Setup Database

### 1️⃣ Setup Schema Database

1. **Buka Supabase Dashboard**
   - Login ke https://supabase.com
   - Pilih project Anda: `pdsfruupgjezqzigncjv`

2. **Buka SQL Editor**
   - Klik **"SQL Editor"** di sidebar kiri
   - Klik **"New query"**

3. **Jalankan Schema**
   - Buka file: `database/schema.sql`
   - Copy semua isi file
   - Paste ke SQL Editor
   - Klik **"Run"** atau tekan `Ctrl+Enter`

4. **Verifikasi**
   - Klik **"Table Editor"** di sidebar
   - Pastikan tables sudah dibuat:
     - ✅ users
     - ✅ kategori_pengaduan
     - ✅ bidang
     - ✅ pengaduan
     - ✅ disposisi
     - ✅ status_history

---

### 2️⃣ Buat User Admin

#### **Opsi A: Menggunakan SQL Script (Recommended)**

1. **Buka SQL Editor** di Supabase
2. **Copy SQL berikut:**

```sql
-- Insert user admin
INSERT INTO users (
    username,
    email,
    password_hash,
    nama_lengkap,
    role,
    is_active
) VALUES (
    'admin',
    'admin@sipelan.com',
    '$2a$10$cMyyHuv7DFDW2r0Erf6qWe19XfK8sZpwZvUQxnxkc/.oHDFV3YH8u',
    'Administrator SIPelan',
    'admin',
    true
);
```

3. **Paste dan Run** di SQL Editor
4. **Verifikasi** dengan query:

```sql
SELECT id, username, email, nama_lengkap, role 
FROM users 
WHERE role = 'admin';
```

#### **Opsi B: Menggunakan Node.js Script**

```bash
# Jalankan script generator
node scripts/create-admin.js

# Copy SQL yang dihasilkan
# Paste ke Supabase SQL Editor
# Run
```

---

### 3️⃣ Kredensial Login Admin

Setelah user admin dibuat, gunakan kredensial berikut untuk login:

```
📧 Email    : admin@sipelan.com
🔑 Password : admin123
👤 Role     : admin
```

**URL Login:** http://localhost:5000/login

---

### 4️⃣ Setup Data Master (Optional)

#### **Kategori Pengaduan**

```sql
INSERT INTO kategori_pengaduan (nama_kategori, deskripsi) VALUES
('Pengupahan', 'Masalah gaji, upah minimum, tunjangan'),
('Ketenagakerjaan', 'PHK, kontrak kerja, jam kerja'),
('K3', 'Keselamatan dan kesehatan kerja'),
('Pelatihan Kerja', 'Program pelatihan dan penempatan'),
('Lainnya', 'Pengaduan lainnya');
```

#### **Bidang**

```sql
INSERT INTO bidang (kode_bidang, nama_bidang, email_bidang) VALUES
('HI', 'Bidang Hubungan Industrial', 'hi@disnaker.go.id'),
('LATTAS', 'Bidang Latihan Kerja dan Produktivitas', 'lattas@disnaker.go.id'),
('PTPK', 'Bidang PTPK', 'ptpk@disnaker.go.id'),
('BLK', 'UPTD BLK Pati', 'blk@disnaker.go.id'),
('SEKRETARIAT', 'Sekretariat', 'sekretariat@disnaker.go.id');
```

---

## 🔐 User Roles

| Role | Akses | Fitur |
|------|-------|-------|
| **masyarakat** | Dashboard, Pengaduan, Tracking | Buat pengaduan, lihat riwayat sendiri |
| **bidang** | Dashboard, Pengaduan assigned | Proses pengaduan yang didisposisi |
| **admin** | Full access | Disposisi, manajemen semua pengaduan |

---

## 📝 Membuat User Lain

### User Masyarakat (via Register)

1. Buka: http://localhost:5000/register
2. Isi form registrasi
3. Role otomatis: `masyarakat`

### User Bidang (via SQL)

```sql
-- Contoh: User untuk Bidang HI
INSERT INTO users (
    username,
    email,
    password_hash,
    nama_lengkap,
    role,
    kode_bidang,
    is_active
) VALUES (
    'bidang_hi',
    'hi@disnaker.go.id',
    '$2a$10$cMyyHuv7DFDW2r0Erf6qWe19XfK8sZpwZvUQxnxkc/.oHDFV3YH8u',
    'Kepala Bidang HI',
    'bidang',
    'HI',
    true
);
```

**Password:** admin123 (sama dengan admin untuk testing)

---

## 🔧 Troubleshooting

### Error: "duplicate key value violates unique constraint"

**Solusi:** User sudah ada. Hapus dulu atau gunakan email berbeda.

```sql
-- Hapus user admin yang lama
DELETE FROM users WHERE email = 'admin@sipelan.com';

-- Lalu insert ulang
```

### Error: "relation users does not exist"

**Solusi:** Schema belum di-run. Jalankan `database/schema.sql` terlebih dahulu.

### Error: "permission denied"

**Solusi:** Pastikan menggunakan Supabase service role key, bukan anon key.

---

## 📊 Verifikasi Setup

Jalankan query berikut untuk memastikan semua sudah setup:

```sql
-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check admin user
SELECT username, email, role 
FROM users 
WHERE role = 'admin';

-- Check kategori
SELECT * FROM kategori_pengaduan;

-- Check bidang
SELECT kode_bidang, nama_bidang 
FROM bidang;
```

---

## 🎯 Testing Flow

### 1. Test Admin Login

```
URL: http://localhost:5000/login
Email: admin@sipelan.com
Password: admin123
```

### 2. Test Buat Pengaduan (Tanpa Login)

```
URL: http://localhost:5000/pengaduan
Isi form → Submit → Dapat kode tracking
```

### 3. Test Disposisi (Admin)

```
Login sebagai admin
Buka: http://localhost:5000/admin
Click "Disposisi" pada pengaduan
Pilih bidang → Submit
```

### 4. Test Tracking

```
URL: http://localhost:5000/tracking
Masukkan kode tracking
Lihat detail pengaduan
```

---

## 📞 Support

Jika ada masalah, check:
1. ✅ Schema sudah di-run
2. ✅ User admin sudah dibuat
3. ✅ Environment variables sudah benar
4. ✅ Supabase connection berhasil

---

**Database setup selesai! Selamat menggunakan SIPelan! 🎉**
