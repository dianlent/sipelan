-- ============================================
-- UPDATE: Timeline Status Flow
-- ============================================
-- Flow: masuk → terverifikasi → terdisposisi → tindak_lanjut → selesai

-- Tidak perlu create table baru, hanya update constraint jika ada

-- Check existing status values
SELECT DISTINCT status FROM pengaduan ORDER BY status;

-- Check existing status in pengaduan_status
SELECT DISTINCT status FROM pengaduan_status ORDER BY status;

-- Jika ada constraint pada status, drop dan buat ulang
-- (Biasanya tidak ada constraint, tapi untuk jaga-jaga)

-- ALTER TABLE pengaduan DROP CONSTRAINT IF EXISTS pengaduan_status_check;
-- ALTER TABLE pengaduan_status DROP CONSTRAINT IF EXISTS pengaduan_status_status_check;

-- Tidak perlu constraint, karena aplikasi sudah handle flow-nya
-- Status yang valid: masuk, terverifikasi, terdisposisi, tindak_lanjut, selesai

-- ============================================
-- Test Flow dengan Sample Data
-- ============================================

-- Contoh: Update pengaduan dari masuk ke terverifikasi
-- UPDATE pengaduan 
-- SET status = 'terverifikasi', updated_at = NOW()
-- WHERE kode_pengaduan = 'ADU-2025-0001' AND status = 'masuk';

-- Insert timeline terverifikasi
-- INSERT INTO pengaduan_status (pengaduan_id, status, keterangan)
-- SELECT 
--     id,
--     'terverifikasi',
--     'Pengaduan telah diverifikasi oleh admin dan siap didisposisi'
-- FROM pengaduan
-- WHERE kode_pengaduan = 'ADU-2025-0001';

-- Verify timeline
-- SELECT ps.status, ps.keterangan, ps.created_at
-- FROM pengaduan_status ps
-- JOIN pengaduan p ON ps.pengaduan_id = p.id
-- WHERE p.kode_pengaduan = 'ADU-2025-0001'
-- ORDER BY ps.created_at ASC;

-- Expected Timeline:
-- 1. masuk - Pengaduan telah diterima sistem dan menunggu verifikasi
-- 2. terverifikasi - Pengaduan telah diverifikasi oleh admin dan siap didisposisi
-- 3. terdisposisi - Pengaduan telah didisposisikan ke bidang terkait
-- 4. tindak_lanjut - Pengaduan sedang dalam proses penanganan
-- 5. selesai - Pengaduan telah diselesaikan

-- ============================================
-- DONE! No migration needed
-- Status flow already supported by application
-- ============================================
