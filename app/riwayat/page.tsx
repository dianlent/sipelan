'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
  MapPin,
  Filter,
  Search
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

interface Pengaduan {
  id: string
  kode_pengaduan: string
  judul_pengaduan: string
  isi_pengaduan: string
  kategori: string
  status: 'diterima' | 'di proses' | 'selesai'
  lokasi_kejadian?: string
  tanggal_kejadian?: string
  created_at: string
}

export default function RiwayatPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [pengaduanList, setPengaduanList] = useState<Pengaduan[]>([])
  const [filteredList, setFilteredList] = useState<Pengaduan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Check authentication using AuthContext
    if (!authLoading && !isAuthenticated) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
      return
    }

    if (user) {
      loadPengaduan()
    }
  }, [user, authLoading, isAuthenticated, router])

  useEffect(() => {
    // Filter pengaduan
    let filtered = pengaduanList

    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus)
    }

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.kode_pengaduan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.judul_pengaduan.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredList(filtered)
  }, [filterStatus, searchQuery, pengaduanList])

  const loadPengaduan = async () => {
    try {
      setIsLoading(true)
      
      // TODO: Fetch from API
      // Temporary mock data
      const mockData: Pengaduan[] = [
        {
          id: '1',
          kode_pengaduan: 'ADU-2024-0001',
          judul_pengaduan: 'Upah tidak dibayar sesuai UMR',
          isi_pengaduan: 'Perusahaan membayar upah di bawah UMR yang ditetapkan...',
          kategori: 'Pengupahan',
          status: 'di proses',
          lokasi_kejadian: 'PT ABC, Jakarta',
          tanggal_kejadian: '2024-01-15',
          created_at: '2024-01-16T10:00:00Z'
        },
        {
          id: '2',
          kode_pengaduan: 'ADU-2024-0002',
          judul_pengaduan: 'PHK tanpa pesangon',
          isi_pengaduan: 'Saya di-PHK tanpa diberikan pesangon sesuai ketentuan...',
          kategori: 'Ketenagakerjaan',
          status: 'selesai',
          lokasi_kejadian: 'PT XYZ, Bandung',
          tanggal_kejadian: '2024-01-10',
          created_at: '2024-01-11T14:30:00Z'
        },
        {
          id: '3',
          kode_pengaduan: 'ADU-2024-0003',
          judul_pengaduan: 'Tidak ada APD di tempat kerja',
          isi_pengaduan: 'Perusahaan tidak menyediakan APD untuk pekerja...',
          kategori: 'K3',
          status: 'diterima',
          lokasi_kejadian: 'PT DEF, Surabaya',
          tanggal_kejadian: '2024-01-20',
          created_at: '2024-01-21T09:15:00Z'
        }
      ]

      setPengaduanList(mockData)
      setFilteredList(mockData)
    } catch (error) {
      toast.error('Gagal memuat data pengaduan')
      console.error('Load error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      'diterima': 'bg-green-100 text-green-700 border-green-200',
      'di proses': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'selesai': 'bg-blue-100 text-blue-700 border-blue-200'
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-700'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'diterima':
        return <AlertCircle className="w-4 h-4" />
      case 'di proses':
        return <Clock className="w-4 h-4" />
      case 'selesai':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Kembali ke Dashboard</span>
            </Link>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{user.nama_lengkap}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Riwayat Pengaduan</h1>
          <p className="text-gray-600">Lihat semua pengaduan yang pernah Anda ajukan</p>
        </motion.div>

        {/* Filter & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan kode atau judul..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
              />
            </div>

            {/* Filter Status */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none appearance-none"
              >
                <option value="all">Semua Status</option>
                <option value="diterima">Diterima</option>
                <option value="di proses">Di Proses</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{pengaduanList.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {pengaduanList.filter(p => p.status === 'di proses').length}
              </p>
              <p className="text-sm text-gray-600">Di Proses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {pengaduanList.filter(p => p.status === 'selesai').length}
              </p>
              <p className="text-sm text-gray-600">Selesai</p>
            </div>
          </div>
        </motion.div>

        {/* Pengaduan List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || filterStatus !== 'all' ? 'Tidak Ada Hasil' : 'Belum Ada Pengaduan'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'Coba ubah filter atau kata kunci pencarian'
                : 'Mulai buat pengaduan pertama Anda'
              }
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Link
                href="/pengaduan"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-lg transition-all"
              >
                <FileText className="w-5 h-5" />
                <span>Buat Pengaduan</span>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredList.map((pengaduan, index) => (
              <motion.div
                key={pengaduan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-mono font-semibold text-primary-600">
                        {pengaduan.kode_pengaduan}
                      </span>
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(pengaduan.status)}`}>
                        {getStatusIcon(pengaduan.status)}
                        <span className="capitalize">{pengaduan.status}</span>
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {pengaduan.judul_pengaduan}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-3">
                      {pengaduan.isi_pengaduan}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="inline-flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{pengaduan.kategori}</span>
                      </span>
                      {pengaduan.lokasi_kejadian && (
                        <span className="inline-flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{pengaduan.lokasi_kejadian}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(pengaduan.created_at)}</span>
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/tracking?kode=${pengaduan.kode_pengaduan}`}
                    className="ml-4 flex items-center space-x-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Detail</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
