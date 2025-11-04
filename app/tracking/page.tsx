'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  MapPin,
  Calendar,
  User,
  Building,
  Send,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import PengaduanTimeline from '@/components/PengaduanTimeline'

interface PengaduanDetail {
  id: string
  kode_pengaduan: string
  judul_pengaduan: string
  isi_pengaduan: string
  kategori: string
  status: 'masuk' | 'terverifikasi' | 'terdisposisi' | 'tindak_lanjut' | 'selesai' | 'diterima' | 'di proses'
  lokasi_kejadian?: string
  tanggal_kejadian?: string
  file_bukti?: string
  created_at: string
  user: {
    nama_lengkap: string
    email: string
  }
  bidang?: {
    nama_bidang: string
  }
  timeline: Array<{
    status: string
    keterangan: string
    created_at: string
  }>
}

export default function TrackingPage() {
  const searchParams = useSearchParams()
  const [kodeTracking, setKodeTracking] = useState(searchParams.get('kode') || '')
  const [pengaduan, setPengaduan] = useState<PengaduanDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (searchParams.get('kode')) {
      handleSearch()
    }
  }, [])

  const handleSearch = async () => {
    if (!kodeTracking.trim()) {
      toast.error('Masukkan kode tracking')
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      // TODO: Fetch from API
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock data dengan status timeline
      const mockData: PengaduanDetail = {
        id: '1',
        kode_pengaduan: kodeTracking.toUpperCase(),
        judul_pengaduan: 'Upah tidak dibayar sesuai UMR',
        isi_pengaduan: 'Perusahaan tempat saya bekerja membayar upah di bawah UMR yang ditetapkan pemerintah. Sudah beberapa kali saya komplain namun tidak ada tanggapan dari manajemen.',
        kategori: 'Pengupahan',
        status: 'tindak_lanjut',
        lokasi_kejadian: 'PT ABC Indonesia, Jakarta Selatan',
        tanggal_kejadian: '2024-01-15',
        file_bukti: 'bukti_slip_gaji.pdf',
        created_at: '2024-01-16T10:00:00Z',
        user: {
          nama_lengkap: 'John Doe',
          email: 'john@example.com'
        },
        bidang: {
          nama_bidang: 'Bidang Hubungan Industrial'
        },
        timeline: [
          {
            status: 'masuk',
            keterangan: 'Pengaduan telah diterima sistem',
            created_at: '2024-01-16T10:00:00Z'
          },
          {
            status: 'terverifikasi',
            keterangan: 'Pengaduan telah diverifikasi oleh admin',
            created_at: '2024-01-16T14:30:00Z'
          },
          {
            status: 'terdisposisi',
            keterangan: 'Pengaduan telah didisposisikan ke Bidang Hubungan Industrial',
            created_at: '2024-01-17T09:15:00Z'
          },
          {
            status: 'tindak_lanjut',
            keterangan: 'Pengaduan sedang ditindaklanjuti oleh Bidang Hubungan Industrial',
            created_at: '2024-01-17T14:30:00Z'
          }
        ]
      }

      setPengaduan(mockData)
      toast.success('Data pengaduan ditemukan')
    } catch (error) {
      toast.error('Pengaduan tidak ditemukan')
      setPengaduan(null)
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'masuk':
        return 'text-blue-600 bg-blue-100'
      case 'terverifikasi':
        return 'text-green-600 bg-green-100'
      case 'terdisposisi':
        return 'text-purple-600 bg-purple-100'
      case 'tindak_lanjut':
        return 'text-orange-600 bg-orange-100'
      case 'selesai':
        return 'text-emerald-600 bg-emerald-100'
      // Legacy support
      case 'diterima':
        return 'text-green-600 bg-green-100'
      case 'di proses':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'masuk':
        return <FileText className="w-6 h-6" />
      case 'terverifikasi':
        return <CheckCircle className="w-6 h-6" />
      case 'terdisposisi':
        return <Send className="w-6 h-6" />
      case 'tindak_lanjut':
        return <RefreshCw className="w-6 h-6" />
      case 'selesai':
        return <CheckCircle className="w-6 h-6" />
      // Legacy support
      case 'diterima':
        return <AlertCircle className="w-6 h-6" />
      case 'di proses':
        return <Clock className="w-6 h-6" />
      default:
        return <FileText className="w-6 h-6" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'masuk':
        return 'Pengaduan Masuk'
      case 'terverifikasi':
        return 'Terverifikasi'
      case 'terdisposisi':
        return 'Terdisposisi'
      case 'tindak_lanjut':
        return 'Tindak Lanjut'
      case 'selesai':
        return 'Selesai'
      // Legacy support
      case 'diterima':
        return 'Diterima'
      case 'di proses':
        return 'Di Proses'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tracking Pengaduan</h1>
          <p className="text-gray-600">Lacak status pengaduan Anda dengan kode tracking</p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={kodeTracking}
                onChange={(e) => setKodeTracking(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Masukkan kode tracking (contoh: ADU-2024-0001)"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-lg font-mono"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-primary text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Cari'
              )}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Kode tracking dikirimkan ke email Anda saat pengaduan dibuat
          </p>
        </motion.div>

        {/* Result */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : pengaduan ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Kode Tracking</p>
                  <p className="text-2xl font-bold font-mono text-primary-600">
                    {pengaduan.kode_pengaduan}
                  </p>
                </div>
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${getStatusColor(pengaduan.status)}`}>
                  {getStatusIcon(pengaduan.status)}
                  <span className="font-semibold">{getStatusLabel(pengaduan.status)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {pengaduan.judul_pengaduan}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {pengaduan.isi_pengaduan}
                </p>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Kategori</p>
                      <p className="font-semibold text-gray-900">{pengaduan.kategori}</p>
                    </div>
                  </div>
                  {pengaduan.lokasi_kejadian && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-500">Lokasi</p>
                        <p className="font-semibold text-gray-900">{pengaduan.lokasi_kejadian}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Tanggal Dibuat</p>
                      <p className="font-semibold text-gray-900">{formatDate(pengaduan.created_at)}</p>
                    </div>
                  </div>
                  {pengaduan.bidang && (
                    <div className="flex items-start space-x-3">
                      <Building className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-500">Ditangani Oleh</p>
                        <p className="font-semibold text-gray-900">{pengaduan.bidang.nama_bidang}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <PengaduanTimeline 
              currentStatus={pengaduan.status === 'diterima' ? 'terverifikasi' : pengaduan.status === 'di proses' ? 'tindak_lanjut' : 'selesai'}
              timeline={pengaduan.timeline}
            />
          </motion.div>
        ) : hasSearched ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Pengaduan Tidak Ditemukan
            </h3>
            <p className="text-gray-600 mb-6">
              Pastikan kode tracking yang Anda masukkan sudah benar
            </p>
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}
