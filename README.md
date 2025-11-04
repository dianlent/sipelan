# SIPelan - Sistem Pengaduan Layanan Online Naker

Sistem Pengaduan Layanan Online Dinas Ketenagakerjaan yang memungkinkan masyarakat untuk mengajukan pengaduan terkait layanan ketenagakerjaan secara online dengan sistem tracking dan disposisi yang terintegrasi.

## Fitur Utama

### 🎯 **Kategori Pengaduan**
- Pengupahan (gaji, upah minimum, tunjangan)
- Ketenagakerjaan (PHK, kontrak kerja, jam kerja)
- K3 (keselamatan dan kesehatan kerja)
- Pelatihan Kerja
- Lainnya

### 🔍 **Tracking Kode Pengaduan**
- Format: `ADU-YYYY-XXXX` (contoh: ADU-2024-0001)
- Auto-generate kode unik untuk setiap pengaduan
- Monitoring status real-time

### 📊 **Status Pengaduan**
- **Diterima** - Pengaduan masuk dan diverifikasi
- **Di Proses** - Sedang ditindaklanjuti bidang terkait
- **Selesai** - Pengaduan telah selesai ditangani

### 📎 **Upload Bukti Pengaduan**
- Support format: JPG, PNG, GIF, PDF, DOC, DOCX
- Maksimal ukuran file: 10MB
- Upload opsional untuk mendukung pengaduan

### 🔄 **Sistem Disposisi**
5 Bidang dengan akun masing-masing:
- **Bidang Hubungan Industrial (HI)**
- **Bidang Latihan Kerja dan Produktivitas (LATTAS)**
- **Bidang Penempatan Tenaga Kerja dan Perluasan Kesempatan Kerja (PTPK)**
- **UPTD BLK Pati**
- **Sekretariat**

### 📧 **Notifikasi Email SMTP**
- Email konfirmasi saat pengaduan diterima
- Email notifikasi perubahan status
- Email disposisi ke bidang terkait
- Template email profesional

## Teknologi

### Backend
- **Node.js** dengan Express.js
- **Supabase** sebagai database PostgreSQL
- **JWT** untuk autentikasi
- **Multer** untuk upload file
- **Nodemailer** untuk email SMTP
- **bcryptjs** untuk hashing password

### Frontend
- **Bootstrap 5** untuk UI framework
- **Vanilla JavaScript** (tanpa framework)
- **Font Awesome** untuk icons
- **Responsive Design**

### Keamanan
- Rate limiting
- CORS configuration
- Helmet.js untuk security headers
- Input validation
- File upload security

## Instalasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd sipelan
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy file `.env.example` ke `.env`:
```bash
cp .env.example .env
```

Edit file `.env` dengan konfigurasi Anda:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Email SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 4. Setup Database Supabase
1. Buat project baru di Supabase
2. Jalankan SQL dari file `database/schema.sql` di SQL Editor Supabase
3. Copy URL dan keys ke file `.env`
4. Schema sudah termasuk fix untuk panjang kolom yang optimal

### 5. Jalankan Aplikasi
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

## API Documentation

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Ubah password

### Pengaduan
- `POST /api/pengaduan` - Buat pengaduan baru
- `GET /api/pengaduan/my` - Get pengaduan user (masyarakat)
- `GET /api/pengaduan/bidang` - Get pengaduan bidang (bidang)
- `GET /api/pengaduan/all` - Get semua pengaduan (admin)
- `GET /api/pengaduan/:id` - Get detail pengaduan
- `GET /api/pengaduan/kode/:kode` - Get pengaduan by kode
- `PUT /api/pengaduan/:id/status` - Update status pengaduan
- `DELETE /api/pengaduan/:id` - Hapus pengaduan

### Disposisi
- `POST /api/disposisi` - Buat disposisi baru
- `GET /api/disposisi/pengaduan/:pengaduan_id` - Get disposisi pengaduan
- `GET /api/disposisi/bidang` - Get disposisi bidang
- `GET /api/disposisi/all` - Get semua disposisi (admin)
- `GET /api/disposisi/bidang-list` - Get list bidang
- `DELETE /api/disposisi/:id` - Hapus disposisi

### Master Data
- `GET /api/master/kategori` - Get semua kategori
- `POST /api/master/kategori` - Tambah kategori (admin)
- `PUT /api/master/kategori/:id` - Update kategori (admin)
- `DELETE /api/master/kategori/:id` - Hapus kategori (admin)
- `GET /api/master/bidang` - Get semua bidang
- `GET /api/master/users` - Get semua user (admin)

## Struktur Database

### Tabel Utama
- `users` - Data user dan autentikasi
- `pengaduan` - Data pengaduan
- `kategori_pengaduan` - Master kategori
- `bidang` - Master bidang/unit kerja
- `disposisi` - Data disposisi pengaduan
- `pengaduan_status` - Tracking status pengaduan
- `tanggapan` - Tanggapan pengaduan

## Role dan Permission

### Masyarakat
- Membuat pengaduan
- Melihat status pengaduan sendiri
- Upload bukti pengaduan

### Bidang
- Melihat pengaduan yang di disposisikan
- Update status pengaduan
- Membuat disposisi ke bidang lain
- Memberikan tanggapan

### Admin
- Mengelola semua data
- Master data (kategori, bidang, user)
- Monitoring semua pengaduan
- Laporan dan statistik

## Email Templates

Sistem menyediakan template email otomatis:
- **Konfirmasi Pengaduan** - Saat pengaduan diterima
- **Update Status** - Saat status berubah
- **Disposisi** - Saat pengaduan di disposisikan

## Deployment

### Production Build
```bash
npm run build
```

### Environment Variables untuk Production
- `NODE_ENV=production`
- Gunakan HTTPS
- Setup proper CORS origins
- Gunakan production database

## Kontribusi

1. Fork repository
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## License

MIT License - lihat file [LICENSE](LICENSE) untuk detail

## Support

Untuk bantuan dan pertanyaan:
- Email: support@disnaker.go.id
- Documentation: [Wiki](https://github.com/username/sipelan/wiki)
- Issues: [GitHub Issues](https://github.com/username/sipelan/issues)

---

**Dinas Ketenagakerjaan**  
*© 2024 - SIPelan - Sistem Pengaduan Layanan Online Naker*
