# Test Flow: Pengaduan System

## 1. Submit Pengaduan
- Buka: http://localhost:5001/pengaduan
- Isi form pengaduan
- Submit
- Catat **kode pengaduan** (ex: ADU-2025-0001)

**Expected:**
- Status: `masuk`
- Timeline: "Pengaduan telah diterima sistem"

---

## 2. Admin - Verifikasi
- Login: http://localhost:5001/login (admin)
- Buka: http://localhost:5001/admin
- Cari pengaduan dengan status `masuk`
- Klik **"Verifikasi"** (button hijau)

**Expected:**
- Status berubah: `masuk` → `terverifikasi`
- Timeline update: "Pengaduan telah diverifikasi"
- Button "Disposisi" muncul

---

## 3. Admin - Disposisi
- Di halaman admin yang sama
- Klik **"Disposisi"** (button ungu)
- Pilih bidang tujuan (ex: Bidang Hubungan Industrial)
- Isi keterangan
- Submit

**Expected:**
- Status berubah: `terverifikasi` → `terdisposisi`
- `bidang_id` terisi di database
- Timeline update: "Pengaduan didisposisikan ke [Nama Bidang]"
- Console log: "✅ Disposisi saved successfully"

---

## 4. Bidang - Lihat Pengaduan
- Login: http://localhost:5001/login (bidang user)
- Buka: http://localhost:5001/bidang
- **Pengaduan HARUS MUNCUL** di dashboard

**Expected:**
- Pengaduan muncul di list
- Status: `terdisposisi`
- 2-Sidebar layout tampil
- Stats update

**Debug Console:**
```
=== LOADING BIDANG PENGADUAN FROM DATABASE ===
Bidang ID: 1
Fetching: /api/pengaduan?bidang_id=1&limit=100
API Response: {success: true, data: [...]}
✅ Total pengaduan ditemukan: X
```

---

## 5. Bidang - Update Status
- Klik **"Proses"** pada pengaduan
- Update status ke `tindak_lanjut`
- Submit

**Expected:**
- Status berubah: `terdisposisi` → `tindak_lanjut`
- Timeline update

---

## 6. Bidang - Beri Tanggapan & Selesaikan
- Klik "Beri Tanggapan"
- Isi tanggapan
- Submit

**Expected:**
- Status berubah: `tindak_lanjut` → `selesai`
- Email terkirim ke pelapor (jika SMTP configured)
- Timeline update: "Pengaduan telah diselesaikan"

---

## 7. Tracking - Cek Timeline
- Buka: http://localhost:5001/tracking
- Masukkan kode pengaduan
- Lihat timeline lengkap

**Expected Timeline:**
1. ✅ Masuk - "Pengaduan telah diterima sistem"
2. ✅ Terverifikasi - "Pengaduan telah diverifikasi"
3. ✅ Terdisposisi - "Pengaduan didisposisikan ke [Bidang]"
4. ✅ Tindak Lanjut - "Pengaduan sedang dalam proses"
5. ✅ Selesai - "Pengaduan telah diselesaikan"

---

## Troubleshooting

### Pengaduan tidak muncul di bidang:
1. Check console browser (F12)
2. Lihat error message
3. Verify `bidang_id` di database:
   ```sql
   SELECT kode_pengaduan, status, bidang_id 
   FROM pengaduan 
   WHERE status IN ('terdisposisi', 'tindak_lanjut', 'selesai');
   ```

### API Error:
- Check terminal/console untuk error messages
- Verify database connection
- Check RLS policies di Supabase

### Empty data:
- Run `ALL_IN_ONE_FIX.sql` di Supabase
- Verify table `disposisi` exists
- Check user `bidang_id` matches bidang table
