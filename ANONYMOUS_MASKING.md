# Fitur Masking Data Anonim

## Overview
Sistem ini mengimplementasikan fitur masking untuk melindungi identitas pelapor yang memilih untuk mengajukan pengaduan secara anonim. Data lengkap tetap disimpan di backend untuk keperluan administrasi, namun ditampilkan dengan masking di tampilan publik.

## Cara Kerja

### 1. **Penyimpanan Data (Backend)**
- Semua data pelapor (nama lengkap, email, no. telepon) **SELALU disimpan lengkap** di database
- Field `anonim` (boolean) menandai apakah pengaduan bersifat anonim
- Data asli dapat diakses oleh admin dan staff bidang untuk keperluan verifikasi dan komunikasi

### 2. **Tampilan Data (Frontend)**

#### Untuk Publik (Tracking Page)
Jika pengaduan ditandai sebagai anonim (`anonim = true`):
- **Nama**: Di-mask dengan pola `C**r*` (contoh: "Citra" → "C**r*", "John Doe" → "J**n D*e")
- **Email**: Di-mask dengan pola `u***@e******.com` (contoh: "user@example.com" → "u***@e******.com")

#### Untuk Admin/Staff Bidang
- Menampilkan **nama dan email lengkap** (tidak di-mask)
- Ditambahkan label **"(Anonim - Data Internal)"** untuk mengingatkan bahwa data ini sensitif
- Warning: "⚠️ Data ini hanya untuk keperluan internal dan tidak ditampilkan ke publik"

## Implementasi Teknis

### Utility Functions (`lib/utils.ts`)

```typescript
// Masking nama
maskName("Citra") // Output: "C**r*"
maskName("John Doe") // Output: "J**n D*e"

// Masking email
maskEmail("user@example.com") // Output: "u***@e******.com"
```

### Algoritma Masking Nama
1. Pisahkan nama berdasarkan spasi (untuk nama lengkap)
2. Untuk setiap kata:
   - 1 karakter: tampilkan apa adanya
   - 2 karakter: tampilkan karakter pertama + `*`
   - 3 karakter: tampilkan karakter pertama + `*` + karakter terakhir
   - 4+ karakter: tampilkan karakter pertama + `***...` + karakter terakhir

### Algoritma Masking Email
1. Pisahkan local part dan domain (`user@example.com` → `user` + `example.com`)
2. Local part: tampilkan karakter pertama + maksimal 3 bintang
3. Domain: tampilkan karakter pertama + maksimal 6 bintang + TLD

## File yang Dimodifikasi

### 1. **lib/utils.ts** (Baru)
- `maskName()`: Function untuk masking nama
- `maskEmail()`: Function untuk masking email
- `formatDate()`: Helper untuk format tanggal

### 2. **app/api/pengaduan/route.ts**
- Menyimpan data lengkap ke database (tidak di-mask)
- Field `anonim` disimpan sebagai flag

### 3. **app/api/pengaduan/tracking/[kode]/route.ts**
- Menerapkan masking saat mengembalikan data ke publik
- Jika `anonim = true`, gunakan `maskName()` dan `maskEmail()`

### 4. **app/dashboard/page.tsx**
- Import `maskName` dari `lib/utils`
- Tampilkan nama yang di-mask jika `anonim = true`

### 5. **app/bidang/page.tsx**
- Menampilkan nama lengkap (tidak di-mask) untuk staff bidang
- Menambahkan label "(Anonim - Data Internal)" dan warning

## Contoh Penggunaan

### Skenario 1: Pengaduan Anonim
```typescript
// Data di database
{
  nama_pelapor: "Citra Dewi",
  email_pelapor: "citra.dewi@gmail.com",
  anonim: true
}

// Tampilan untuk publik (tracking page)
Nama: "C**r* D**i"
Email: "c****@g****.com"

// Tampilan untuk admin/bidang
Nama: "Citra Dewi (Anonim - Data Internal)"
Email: "citra.dewi@gmail.com"
⚠️ Data ini hanya untuk keperluan internal
```

### Skenario 2: Pengaduan Non-Anonim
```typescript
// Data di database
{
  nama_pelapor: "Budi Santoso",
  email_pelapor: "budi@example.com",
  anonim: false
}

// Tampilan untuk publik dan admin (sama)
Nama: "Budi Santoso"
Email: "budi@example.com"
```

## Keamanan dan Privasi

1. **Data Asli Aman**: Data lengkap hanya bisa diakses oleh admin dan staff yang berwenang
2. **Masking Konsisten**: Algoritma masking menghasilkan output yang konsisten
3. **Tidak Reversible**: Masking tidak bisa di-reverse untuk mendapatkan data asli
4. **Audit Trail**: Data asli tetap tersimpan untuk keperluan audit dan investigasi

## Testing

### Test Case 1: Nama Pendek
```
Input: "Ali"
Output: "A*i"
```

### Test Case 2: Nama Panjang
```
Input: "Muhammad Abdullah"
Output: "M******h A******h"
```

### Test Case 3: Email
```
Input: "very.long.email@subdomain.example.com"
Output: "v***@s******.com"
```

## Catatan Penting

⚠️ **JANGAN** hapus atau ubah data asli di database
⚠️ **SELALU** gunakan masking di level presentasi (frontend/API response)
⚠️ **PASTIKAN** staff internal memahami bahwa data anonim bersifat sensitif

## Maintenance

Jika perlu mengubah pola masking:
1. Edit function `maskName()` atau `maskEmail()` di `lib/utils.ts`
2. Test dengan berbagai input untuk memastikan tidak ada data yang bocor
3. Update dokumentasi ini dengan pola baru
