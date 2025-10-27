import { z } from 'zod';

// Pengaduan Validation Schema
export const pengaduanSchema = z.object({
  // Data Pelapor
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  nik: z.string().regex(/^\d{16}$/, 'NIK harus 16 digit angka'),
  email: z.string().email('Format email tidak valid'),
  telepon: z.string().regex(/^[0-9]{10,13}$/, 'Nomor telepon tidak valid (10-13 digit)'),
  alamat: z.string().min(10, 'Alamat minimal 10 karakter'),
  
  // Data Pengaduan
  kategori: z.string().min(1, 'Kategori wajib dipilih'),
  judul: z.string().min(5, 'Judul minimal 5 karakter'),
  deskripsi: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  lokasi: z.string().min(3, 'Lokasi minimal 3 karakter'),
  tanggalKejadian: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Format tanggal tidak valid',
  }),
});

export type PengaduanInput = z.infer<typeof pengaduanSchema>;

// Login Validation Schema
export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Update Status Schema
export const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'DIPROSES', 'SELESAI', 'DITOLAK']),
  keterangan: z.string().min(10, 'Keterangan minimal 10 karakter'),
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
