"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle,
  FileText,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  Loader2,
  Download,
  MessageSquare
} from "lucide-react";

interface PengaduanData {
  ticketNumber: string;
  status: "pending" | "diproses" | "selesai" | "ditolak";
  
  // Data Pelapor
  nama: string;
  email: string;
  telepon: string;
  
  // Data Pengaduan
  kategori: string;
  judul: string;
  deskripsi: string;
  lokasi: string;
  tanggalKejadian: string;
  tanggalPengaduan: string;
  
  // Timeline
  timeline: {
    status: string;
    keterangan: string;
    tanggal: string;
    petugas?: string;
  }[];
  
  // Files
  files?: {
    name: string;
    size: number;
    url: string;
  }[];
}

// Mock data untuk testing
const mockData: { [key: string]: PengaduanData } = {
  "ADU-202410-3847": {
    ticketNumber: "ADU-202410-3847",
    status: "diproses",
    nama: "Budi Santoso",
    email: "budi.santoso@example.com",
    telepon: "081234567890",
    kategori: "Upah/Gaji Tidak Dibayar",
    judul: "Gaji Bulan September Belum Dibayar",
    deskripsi: "Saya bekerja di PT XYZ sejak Januari 2024. Gaji bulan September 2024 belum dibayarkan hingga akhir Oktober. Sudah menghubungi HRD namun tidak ada tanggapan.",
    lokasi: "PT XYZ, Pati",
    tanggalKejadian: "2024-09-30",
    tanggalPengaduan: "2024-10-15",
    timeline: [
      {
        status: "Pengaduan Diterima",
        keterangan: "Pengaduan Anda telah diterima dan terdaftar dalam sistem kami.",
        tanggal: "2024-10-15 10:30",
      },
      {
        status: "Verifikasi Data",
        keterangan: "Tim kami sedang memverifikasi kelengkapan data dan dokumen pengaduan.",
        tanggal: "2024-10-16 09:15",
        petugas: "Ahmad Fauzi",
      },
      {
        status: "Dalam Proses Investigasi",
        keterangan: "Pengaduan sedang dalam tahap investigasi. Tim akan menghubungi pihak terkait.",
        tanggal: "2024-10-18 14:20",
        petugas: "Siti Nurhaliza",
      },
    ],
    files: [
      { name: "slip_gaji_agustus.pdf", size: 245000, url: "#" },
      { name: "bukti_chat_hrd.jpg", size: 1200000, url: "#" },
    ],
  },
  "ADU-202410-1234": {
    ticketNumber: "ADU-202410-1234",
    status: "selesai",
    nama: "Dewi Lestari",
    email: "dewi.lestari@example.com",
    telepon: "082345678901",
    kategori: "Tidak Ada BPJS Ketenagakerjaan",
    judul: "Perusahaan Tidak Mendaftarkan BPJS",
    deskripsi: "Sudah bekerja 6 bulan namun belum didaftarkan BPJS Ketenagakerjaan oleh perusahaan.",
    lokasi: "CV ABC, Pati",
    tanggalKejadian: "2024-10-01",
    tanggalPengaduan: "2024-10-10",
    timeline: [
      {
        status: "Pengaduan Diterima",
        keterangan: "Pengaduan Anda telah diterima dan terdaftar dalam sistem kami.",
        tanggal: "2024-10-10 11:00",
      },
      {
        status: "Verifikasi Data",
        keterangan: "Data telah diverifikasi dan lengkap.",
        tanggal: "2024-10-11 10:00",
        petugas: "Ahmad Fauzi",
      },
      {
        status: "Mediasi dengan Perusahaan",
        keterangan: "Telah dilakukan mediasi dengan pihak perusahaan.",
        tanggal: "2024-10-15 13:30",
        petugas: "Budi Hartono",
      },
      {
        status: "Selesai",
        keterangan: "Perusahaan telah mendaftarkan pekerja ke BPJS Ketenagakerjaan. Pengaduan diselesaikan.",
        tanggal: "2024-10-20 16:00",
        petugas: "Budi Hartono",
      },
    ],
  },
};

