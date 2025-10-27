"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, Upload, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  // Data Pelapor
  nama: string;
  nik: string;
  email: string;
  telepon: string;
  alamat: string;
  
  // Data Pengaduan
  kategori: string;
  judul: string;
  deskripsi: string;
  lokasi: string;
  tanggalKejadian: string;
  
  // Bukti
  files: File[];
}

interface FormErrors {
  [key: string]: string;
}

export default function BuatAduanPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    nik: "",
    email: "",
    telepon: "",
    alamat: "",
    kategori: "",
    judul: "",
    deskripsi: "",
    lokasi: "",
    tanggalKejadian: "",
    files: [],
  });

  const kategoriOptions = [
    "Upah/Gaji Tidak Dibayar",
    "PHK Sepihak",
    "Tidak Ada Kontrak Kerja",
    "Jam Kerja Berlebihan",
    "Tidak Ada BPJS Ketenagakerjaan",
    "Keselamatan Kerja",
    "Diskriminasi di Tempat Kerja",
    "Pelecehan di Tempat Kerja",
    "Lainnya",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // Limit to 5 files, max 5MB each
      const validFiles = filesArray.filter(file => file.size <= 5 * 1024 * 1024);
      if (validFiles.length !== filesArray.length) {
        setErrors(prev => ({ ...prev, files: "Beberapa file melebihi ukuran maksimal 5MB" }));
      }
      setFormData(prev => ({ ...prev, files: validFiles.slice(0, 5) }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validasi Data Pelapor
    if (!formData.nama.trim()) newErrors.nama = "Nama wajib diisi";
    if (!formData.nik.trim()) {
      newErrors.nik = "NIK wajib diisi";
    } else if (!/^\d{16}$/.test(formData.nik)) {
      newErrors.nik = "NIK harus 16 digit angka";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.telepon.trim()) {
      newErrors.telepon = "Nomor telepon wajib diisi";
    } else if (!/^[0-9]{10,13}$/.test(formData.telepon.replace(/[^0-9]/g, ""))) {
      newErrors.telepon = "Nomor telepon tidak valid (10-13 digit)";
    }
    if (!formData.alamat.trim()) newErrors.alamat = "Alamat wajib diisi";

    // Validasi Data Pengaduan
    if (!formData.kategori) newErrors.kategori = "Kategori wajib dipilih";
    if (!formData.judul.trim()) newErrors.judul = "Judul pengaduan wajib diisi";
    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = "Deskripsi pengaduan wajib diisi";
    } else if (formData.deskripsi.trim().length < 20) {
      newErrors.deskripsi = "Deskripsi minimal 20 karakter";
    }
    if (!formData.lokasi.trim()) newErrors.lokasi = "Lokasi kejadian wajib diisi";
    if (!formData.tanggalKejadian) newErrors.tanggalKejadian = "Tanggal kejadian wajib diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateTicketNumber = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    return `ADU-${year}${month}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const element = document.getElementById(firstError);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate ticket number
      const ticket = generateTicketNumber();
      setTicketNumber(ticket);
      
      // In production, send data to API:
      // const response = await fetch('/api/pengaduan', {
      //   method: 'POST',
      //   body: JSON.stringify(formData),
      // });
      
      setSubmitSuccess(true);
      
      // Scroll to success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setErrors({ submit: "Terjadi kesalahan. Silakan coba lagi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Alert variant="success" className="mb-6">
              <CheckCircle2 className="h-5 w-5" />
              <AlertTitle>Pengaduan Berhasil Dikirim!</AlertTitle>
              <AlertDescription>
                Pengaduan Anda telah kami terima dan akan segera ditindaklanjuti.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Nomor Tiket Pengaduan Anda</CardTitle>
                <CardDescription>
                  Simpan nomor tiket ini untuk melacak status pengaduan Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">Nomor Tiket</p>
                  <p className="text-3xl font-bold text-blue-600">{ticketNumber}</p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Informasi Penting:</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Pengaduan akan ditindaklanjuti maksimal 3x24 jam kerja</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Anda akan menerima notifikasi melalui email: {formData.email}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Gunakan nomor tiket untuk melacak status pengaduan</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => router.push(`/lacak-aduan?ticket=${ticketNumber}`)}
                    className="flex-1"
                  >
                    Lacak Pengaduan
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push("/")}
                    className="flex-1"
                  >
                    Kembali ke Beranda
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Buat Pengaduan Baru
              </h1>
              <p className="text-gray-600">
                Sampaikan keluhan atau masalah ketenagakerjaan Anda dengan lengkap dan jelas
              </p>
            </div>

            {/* Info Alert */}
            <Alert className="mb-6">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Informasi Penting</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Pastikan data yang Anda masukkan benar dan lengkap</li>
                  <li>• Identitas pelapor akan dijaga kerahasiaannya</li>
                  <li>• Pengaduan akan ditindaklanjuti maksimal 3x24 jam kerja</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Data Pelapor */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Data Pelapor
                  </CardTitle>
                  <CardDescription>
                    Informasi identitas Anda sebagai pelapor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="nama">Nama Lengkap <span className="text-red-500">*</span></Label>
                    <Input
                      id="nama"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama lengkap Anda"
                      className={errors.nama ? "border-red-500" : ""}
                    />
                    {errors.nama && <p className="text-sm text-red-500 mt-1">{errors.nama}</p>}
                  </div>

                  <div>
                    <Label htmlFor="nik">NIK (Nomor Induk Kependudukan) <span className="text-red-500">*</span></Label>
                    <Input
                      id="nik"
                      name="nik"
                      value={formData.nik}
                      onChange={handleInputChange}
                      placeholder="16 digit NIK"
                      maxLength={16}
                      className={errors.nik ? "border-red-500" : ""}
                    />
                    {errors.nik && <p className="text-sm text-red-500 mt-1">{errors.nik}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="email@example.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="telepon">Nomor Telepon <span className="text-red-500">*</span></Label>
                      <Input
                        id="telepon"
                        name="telepon"
                        value={formData.telepon}
                        onChange={handleInputChange}
                        placeholder="08xxxxxxxxxx"
                        className={errors.telepon ? "border-red-500" : ""}
                      />
                      {errors.telepon && <p className="text-sm text-red-500 mt-1">{errors.telepon}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="alamat">Alamat Lengkap <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="alamat"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      placeholder="Masukkan alamat lengkap Anda"
                      rows={3}
                      className={errors.alamat ? "border-red-500" : ""}
                    />
                    {errors.alamat && <p className="text-sm text-red-500 mt-1">{errors.alamat}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Data Pengaduan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    Detail Pengaduan
                  </CardTitle>
                  <CardDescription>
                    Informasi lengkap mengenai pengaduan Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="kategori">Kategori Pengaduan <span className="text-red-500">*</span></Label>
                    <select
                      id="kategori"
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleInputChange}
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.kategori ? "border-red-500" : ""}`}
                    >
                      <option value="">Pilih kategori</option>
                      {kategoriOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.kategori && <p className="text-sm text-red-500 mt-1">{errors.kategori}</p>}
                  </div>

                  <div>
                    <Label htmlFor="judul">Judul Pengaduan <span className="text-red-500">*</span></Label>
                    <Input
                      id="judul"
                      name="judul"
                      value={formData.judul}
                      onChange={handleInputChange}
                      placeholder="Ringkasan singkat pengaduan Anda"
                      className={errors.judul ? "border-red-500" : ""}
                    />
                    {errors.judul && <p className="text-sm text-red-500 mt-1">{errors.judul}</p>}
                  </div>

                  <div>
                    <Label htmlFor="deskripsi">Deskripsi Lengkap <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="deskripsi"
                      name="deskripsi"
                      value={formData.deskripsi}
                      onChange={handleInputChange}
                      placeholder="Jelaskan kronologi dan detail pengaduan Anda secara lengkap (minimal 20 karakter)"
                      rows={6}
                      className={errors.deskripsi ? "border-red-500" : ""}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.deskripsi.length} karakter
                    </p>
                    {errors.deskripsi && <p className="text-sm text-red-500 mt-1">{errors.deskripsi}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lokasi">Lokasi Kejadian <span className="text-red-500">*</span></Label>
                      <Input
                        id="lokasi"
                        name="lokasi"
                        value={formData.lokasi}
                        onChange={handleInputChange}
                        placeholder="Nama perusahaan/tempat kejadian"
                        className={errors.lokasi ? "border-red-500" : ""}
                      />
                      {errors.lokasi && <p className="text-sm text-red-500 mt-1">{errors.lokasi}</p>}
                    </div>

                    <div>
                      <Label htmlFor="tanggalKejadian">Tanggal Kejadian <span className="text-red-500">*</span></Label>
                      <Input
                        id="tanggalKejadian"
                        name="tanggalKejadian"
                        type="date"
                        value={formData.tanggalKejadian}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split('T')[0]}
                        className={errors.tanggalKejadian ? "border-red-500" : ""}
                      />
                      {errors.tanggalKejadian && <p className="text-sm text-red-500 mt-1">{errors.tanggalKejadian}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Bukti */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="mr-2 h-5 w-5" />
                    Bukti Pendukung (Opsional)
                  </CardTitle>
                  <CardDescription>
                    Upload foto, dokumen, atau bukti lain yang mendukung pengaduan Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Input
                      id="files"
                      name="files"
                      type="file"
                      onChange={handleFileChange}
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Maksimal 5 file, masing-masing maksimal 5MB. Format: JPG, PNG, PDF, DOC, DOCX
                    </p>
                    {errors.files && <p className="text-sm text-red-500 mt-1">{errors.files}</p>}
                  </div>

                  {formData.files.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">File yang dipilih:</p>
                      <ul className="space-y-1">
                        {formData.files.map((file, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            {file.name} ({(file.size / 1024).toFixed(2)} KB)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit Error */}
              {errors.submit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-5 w-5" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Mengirim Pengaduan...
                    </>
                  ) : (
                    "Kirim Pengaduan"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                  disabled={isSubmitting}
                  className="flex-1"
                  size="lg"
                >
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
