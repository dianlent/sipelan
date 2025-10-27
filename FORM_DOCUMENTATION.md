# Dokumentasi Halaman Buat Pengaduan

## ✅ Fitur yang Telah Diimplementasikan

### 1. Form Input Lengkap

#### Data Pelapor
- **Nama Lengkap** (Required)
- **NIK** (Required, 16 digit)
  - Validasi: Harus 16 digit angka
- **Email** (Required)
  - Validasi: Format email yang valid
- **Nomor Telepon** (Required)
  - Validasi: 10-13 digit
- **Alamat Lengkap** (Required)
  - Textarea untuk alamat detail

#### Data Pengaduan
- **Kategori Pengaduan** (Required, Dropdown)
  - Upah/Gaji Tidak Dibayar
  - PHK Sepihak
  - Tidak Ada Kontrak Kerja
  - Jam Kerja Berlebihan
  - Tidak Ada BPJS Ketenagakerjaan
  - Keselamatan Kerja
  - Diskriminasi di Tempat Kerja
  - Pelecehan di Tempat Kerja
  - Lainnya

- **Judul Pengaduan** (Required)
  - Input singkat untuk ringkasan

- **Deskripsi Lengkap** (Required)
  - Textarea dengan minimal 20 karakter
  - Character counter real-time

- **Lokasi Kejadian** (Required)
  - Nama perusahaan/tempat kejadian

- **Tanggal Kejadian** (Required)
  - Date picker
  - Maksimal tanggal hari ini

#### Bukti Pendukung (Opsional)
- Upload multiple files (maksimal 5 file)
- Format yang diterima: JPG, PNG, PDF, DOC, DOCX
- Ukuran maksimal per file: 5MB
- Preview file yang dipilih dengan ukuran

### 2. Validasi Form Komprehensif

#### Client-Side Validation
- **Real-time validation**: Error hilang saat user mulai mengetik
- **Scroll to error**: Auto scroll ke field pertama yang error
- **Visual feedback**: Border merah untuk field yang error
- **Error messages**: Pesan error yang jelas dan spesifik

#### Validasi Spesifik
```typescript
- NIK: /^\d{16}$/ (16 digit angka)
- Email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
- Telepon: /^[0-9]{10,13}$/ (10-13 digit)
- Deskripsi: Minimal 20 karakter
- File: Maksimal 5MB per file
```

### 3. User Experience Features

#### Loading States
- Button disabled saat submit
- Loading spinner dengan teks "Mengirim Pengaduan..."
- Prevent multiple submissions

#### Success Page
Setelah submit berhasil, user melihat:
- ✅ Alert sukses dengan ikon
- **Nomor Tiket** dalam box yang menonjol (format: ADU-YYYYMM-XXXX)
- Informasi penting:
  - SLA 3x24 jam kerja
  - Email notifikasi
  - Cara tracking
- Tombol aksi:
  - "Lacak Pengaduan" (redirect ke tracking page dengan ticket number)
  - "Kembali ke Beranda"

#### Responsive Design
- Mobile-first approach
- Grid layout untuk desktop
- Stack layout untuk mobile
- Touch-friendly buttons

### 4. Komponen UI yang Digunakan

```typescript
// New Components Created:
- Input (src/components/ui/input.tsx)
- Textarea (src/components/ui/textarea.tsx)
- Label (src/components/ui/label.tsx)
- Alert (src/components/ui/alert.tsx)

// Existing Components:
- Button
- Card
- Header
- Footer
```

### 5. Ticket Number Generation

Format: `ADU-YYYYMM-XXXX`
- ADU: Prefix untuk Aduan
- YYYY: Tahun (2024)
- MM: Bulan (01-12)
- XXXX: Random 4 digit (0000-9999)

Contoh: `ADU-202410-3847`

## 🔄 Integrasi Backend (To-Do)

Saat ini form menggunakan **mock submission** (delay 2 detik). Untuk production:

### API Endpoint yang Dibutuhkan

```typescript
POST /api/pengaduan
Content-Type: multipart/form-data

Body:
{
  // Data Pelapor
  nama: string
  nik: string
  email: string
  telepon: string
  alamat: string
  
  // Data Pengaduan
  kategori: string
  judul: string
  deskripsi: string
  lokasi: string
  tanggalKejadian: string (YYYY-MM-DD)
  
  // Files (optional)
  files: File[]
}

Response:
{
  success: boolean
  ticketNumber: string
  message: string
}
```

### Implementasi Backend

```typescript
// Di src/app/buat-aduan/page.tsx, ganti baris 150-162:

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) {
    const firstError = Object.keys(errors)[0];
    const element = document.getElementById(firstError);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  setIsSubmitting(true);

  try {
    // Create FormData for file upload
    const formDataToSend = new FormData();
    
    // Append text fields
    Object.keys(formData).forEach(key => {
      if (key !== 'files') {
        formDataToSend.append(key, formData[key]);
      }
    });
    
    // Append files
    formData.files.forEach((file, index) => {
      formDataToSend.append(`file${index}`, file);
    });
    
    // Send to API
    const response = await fetch('/api/pengaduan', {
      method: 'POST',
      body: formDataToSend,
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit');
    }
    
    const data = await response.json();
    setTicketNumber(data.ticketNumber);
    setSubmitSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    
  } catch (error) {
    setErrors({ submit: "Terjadi kesalahan. Silakan coba lagi." });
  } finally {
    setIsSubmitting(false);
  }
};
```

