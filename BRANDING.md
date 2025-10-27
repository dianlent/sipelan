# SIPELAN - Brand Guidelines

## Nama Aplikasi

**SIPELAN** adalah akronim dari **Sistem Pengaduan Layanan**

### Penulisan yang Benar
- ✅ **SIPELAN** (huruf kapital semua)
- ✅ **Sipelan** (huruf kapital di awal, untuk kalimat)
- ❌ SIPelan
- ❌ sipelan (kecuali dalam kode/URL)

### Nama Lengkap
**SIPELAN - Sistem Pengaduan Layanan Dinas Tenaga Kerja Kabupaten Pati**

## Tagline

**"Sampaikan Aspirasi, Wujudkan Solusi"**

Alternatif:
- "Platform Pengaduan Ketenagakerjaan Terpercaya"
- "Melayani dengan Transparan dan Profesional"

## Identitas Visual

### Logo Placeholder
Saat ini menggunakan placeholder:
- **PP** - Pemkab Pati (Biru: #2563EB)
- **DN** - Disnaker (Hijau: #16A34A)

### Warna Brand

#### Warna Utama
```css
Primary Blue: #2563EB (rgb(37, 99, 235))
- Digunakan untuk: Header, tombol utama, aksen
- Gradient: from-blue-600 via-blue-700 to-blue-800

Secondary Green: #16A34A (rgb(22, 163, 74))
- Digunakan untuk: Status selesai, success messages
```

#### Warna Status
```css
Pending/Warning: #EAB308 (Yellow)
In Progress/Info: #3B82F6 (Blue)
Success/Completed: #22C55E (Green)
Error/Rejected: #EF4444 (Red)
```

#### Warna Netral
```css
Background: #F9FAFB (Gray-50)
Text Primary: #111827 (Gray-900)
Text Secondary: #6B7280 (Gray-500)
Border: #E5E7EB (Gray-200)
```

## Tipografi

### Font Utama
**Inter** (Google Fonts)
- Weights: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
- Digunakan untuk semua teks

### Hierarki Teks
```css
H1 (Hero): 3xl-5xl, Bold
H2 (Section): 2xl-3xl, Bold
H3 (Card Title): xl-2xl, Semi-Bold
Body: sm-base, Regular
Caption: xs-sm, Regular
```

## Tone of Voice

### Karakteristik
- **Profesional**: Bahasa formal dan sopan
- **Ramah**: Mudah dipahami, tidak kaku
- **Transparan**: Jelas dan jujur
- **Responsif**: Cepat tanggap terhadap kebutuhan

### Contoh Penulisan

#### ✅ Baik
- "Pengaduan Anda telah kami terima dan akan segera ditindaklanjuti"
- "Terima kasih telah menggunakan layanan SIPELAN"
- "Kami siap membantu melindungi hak-hak pekerja"

#### ❌ Hindari
- "Laporan lu udah masuk bro"
- "Sabar ya, lagi diproses"
- "Komplain diterima"

## Pesan Standar

### Success Messages
```
✅ Pengaduan Berhasil Dikirim!
✅ Data Berhasil Disimpan
✅ Pengaduan Telah Diselesaikan
```

### Error Messages
```
❌ Nomor tiket tidak ditemukan
❌ Terjadi kesalahan. Silakan coba lagi
❌ Data tidak lengkap
```

### Info Messages
```
ℹ️ Pengaduan akan ditindaklanjuti maksimal 3x24 jam kerja
ℹ️ Identitas pelapor akan dijaga kerahasiaannya
ℹ️ Simpan nomor tiket untuk melacak status
```

## Komponen UI

### Button Styles
```css
Primary: bg-blue-600 hover:bg-blue-700 text-white
Secondary: bg-gray-200 hover:bg-gray-300 text-gray-900
Outline: border-2 border-blue-600 text-blue-600
Ghost: hover:bg-gray-100 text-gray-700
```

### Card Styles
```css
Default: bg-white border rounded-lg shadow-sm
Highlighted: border-t-4 border-t-blue-600
```

### Badge Styles
```css
Success: bg-green-100 text-green-800
Warning: bg-yellow-100 text-yellow-800
Info: bg-blue-100 text-blue-800
Error: bg-red-100 text-red-800
```

## Iconography

### Icon Library
**Lucide React** - Consistent, modern icons

### Ukuran Icon
- Small: h-4 w-4 (16px)
- Medium: h-5 w-5 (20px)
- Large: h-6 w-6 (24px)
- Extra Large: h-8 w-8 (32px)

### Icon Usage
```
Search: Pencarian
FileText: Dokumen/Pengaduan
Clock: Waktu/Pending
CheckCircle: Selesai/Success
XCircle: Ditolak/Error
AlertCircle: Info/Warning
User: Profil/Pelapor
Mail: Email
Phone: Telepon
MapPin: Lokasi
Calendar: Tanggal
```

## Responsive Breakpoints

```css
Mobile: < 768px
Tablet: 768px - 1023px
Desktop: ≥ 1024px
```

## Accessibility

### Kontras Warna
- Minimum WCAG AA: 4.5:1 untuk teks normal
- Minimum WCAG AA: 3:1 untuk teks besar

### Keyboard Navigation
- Semua fungsi dapat diakses via keyboard
- Focus states jelas dan terlihat
- Tab order logis

### Screen Reader
- Alt text untuk semua gambar
- ARIA labels untuk interactive elements
- Semantic HTML structure

## File Naming Convention

### Komponen
```
PascalCase: Header.tsx, Footer.tsx, Button.tsx
```

### Pages
```
kebab-case: buat-aduan, lacak-aduan
```

### Assets
```
lowercase-dash: logo-sipelan.png, icon-search.svg
```

## Metadata untuk SEO

### Title Format
```
[Page Name] - SIPELAN | Disnaker Kabupaten Pati

Contoh:
- Buat Pengaduan - SIPELAN | Disnaker Kabupaten Pati
- Lacak Pengaduan - SIPELAN | Disnaker Kabupaten Pati
```

### Description Template
```
SIPELAN (Sistem Pengaduan Layanan) - [Page specific description]. 
Platform pengaduan online Dinas Tenaga Kerja Kabupaten Pati.
```

### Keywords
```
sipelan, pengaduan, ketenagakerjaan, disnaker, pati, 
buruh, pekerja, upah, bpjs, phk, kontrak kerja
```

## Social Media

### Hashtags
```
#SIPELAN
#Disnaker Pati
#PengaduanKetenagakerjaan
#HakPekerja
#LayananPublik
```

### Share Text Template
```
Laporkan masalah ketenagakerjaan Anda melalui SIPELAN - 
Sistem Pengaduan Layanan Disnaker Kabupaten Pati. 
Mudah, cepat, dan terpercaya!
```

## Contact Information

### Official
```
Website: [URL akan ditentukan]
Email: disnaker@patikab.go.id
Telepon: (0295) 123456
Alamat: [Alamat lengkap Disnaker Pati]
```

### Support Hours
```
Senin - Jumat: 08:00 - 16:00 WIB
Sabtu - Minggu: Libur
```

---

**Version**: 1.0  
**Last Updated**: 27 Oktober 2024  
**Maintained by**: Tim IT Disnaker Kabupaten Pati
