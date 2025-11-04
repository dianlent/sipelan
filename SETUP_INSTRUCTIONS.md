# 🚀 Panduan Setup Database SIPelan - Step by Step

## 📋 Checklist Setup

- [ ] Buka Supabase Dashboard
- [ ] Run SQL Script
- [ ] Verifikasi Data
- [ ] Test Login Admin
- [ ] Test Login Bidang

---

## 🎯 Langkah 1: Buka Supabase Dashboard

1. **Buka browser** dan akses: https://supabase.com
2. **Login** dengan akun Anda
3. **Pilih project**: `pdsfruupgjezqzigncjv`
4. **Klik "SQL Editor"** di sidebar kiri
5. **Klik "New query"**

---

## 📝 Langkah 2: Copy & Run SQL Script

### **Opsi A: Run Script Lengkap (Recommended)**

1. **Buka file**: `database/SETUP_COMPLETE.sql`
2. **Copy SEMUA isi file** (Ctrl+A, Ctrl+C)
3. **Paste ke SQL Editor** di Supabase (Ctrl+V)
4. **Klik "Run"** atau tekan `Ctrl+Enter`
5. **Tunggu sampai selesai** (sekitar 5-10 detik)

### **Opsi B: Run Per Section**

Jika ingin run per bagian, copy dan run satu per satu:

#### **Section 1: Create Tables**
```sql
-- Copy dari SECTION 2 di SETUP_COMPLETE.sql
-- Paste dan Run
```

#### **Section 2: Insert Data Master**
```sql
-- Copy dari SECTION 3 di SETUP_COMPLETE.sql
-- Paste dan Run
```

#### **Section 3: Create Users**
```sql
-- Copy dari SECTION 4 & 5 di SETUP_COMPLETE.sql
-- Paste dan Run
```

---

## ✅ Langkah 3: Verifikasi Setup

### **Check Tables**

Run query ini di SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected Output:**
```
bidang
disposisi
kategori_pengaduan
pengaduan
pengaduan_status
tanggapan
users
```

### **Check Kategori**

```sql
SELECT * FROM kategori_pengaduan;
```

**Expected Output:** 5 rows (Pengupahan, Ketenagakerjaan, K3, Pelatihan Kerja, Lainnya)

### **Check Bidang**

```sql
SELECT kode_bidang, nama_bidang FROM bidang ORDER BY kode_bidang;
```

**Expected Output:** 5 rows (HI, LATTAS, PTPK, BLK, SEKRETARIAT)

### **Check Users**

```sql
SELECT username, email, role, kode_bidang 
FROM users 
ORDER BY role, kode_bidang;
```

**Expected Output:** 6 users
- 1 admin
- 5 bidang

---

## 🔐 Langkah 4: Test Login

### **Test 1: Login Admin**

1. Buka: http://localhost:5000/login
2. Isi form:
   ```
   Email    : admin@sipelan.com
   Password : admin123
   ```
3. Click "Login"
4. Harus redirect ke: http://localhost:5000/admin
5. ✅ **Success jika masuk ke Admin Panel**

### **Test 2: Login Bidang**

1. Logout dari admin
2. Login dengan salah satu bidang:
   ```
   Email    : hi@disnaker.go.id
   Password : bidang123
   ```
3. Click "Login"
4. Harus redirect ke: http://localhost:5000/dashboard
5. ✅ **Success jika masuk ke Dashboard**

---

## 🎉 Langkah 5: Test Fitur Lengkap

### **Test Flow Lengkap:**

#### **1. Buat Pengaduan (Tanpa Login)**
```
URL: http://localhost:5000/pengaduan
- Isi form lengkap
- Submit
- Dapat kode tracking (contoh: ADU-2024-0001)
- Simpan kode ini!
```

#### **2. Login Admin & Disposisi**
```
URL: http://localhost:5000/admin
- Login sebagai admin
- Lihat pengaduan baru
- Click "Disposisi"
- Pilih bidang: HI
- Isi keterangan
- Submit
```

