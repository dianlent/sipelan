'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  LogOut,
  Plus,
  Eye
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

interface Pengaduan {
  id: string
  kode_pengaduan: string
  judul_pengaduan: string
  isi_pengaduan: string
  kategori: string
  status: string
  nama_pelapor: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const [stats, setStats] = useState({
    total: 0,
    diterima: 0,
    diproses: 0,
    selesai: 0
  })
  const [recentPengaduan, setRecentPengaduan] = useState<Pengaduan[]>([])

  useEffect(() => {
    // Check authentication using AuthContext
    if (!isLoading && !isAuthenticated) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
      return
    }

    // Load data based on role when user is available
    if (user) {
      if (user.role === 'bidang') {
        loadBidangData(user.kode_bidang)
      } else {
        loadUserData(user.id)
      }
    }
  }, [user, isLoading, isAuthenticated, router])

  const loadBidangData = async (kodeBidang?: string) => {
    try {
      // TODO: Fetch from API based on kode_bidang
      // Mock data - pengaduan yang didisposisi ke bidang ini
      const mockPengaduan: Pengaduan[] = [
        {
          id: '1',
          kode_pengaduan: 'ADU-2024-0001',
          judul_pengaduan: 'Upah tidak dibayar sesuai UMR',
          isi_pengaduan: 'Perusahaan tempat saya bekerja membayar upah di bawah UMR...',
          kategori: 'Pengupahan',
          status: 'di proses',
          nama_pelapor: 'John Doe',
          created_at: '2024-01-16T10:00:00Z'
        },
        {
          id: '2',
          kode_pengaduan: 'ADU-2024-0005',
          judul_pengaduan: 'Tidak ada jaminan kesehatan',
          isi_pengaduan: 'Perusahaan tidak mendaftarkan karyawan ke BPJS...',
          kategori: 'Ketenagakerjaan',
          status: 'di proses',
          nama_pelapor: 'Jane Smith',
          created_at: '2024-01-18T14:30:00Z'
        }
      ]
      setRecentPengaduan(mockPengaduan)
      setStats({
        total: mockPengaduan.length,
        diterima: 0,
        diproses: mockPengaduan.filter(p => p.status === 'di proses').length,
        selesai: mockPengaduan.filter(p => p.status === 'selesai').length
      })
    } catch (error) {
      console.error('Load error:', error)
    }
  }

  const loadUserData = async (userId: string) => {
    try {
      // TODO: Fetch user's own pengaduan
      setStats({
        total: 0,
        diterima: 0,
        diproses: 0,
        selesai: 0
      })
      setRecentPengaduan([])
    } catch (error) {
      console.error('Load error:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      'diterima': 'bg-green-100 text-green-700',
      'di proses': 'bg-yellow-100 text-yellow-700',
      'selesai': 'bg-blue-100 text-blue-700'
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-700'
  }

  const handleLogout = () => {
    logout()
    toast.success('Logout berhasil')
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
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SIPelan</span>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-900">{user.nama_lengkap}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang, {user.nama_lengkap}! 👋
          </h1>
          <p className="text-gray-600">Kelola pengaduan Anda dengan mudah</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</h3>
            <p className="text-sm text-gray-600">Total Pengaduan</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.diterima}</h3>
            <p className="text-sm text-gray-600">Diterima</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.diproses}</h3>
            <p className="text-sm text-gray-600">Di Proses</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.selesai}</h3>
            <p className="text-sm text-gray-600">Selesai</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/pengaduan"
              className="flex items-center space-x-4 p-6 bg-gradient-primary text-white rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <Plus className="w-8 h-8" />
              <div>
                <h3 className="font-semibold text-lg">Buat Pengaduan</h3>
                <p className="text-sm text-white/80">Ajukan pengaduan baru</p>
              </div>
            </Link>

            <Link
              href="/tracking"
              className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <Search className="w-8 h-8" />
              <div>
                <h3 className="font-semibold text-lg">Tracking</h3>
                <p className="text-sm text-white/80">Lacak status pengaduan</p>
              </div>
            </Link>

            <Link
              href={user.role === 'bidang' ? '/bidang' : '/riwayat'}
              className="flex items-center space-x-4 p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <Eye className="w-8 h-8" />
              <div>
                <h3 className="font-semibold text-lg">{user.role === 'bidang' ? 'Panel Bidang' : 'Riwayat'}</h3>
                <p className="text-sm text-white/80">{user.role === 'bidang' ? 'Kelola pengaduan bidang' : 'Lihat semua pengaduan'}</p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {user.role === 'bidang' ? 'Pengaduan Terdisposisi' : 'Aktivitas Terbaru'}
            </h2>
            {user.role === 'bidang' && recentPengaduan.length > 0 && (
              <Link
                href="/bidang"
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
              >
                Lihat Semua →
              </Link>
            )}
          </div>
          <div className="space-y-4">
            {recentPengaduan.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {user.role === 'bidang' ? 'Belum Ada Pengaduan Terdisposisi' : 'Belum Ada Pengaduan'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {user.role === 'bidang' 
                    ? 'Pengaduan yang didisposisi ke bidang Anda akan muncul di sini'
                    : 'Mulai buat pengaduan pertama Anda'
                  }
                </p>
                {user.role !== 'bidang' && (
                  <Link
                    href="/pengaduan"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Buat Pengaduan</span>
                  </Link>
                )}
              </div>
            ) : (
              /* Pengaduan List */
              recentPengaduan.map((pengaduan) => (
                <div
                  key={pengaduan.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-mono font-semibold text-primary-600">
                          {pengaduan.kode_pengaduan}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(pengaduan.status)}`}>
                          {pengaduan.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {pengaduan.judul_pengaduan}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{pengaduan.isi_pengaduan}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{pengaduan.nama_pelapor}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(pengaduan.created_at)}</span>
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                          {pengaduan.kategori}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={user.role === 'bidang' ? '/bidang' : `/tracking?kode=${pengaduan.kode_pengaduan}`}
                      className="ml-4 px-4 py-2 bg-gradient-primary text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{user.role === 'bidang' ? 'Proses' : 'Detail'}</span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
