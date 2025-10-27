# Quick Start Guide - Form Pengaduan

## 🚀 Akses Form

1. **Dari Homepage**: Klik tombol "Buat Pengaduan" di hero section
2. **Dari Menu**: Klik "Buat Aduan" di navigation header
3. **Direct URL**: `http://localhost:3000/buat-aduan`

## 📝 Cara Mengisi Form

### Step 1: Data Pelapor
Isi informasi pribadi Anda:
- Nama lengkap sesuai KTP
- NIK 16 digit
- Email aktif (untuk notifikasi)
- Nomor telepon yang bisa dihubungi
- Alamat lengkap

### Step 2: Detail Pengaduan
Jelaskan masalah Anda:
- Pilih kategori yang sesuai
- Buat judul yang ringkas
- Tulis deskripsi lengkap (min. 20 karakter)
- Sebutkan lokasi kejadian
- Pilih tanggal kejadian

### Step 3: Upload Bukti (Opsional)
- Klik "Choose Files" atau drag & drop
- Maksimal 5 file
- Format: JPG, PNG, PDF, DOC, DOCX
- Ukuran maks: 5MB per file

### Step 4: Submit
- Review semua data
- Klik "Kirim Pengaduan"
- Tunggu 2 detik (simulasi)
- Simpan nomor tiket yang muncul!

## ✅ Setelah Submit

Anda akan melihat:
1. **Nomor Tiket** (contoh: ADU-202410-3847)
2. **Informasi penting**:
   - Pengaduan diproses maks. 3x24 jam
   - Email notifikasi akan dikirim
   - Cara tracking status

3. **Tombol Aksi**:
   - "Lacak Pengaduan" → Tracking page
   - "Kembali ke Beranda" → Homepage

## 🔍 Testing Form

### Test Data untuk Development

```
Nama: Budi Santoso
NIK: 3319012345678901
Email: budi.santoso@example.com
Telepon: 081234567890
Alamat: Jl. Merdeka No. 123, Pati, Jawa Tengah

Kategori: Upah/Gaji Tidak Dibayar
Judul: Gaji Bulan September Belum Dibayar
Deskripsi: Saya bekerja di PT XYZ sejak Januari 2024. Gaji bulan September 2024 belum dibayarkan hingga akhir Oktober. Sudah menghubungi HRD namun tidak ada tanggapan.
Lokasi: PT XYZ, Pati
Tanggal: 2024-09-30
```

### Validasi yang Akan Diuji

1. **NIK tidak 16 digit** → Error: "NIK harus 16 digit angka"
2. **Email salah format** → Error: "Format email tidak valid"
3. **Telepon kurang dari 10 digit** → Error: "Nomor telepon tidak valid"
4. **Deskripsi < 20 karakter** → Error: "Deskripsi minimal 20 karakter"
5. **File > 5MB** → Error: "Beberapa file melebihi ukuran maksimal 5MB"

## 🎯 Fitur Utama

### ✨ User Experience
- **Auto-scroll ke error**: Form otomatis scroll ke field yang error
- **Real-time validation**: Error hilang saat mulai mengetik
- **Character counter**: Hitung karakter deskripsi real-time
- **File preview**: Lihat file yang dipilih sebelum upload
- **Loading state**: Button disabled saat submit dengan spinner
- **Responsive**: Sempurna di mobile, tablet, dan desktop

### 🛡️ Keamanan
- Client-side validation untuk UX
- Server-side validation (perlu implementasi backend)
- File type validation
- File size validation
- Input sanitization (backend)

### ♿ Accessibility
- Keyboard navigation
- Screen reader friendly
- Clear error messages
- High contrast colors
- Touch-friendly buttons

## 🐛 Troubleshooting

### Form tidak submit?
- Cek semua field required sudah diisi
- Pastikan tidak ada error message
- Cek console browser untuk error

### File tidak bisa diupload?
- Pastikan ukuran < 5MB
- Cek format file (JPG, PNG, PDF, DOC, DOCX)
- Maksimal 5 file

### Validasi error terus muncul?
- NIK harus tepat 16 digit angka
- Email harus format valid (ada @ dan domain)
- Telepon 10-13 digit
- Deskripsi minimal 20 karakter

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px (Stack layout)
- **Tablet**: 768px - 1023px (2 columns untuk beberapa field)
- **Desktop**: 1024px+ (Optimal layout)

## 🎨 Customization

### Mengubah Kategori
Edit `src/app/buat-aduan/page.tsx`:
```typescript
const kategoriOptions = [
  "Kategori Baru",
  // ... existing
];
```

### Mengubah Validasi
Edit fungsi `validateForm()` di file yang sama

### Mengubah Warna
Edit `tailwind.config.ts` atau `globals.css`

## 📞 Support

Jika ada masalah:
1. Cek dokumentasi lengkap di `FORM_DOCUMENTATION.md`
2. Cek console browser untuk error
3. Restart development server
4. Clear browser cache

---

**Happy Testing! 🎉**