export default function LacakAduanPage() {
  const searchParams = useSearchParams();
  const ticketFromUrl = searchParams.get("ticket");
  
  const [ticketNumber, setTicketNumber] = useState(ticketFromUrl || "");
  const [searchedTicket, setSearchedTicket] = useState("");
  const [pengaduanData, setPengaduanData] = useState<PengaduanData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-search if ticket in URL
  useEffect(() => {
    if (ticketFromUrl) {
      handleSearch(ticketFromUrl);
    }
  }, [ticketFromUrl]);

  const handleSearch = async (ticket?: string) => {
    const searchTicket = ticket || ticketNumber;
    
    if (!searchTicket.trim()) {
      setError("Masukkan nomor tiket pengaduan");
      return;
    }

    setIsLoading(true);
    setError("");
    setPengaduanData(null);
    setSearchedTicket(searchTicket);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, fetch from API:
      // const response = await fetch(`/api/pengaduan/${searchTicket}`);
      // const data = await response.json();
      
      const data = mockData[searchTicket];
      
      if (data) {
        setPengaduanData(data);
      } else {
        setError("Nomor tiket tidak ditemukan. Periksa kembali nomor tiket Anda.");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning" className="text-xs"><Clock className="h-3 w-3 mr-1" />Menunggu</Badge>;
      case "diproses":
        return <Badge variant="info" className="text-xs"><AlertCircle className="h-3 w-3 mr-1" />Diproses</Badge>;
      case "selesai":
        return <Badge variant="success" className="text-xs"><CheckCircle2 className="h-3 w-3 mr-1" />Selesai</Badge>;
      case "ditolak":
        return <Badge variant="destructive" className="text-xs"><XCircle className="h-3 w-3 mr-1" />Ditolak</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-600";
      case "diproses": return "text-blue-600";
      case "selesai": return "text-green-600";
      case "ditolak": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Lacak Pengaduan Anda
              </h1>
              <p className="text-gray-600">
                Masukkan nomor tiket untuk melihat status pengaduan
              </p>
            </div>

            {/* Search Box */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-5 w-5" />
                  Cari Pengaduan
                </CardTitle>
                <CardDescription>
                  Masukkan nomor tiket yang Anda terima saat membuat pengaduan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Label htmlFor="ticket" className="sr-only">Nomor Tiket</Label>
                    <Input
                      id="ticket"
                      placeholder="Contoh: ADU-202410-3847"
                      value={ticketNumber}
                      onChange={(e) => {
                        setTicketNumber(e.target.value.toUpperCase());
                        setError("");
                      }}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="text-lg"
                    />
                  </div>
                  <Button 
                    onClick={() => handleSearch()}
                    disabled={isLoading}
                    size="lg"
                    className="sm:w-auto w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Mencari...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5" />
                        Lacak
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Quick Test Links */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-2">Coba nomor tiket demo:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTicketNumber("ADU-202410-3847");
                        handleSearch("ADU-202410-3847");
                      }}
                      className="text-xs"
                    >
                      ADU-202410-3847 (Diproses)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTicketNumber("ADU-202410-1234");
                        handleSearch("ADU-202410-1234");
                      }}
                      className="text-xs"
                    >
                      ADU-202410-1234 (Selesai)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="mb-8">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Tidak Ditemukan</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Results */}
            {pengaduanData && (
              <div className="space-y-6">
                {/* Status Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2">
                          {pengaduanData.judul}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Tiket: <span className="font-mono font-semibold">{pengaduanData.ticketNumber}</span>
                        </CardDescription>
                      </div>
                      <div>
                        {getStatusBadge(pengaduanData.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <p className="text-gray-500">Tanggal Pengaduan</p>
                          <p className="font-medium">{new Date(pengaduanData.tanggalPengaduan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <p className="text-gray-500">Lokasi</p>
                          <p className="font-medium">{pengaduanData.lokasi}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <p className="text-gray-500">Kategori</p>
                          <p className="font-medium">{pengaduanData.kategori}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Timeline Pengaduan
                    </CardTitle>
                    <CardDescription>
                      Riwayat proses pengaduan Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pengaduanData.timeline.map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              index === pengaduanData.timeline.length - 1
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-green-100 text-green-600'
                            }`}>
                              {index === pengaduanData.timeline.length - 1 ? (
                                <Clock className="h-5 w-5" />
                              ) : (
                                <CheckCircle2 className="h-5 w-5" />
                              )}
                            </div>
                            {index < pengaduanData.timeline.length - 1 && (
                              <div className="w-0.5 h-full bg-gray-300 my-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-semibold text-gray-900">{item.status}</h4>
                              <span className="text-xs text-gray-500">
                                {new Date(item.tanggal).toLocaleDateString('id-ID', { 
                                  day: 'numeric', 
                                  month: 'short', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{item.keterangan}</p>
                            {item.petugas && (
                              <p className="text-xs text-gray-500">
                                Petugas: {item.petugas}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Detail Pengaduan */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Detail Pengaduan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Deskripsi</h4>
                      <p className="text-gray-700 leading-relaxed">{pengaduanData.deskripsi}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Tanggal Kejadian</h4>
                      <p className="text-gray-700">
                        {new Date(pengaduanData.tanggalKejadian).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>

                    {pengaduanData.files && pengaduanData.files.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Bukti Pendukung</h4>
                          <div className="space-y-2">
                            {pengaduanData.files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                  <FileText className="h-5 w-5 text-gray-500 mr-3" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Unduh
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Informasi Pelapor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <p className="text-gray-500">Nama</p>
                          <p className="font-medium">{pengaduanData.nama}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <p className="text-gray-500">Email</p>
                          <p className="font-medium">{pengaduanData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <p className="text-gray-500">Telepon</p>
                          <p className="font-medium">{pengaduanData.telepon}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Help Section */}
                <Alert>
                  <AlertCircle className="h-5 w-5" />
                  <AlertTitle>Butuh Bantuan?</AlertTitle>
                  <AlertDescription>
                    Jika Anda memiliki pertanyaan atau memerlukan informasi lebih lanjut, 
                    silakan hubungi kami melalui halaman kontak atau telepon (0295) 123456.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