#### **3. Login Bidang & Proses**
```
URL: http://localhost:5000/login
- Login sebagai bidang_hi
- Lihat pengaduan yang didisposisi
- Proses pengaduan
```

#### **4. Tracking Pengaduan**
```
URL: http://localhost:5000/tracking
- Masukkan kode tracking
- Lihat detail & timeline
```

---

## 📊 Kredensial Lengkap

### **👤 Admin**
```
Username : admin
Email    : admin@sipelan.com
Password : admin123
Role     : admin
Access   : Full (Admin Panel + Dashboard)
URL      : http://localhost:5000/admin
```

### **🏢 Bidang HI**
```
Username : bidang_hi
Email    : hi@disnaker.go.id
Password : bidang123
Role     : bidang
Kode     : HI
Access   : Dashboard + Pengaduan Assigned
```

### **🏢 Bidang LATTAS**
```
Username : bidang_lattas
Email    : lattas@disnaker.go.id
Password : bidang123
Role     : bidang
Kode     : LATTAS
Access   : Dashboard + Pengaduan Assigned
```

### **🏢 Bidang PTPK**
```
Username : bidang_ptpk
Email    : ptpk@disnaker.go.id
Password : bidang123
Role     : bidang
Kode     : PTPK
Access   : Dashboard + Pengaduan Assigned
```

### **🏢 Bidang BLK**
```
Username : bidang_blk
Email    : blk@disnaker.go.id
Password : bidang123
Role     : bidang
Kode     : BLK
Access   : Dashboard + Pengaduan Assigned
```

### **🏢 Bidang Sekretariat**
```
Username : bidang_sekretariat
Email    : sekretariat@disnaker.go.id
Password : bidang123
Role     : bidang
Kode     : SEKRETARIAT
Access   : Dashboard + Pengaduan Assigned
```

---

## 🔧 Troubleshooting

### **Error: "relation already exists"**

**Solusi:** Tables sudah ada. Skip create tables atau drop dulu:

```sql
DROP TABLE IF EXISTS tanggapan CASCADE;
DROP TABLE IF EXISTS disposisi CASCADE;
DROP TABLE IF EXISTS pengaduan_status CASCADE;
DROP TABLE IF EXISTS pengaduan CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS bidang CASCADE;
DROP TABLE IF EXISTS kategori_pengaduan CASCADE;
```

### **Error: "duplicate key value"**

**Solusi:** Data sudah ada. Script menggunakan `ON CONFLICT DO NOTHING`, jadi aman di-run ulang.

### **Error: "column kode_bidang does not exist"**

**Solusi:** Run script ini dulu:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS kode_bidang VARCHAR(20);
ALTER TABLE users ADD CONSTRAINT fk_users_bidang 
FOREIGN KEY (kode_bidang) REFERENCES bidang(kode_bidang);
```

### **Login Gagal**

**Check:**
1. ✅ User sudah dibuat di database
2. ✅ Password hash benar
3. ✅ Email benar (case sensitive)
4. ✅ is_active = true

**Query untuk check:**
```sql
SELECT username, email, is_active FROM users WHERE email = 'admin@sipelan.com';
```

---

## 📞 Support

Jika masih ada masalah:

1. **Check Supabase Logs**
   - Klik "Logs" di Supabase Dashboard
   - Lihat error messages

2. **Check Browser Console**
   - Tekan F12
   - Lihat tab Console
   - Screenshot error jika ada

3. **Verifikasi Environment**
   - Check `.env.local`
   - Pastikan SUPABASE_URL dan keys benar

---

## ✨ Setup Selesai!

Jika semua langkah di atas berhasil, maka:

✅ Database sudah setup
✅ 6 users sudah dibuat (1 admin + 5 bidang)
✅ Data master sudah terisi
✅ Siap untuk production!

**Selamat menggunakan SIPelan! 🎉**

---

## 📝 Next Steps

1. ✅ Test semua fitur
2. ✅ Customize data master sesuai kebutuhan
3. ✅ Setup email notifications
4. ✅ Deploy ke production
5. ✅ Training user

---

**Happy Coding! 💻**