## 📧 Email Notification (Recommended)

Setelah pengaduan dikirim, kirim email ke pelapor:

```
Subject: Pengaduan Anda Telah Diterima - [TICKET_NUMBER]

Kepada Yth. [NAMA],

Terima kasih telah menggunakan layanan pengaduan Disnaker Kabupaten Pati.

Pengaduan Anda telah kami terima dengan detail:
- Nomor Tiket: [TICKET_NUMBER]
- Kategori: [KATEGORI]
- Tanggal Pengaduan: [TANGGAL]

Pengaduan Anda akan ditindaklanjuti maksimal 3x24 jam kerja.
Anda dapat melacak status pengaduan melalui:
https://[DOMAIN]/lacak-aduan?ticket=[TICKET_NUMBER]

Hormat kami,
Dinas Tenaga Kerja Kabupaten Pati
```

## 🗄️ Database Schema (Recommended)

```sql
CREATE TABLE pengaduan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ticket_number VARCHAR(20) UNIQUE NOT NULL,
  
  -- Data Pelapor
  nama VARCHAR(255) NOT NULL,
  nik VARCHAR(16) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telepon VARCHAR(20) NOT NULL,
  alamat TEXT NOT NULL,
  
  -- Data Pengaduan
  kategori VARCHAR(100) NOT NULL,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT NOT NULL,
  lokasi VARCHAR(255) NOT NULL,
  tanggal_kejadian DATE NOT NULL,
  
  -- Status
  status ENUM('pending', 'diproses', 'selesai', 'ditolak') DEFAULT 'pending',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_ticket (ticket_number),
  INDEX idx_email (email),
  INDEX idx_status (status)
);

CREATE TABLE pengaduan_files (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pengaduan_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (pengaduan_id) REFERENCES pengaduan(id) ON DELETE CASCADE
);

CREATE TABLE pengaduan_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pengaduan_id INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  keterangan TEXT,
  created_by INT, -- user_id petugas
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (pengaduan_id) REFERENCES pengaduan(id) ON DELETE CASCADE
);
```

## 🧪 Testing Checklist

### Functional Testing
- [ ] Form validation bekerja untuk semua field
- [ ] File upload menerima format yang benar
- [ ] File upload menolak file > 5MB
- [ ] Ticket number ter-generate dengan benar
- [ ] Success page menampilkan informasi yang benar
- [ ] Redirect ke tracking page dengan ticket number
- [ ] Cancel button kembali ke homepage

### UI/UX Testing
- [ ] Responsive di mobile (320px - 480px)
- [ ] Responsive di tablet (768px - 1024px)
- [ ] Responsive di desktop (1280px+)
- [ ] Error messages jelas dan helpful
- [ ] Loading states terlihat jelas
- [ ] Scroll to error bekerja dengan baik
- [ ] Character counter update real-time

### Accessibility Testing
- [ ] Keyboard navigation bekerja
- [ ] Screen reader friendly (aria-labels)
- [ ] Focus states terlihat jelas
- [ ] Color contrast memenuhi WCAG AA

## 🔒 Security Considerations

### Input Sanitization
```typescript
// Backend harus melakukan sanitization:
- Strip HTML tags dari input text
- Validate file types (tidak hanya dari extension)
- Scan uploaded files untuk malware
- Rate limiting untuk prevent spam
```

### Data Privacy
- NIK dan data pribadi harus di-encrypt di database
- Implement HTTPS untuk production
- Jangan expose sensitive data di error messages
- Implement CAPTCHA untuk prevent bot submissions

## 📊 Analytics & Monitoring

### Metrics to Track
- Form submission rate
- Form abandonment rate (per field)
- Average time to complete form
- File upload success rate
- Error frequency per field
- Ticket generation success rate

### Error Logging
```typescript
// Log errors untuk monitoring:
- Validation errors (aggregate)
- API submission errors
- File upload errors
- Network errors
```

## 🎨 Customization Options

### Menambah Kategori Baru
Edit `src/app/buat-aduan/page.tsx` baris 59-69:

```typescript
const kategoriOptions = [
  "Upah/Gaji Tidak Dibayar",
  "PHK Sepihak",
  // ... existing options
  "Kategori Baru Anda", // Tambahkan di sini
];
```

### Mengubah Validasi
Edit fungsi `validateForm()` di baris 92-127

### Mengubah Format Ticket Number
Edit fungsi `generateTicketNumber()` di baris 129-135

---

**Status**: ✅ Fully Implemented & Ready for Backend Integration  
**Last Updated**: 27 Oktober 2024
