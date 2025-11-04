'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Users,
  FileText,
  Building,
  Settings,
  LogOut,
  Eye,
  UserPlus,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Home,
  RefreshCw,
  User as UserIcon,
  ClipboardCheck,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ClipboardList
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

interface Pengaduan {
  id: string
  kode_pengaduan: string
  judul_pengaduan: string
  kategori: string
  status: string
  nama_pelapor: string
  created_at: string
  bidang?: string
}

export default function AdminPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth()
  const [pengaduanList, setPengaduanList] = useState<Pengaduan[]>([])
  const [selectedPengaduan, setSelectedPengaduan] = useState<Pengaduan | null>(null)
  const [showDisposisiModal, setShowDisposisiModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [disposisiBidang, setDisposisiBidang] = useState('')
  const [keterangan, setKeterangan] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // Computed stats - dinamis berdasarkan pengaduanList
  const stats = {
    total: pengaduanList.length,
    perluDisposisi: pengaduanList.filter(p => 
      p.status === 'masuk' || 
      p.status === 'terverifikasi' || 
      p.status === 'diterima'
    ).length,
    sedangDiproses: pengaduanList.filter(p => 
      p.status === 'terdisposisi' || 
      p.status === 'tindak_lanjut' || 
      p.status === 'di proses'
    ).length,
    selesai: pengaduanList.filter(p => p.status === 'selesai').length
  }

  const bidangList = [
    { id: 1, nama: 'Bidang Hubungan Industrial', kode: 'HI' },
    { id: 2, nama: 'Bidang Latihan Kerja dan Produktivitas', kode: 'LATTAS' },
    { id: 3, nama: 'Bidang PTPK', kode: 'PTPK' },
    { id: 4, nama: 'UPTD BLK Pati', kode: 'BLK' },
    { id: 5, nama: 'Sekretariat', kode: 'SEKRETARIAT' }
  ]

  useEffect(() => {
    // Check authentication using AuthContext
    if (!authLoading && !isAuthenticated) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
      return
    }

    if (user && user.role !== 'admin') {
      toast.error('Akses ditolak. Halaman ini hanya untuk admin')
      router.push('/dashboard')
      return
    }

    if (user) {
      loadPengaduan()
    }
  }, [user, authLoading, isAuthenticated, router])

  const loadPengaduan = async () => {
    try {
      // TODO: Fetch from API
      // Mock data dengan status timeline
      const mockData: Pengaduan[] = [
        {
          id: '1',
          kode_pengaduan: 'ADU-2024-0001',
          judul_pengaduan: 'Upah tidak dibayar sesuai UMR',
          kategori: 'Pengupahan',
          status: 'masuk',
          nama_pelapor: 'John Doe',
          created_at: '2024-01-16T10:00:00Z'
        },
        {
          id: '2',
          kode_pengaduan: 'ADU-2024-0002',
          judul_pengaduan: 'PHK tanpa pesangon',
          kategori: 'Ketenagakerjaan',
          status: 'tindak_lanjut',
          nama_pelapor: 'Jane Smith',
          created_at: '2024-01-15T14:30:00Z',
          bidang: 'Bidang Hubungan Industrial'
        },
        {
          id: '3',
          kode_pengaduan: 'ADU-2024-0003',
          judul_pengaduan: 'Tidak ada APD di tempat kerja',
          kategori: 'K3',
          status: 'terverifikasi',
          nama_pelapor: 'Bob Johnson',
          created_at: '2024-01-14T09:15:00Z'
        },
        {
          id: '4',
          kode_pengaduan: 'ADU-2024-0004',
          judul_pengaduan: 'Jam kerja melebihi batas normal',
          kategori: 'Ketenagakerjaan',
          status: 'terdisposisi',
          nama_pelapor: 'Alice Brown',
          created_at: '2024-01-13T11:20:00Z',
          bidang: 'Bidang PTPK'
        },
        {
          id: '5',
          kode_pengaduan: 'ADU-2024-0005',
          judul_pengaduan: 'Diskriminasi gender di tempat kerja',
          kategori: 'Ketenagakerjaan',
          status: 'selesai',
          nama_pelapor: 'Charlie Davis',
          created_at: '2024-01-10T08:45:00Z',
          bidang: 'Bidang Hubungan Industrial'
        }
      ]
      setPengaduanList(mockData)
    } catch (error) {
      toast.error('Gagal memuat data pengaduan')
      console.error('Load error:', error)
    }
  }

  const handleUpdateStatus = async () => {
    if (!selectedPengaduan || !newStatus) {
      toast.error('Pilih status terlebih dahulu')
      return
    }

    setIsLoading(true)
    try {
      // TODO: Send to API
      // const response = await fetch(`/api/pengaduan/${selectedPengaduan.id}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // })

      await new Promise(resolve => setTimeout(resolve, 1500))

      // Update local state
      setPengaduanList(prev =>
        prev.map(p =>
          p.id === selectedPengaduan.id
            ? { ...p, status: newStatus }
            : p
        )
      )

      toast.success('Status berhasil diupdate')
      setShowStatusModal(false)
      setNewStatus('')
    } catch (error) {
      toast.error('Gagal mengupdate status')
      console.error('Update status error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisposisi = async () => {
    if (!disposisiBidang || !keterangan) {
      toast.error('Pilih bidang dan isi keterangan')
      return
    }

    setIsLoading(true)
    try {
      // TODO: Send to API
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast.success('Pengaduan berhasil didisposisikan')
      setShowDisposisiModal(false)
      setDisposisiBidang('')
      setKeterangan('')
      loadPengaduan()
    } catch (error) {
      toast.error('Gagal mendisposisikan pengaduan')
      console.error('Disposisi error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      'masuk': 'bg-blue-100 text-blue-700',
      'terverifikasi': 'bg-green-100 text-green-700',
      'terdisposisi': 'bg-purple-100 text-purple-700',
      'tindak_lanjut': 'bg-orange-100 text-orange-700',
      'selesai': 'bg-emerald-100 text-emerald-700',
      // Legacy support
      'diterima': 'bg-green-100 text-green-700',
      'di proses': 'bg-yellow-100 text-yellow-700'
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-700'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'masuk':
        return <FileText className="w-4 h-4" />
      case 'terverifikasi':
        return <CheckCircle className="w-4 h-4" />
      case 'terdisposisi':
        return <Send className="w-4 h-4" />
      case 'tindak_lanjut':
        return <RefreshCw className="w-4 h-4" />
      case 'selesai':
        return <CheckCircle className="w-4 h-4" />
      // Legacy support
      case 'diterima':
        return <AlertCircle className="w-4 h-4" />
      case 'di proses':
        return <Clock className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      'masuk': 'Pengaduan Masuk',
      'terverifikasi': 'Terverifikasi',
      'terdisposisi': 'Terdisposisi',
      'tindak_lanjut': 'Tindak Lanjut',
      'selesai': 'Selesai',
      // Legacy support
      'diterima': 'Diterima',
      'di proses': 'Di Proses'
    }
    return labels[status as keyof typeof labels] || status
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Update Status Modal */}
      {showStatusModal && selectedPengaduan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Status Pengaduan</h2>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Kode Pengaduan</p>
              <p className="font-mono font-semibold text-primary-600">{selectedPengaduan.kode_pengaduan}</p>
              <p className="text-sm text-gray-900 mt-2">{selectedPengaduan.judul_pengaduan}</p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">Status Saat Ini:</p>
                <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold mt-1 ${getStatusBadge(selectedPengaduan.status)}`}>
                  {getStatusIcon(selectedPengaduan.status)}
                  <span>{getStatusLabel(selectedPengaduan.status)}</span>
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <RefreshCw className="w-4 h-4 inline mr-1" />
                  Status Baru <span className="text-red-500">*</span>
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
                >
                  <option value="">Pilih Status</option>
                  <option value="masuk">📄 Pengaduan Masuk</option>
                  <option value="terverifikasi">✓ Terverifikasi</option>
                  <option value="terdisposisi">➤ Terdisposisi</option>
                  <option value="tindak_lanjut">🔄 Tindak Lanjut</option>
                  <option value="selesai">✓✓ Selesai</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-8">
              <button
                onClick={handleUpdateStatus}
                disabled={isLoading || !newStatus}
                className="flex-1 bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Update Status</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowStatusModal(false)
                  setNewStatus('')
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Disposisi Modal */}
      {showDisposisiModal && selectedPengaduan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Disposisi Pengaduan</h2>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Kode Pengaduan</p>
              <p className="font-mono font-semibold text-primary-600">{selectedPengaduan.kode_pengaduan}</p>
              <p className="text-sm text-gray-900 mt-2">{selectedPengaduan.judul_pengaduan}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-1" />
                  Disposisi ke Bidang <span className="text-red-500">*</span>
                </label>
                <select
                  value={disposisiBidang}
                  onChange={(e) => setDisposisiBidang(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
                >
                  <option value="">Pilih Bidang</option>
                  {bidangList.map((bidang) => (
                    <option key={bidang.id} value={bidang.id}>
                      {bidang.nama} ({bidang.kode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Keterangan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none min-h-[100px]"
                  placeholder="Catatan untuk bidang yang menangani..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={handleDisposisi}
                disabled={isLoading}
                className="flex-1 bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Kirim Disposisi</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowDisposisiModal(false)
                  setDisposisiBidang('')
                  setKeterangan('')
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Settings className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Admin Panel</h1>
                <p className="text-sm text-gray-600 font-medium">Manajemen Pengaduan SIPelan</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="hidden lg:flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                    {user.nama_lengkap.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">{user.nama_lengkap}</p>
                    <p className="text-xs text-purple-600 font-semibold">👑 Administrator</p>
                  </div>
                  <motion.div
                    animate={{ rotate: showProfileMenu ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                  >
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-white font-bold text-2xl border-2 border-white/30">
                          {user.nama_lengkap.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{user.nama_lengkap}</h3>
                          <p className="text-sm text-white/80">{user.email}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">👑 Admin</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Informasi Akun</p>
                      </div>
                      
                      <div className="space-y-1 py-2">
                        <div className="px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors">
                          <div className="flex items-center space-x-3">
                            <UserIcon className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Username</p>
                              <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors">
                          <div className="flex items-center space-x-3">
                            <Building className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Role</p>
                              <p className="text-sm font-semibold text-gray-900 capitalize">{user.role}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 mt-2 pt-2 space-y-1">
                        <Link
                          href="/settings"
                          onClick={() => setShowProfileMenu(false)}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-left"
                        >
                          <Settings className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Pengaturan</span>
                        </Link>
                        
                        <button
                          onClick={() => {
                            setShowProfileMenu(false)
                            logout()
                            toast.success('Logout berhasil')
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-red-50 rounded-xl transition-colors text-left text-red-600"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-3xl p-8 mb-8 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Selamat Datang, {user.nama_lengkap}! 👋</h2>
            <p className="text-white/90 text-lg">Kelola dan disposisikan pengaduan dengan mudah dan efisien</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-blue-200 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-semibold uppercase">Total</p>
              </div>
            </div>
            <motion.h3 
              key={stats.total}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1"
            >
              {stats.total}
            </motion.h3>
            <p className="text-sm text-gray-600 font-semibold">Total Pengaduan</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-green-200 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-semibold uppercase">Pending</p>
              </div>
            </div>
            <motion.h3
              key={stats.perluDisposisi}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1"
            >
              {stats.perluDisposisi}
            </motion.h3>
            <p className="text-sm text-gray-600 font-semibold">Perlu Disposisi</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-yellow-200 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-semibold uppercase">Progress</p>
              </div>
            </div>
            <motion.h3
              key={stats.sedangDiproses}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-extrabold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-1"
            >
              {stats.sedangDiproses}
            </motion.h3>
            <p className="text-sm text-gray-600 font-semibold">Sedang Diproses</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-purple-200 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-semibold uppercase">Done</p>
              </div>
            </div>
            <motion.h3
              key={stats.selesai}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1"
            >
              {stats.selesai}
            </motion.h3>
            <p className="text-sm text-gray-600 font-semibold">Selesai</p>
          </motion.div>
        </div>

        {/* Pengaduan List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Daftar Pengaduan</h2>
              <p className="text-gray-600">Kelola dan disposisikan pengaduan ke bidang terkait</p>
            </div>
            <motion.div 
              key={stats.total}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100"
            >
              <FileText className="w-5 h-5 text-purple-600" />
              <span className="font-bold text-purple-600">{stats.total} Pengaduan</span>
            </motion.div>
          </div>
          
          <div className="space-y-4">
            {pengaduanList.map((pengaduan, index) => (
              <motion.div
                key={pengaduan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white border-l-4 border-purple-500 rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 via-transparent to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header with Code and Status */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-mono font-bold text-purple-700">
                          {pengaduan.kode_pengaduan}
                        </span>
                      </div>
                      <span className={`inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm ${getStatusBadge(pengaduan.status)}`}>
                        {getStatusIcon(pengaduan.status)}
                        <span>{getStatusLabel(pengaduan.status)}</span>
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors line-clamp-2">
                      {pengaduan.judul_pengaduan}
                    </h3>
                    
                    {/* Meta Information */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center space-x-1.5 text-gray-600">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        <span className="font-medium">Kategori:</span>
                        <span className="text-gray-900 font-semibold">{pengaduan.kategori}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">Pelapor:</span>
                        <span className="text-gray-900 font-semibold">{pengaduan.nama_pelapor}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-gray-600">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDate(pengaduan.created_at)}</span>
                      </div>
                      {pengaduan.bidang && (
                        <div className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-lg">
                          <Building className="w-3.5 h-3.5 text-purple-600" />
                          <span className="text-purple-700 font-semibold text-xs">{pengaduan.bidang}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 ml-6">
                    <Link
                      href={`/tracking?kode=${pengaduan.kode_pengaduan}`}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center space-x-2 shadow-md hover:shadow-lg hover:scale-105 font-semibold"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Detail</span>
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedPengaduan(pengaduan)
                        setNewStatus(pengaduan.status)
                        setShowStatusModal(true)
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all flex items-center space-x-2 shadow-md hover:shadow-lg hover:scale-105 font-semibold"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Status</span>
                    </button>
                    {(pengaduan.status === 'masuk' || pengaduan.status === 'terverifikasi' || pengaduan.status === 'diterima') && (
                      <button
                        onClick={() => {
                          setSelectedPengaduan(pengaduan)
                          setShowDisposisiModal(true)
                        }}
                        className="px-4 py-2 bg-gradient-primary text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Disposisi</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
        {/* Main Footer */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <ClipboardCheck className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold">SIPelan</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Sistem Pengaduan Layanan Online Naker - Melayani pengaduan masyarakat terkait ketenagakerjaan dengan cepat dan transparan.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Menu Admin</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/admin" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    <span>Dashboard Admin</span>
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    <span>Pengaturan</span>
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    <span>Beranda</span>
                  </Link>
                </li>
                <li>
                  <Link href="/tracking" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    <span>Tracking Pengaduan</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Layanan */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Layanan Kami</h3>
              <ul className="space-y-3">
                <li className="text-gray-400 flex items-start space-x-2">
                  <ClipboardList className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Manajemen Pengaduan</span>
                </li>
                <li className="text-gray-400 flex items-start space-x-2">
                  <Users className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Disposisi ke Bidang</span>
                </li>
                <li className="text-gray-400 flex items-start space-x-2">
                  <FileText className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Monitoring Status</span>
                </li>
                <li className="text-gray-400 flex items-start space-x-2">
                  <Clock className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Laporan Real-time</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Hubungi Kami</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                  <span>Jl. Disnaker No. 123<br />Jakarta Pusat, DKI Jakarta<br />10110</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <Phone className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <span>(021) 1234-5678</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <Mail className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <span>info@disnaker.go.id</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-sm text-gray-400 mb-2">Jam Layanan:</p>
                <p className="text-white font-semibold">Senin - Jumat</p>
                <p className="text-gray-400 text-sm">08:00 - 16:00 WIB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm text-center md:text-left">
                &copy; 2024 Dinas Ketenagakerjaan. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Kebijakan Privasi
                </a>
                <span className="text-gray-600">|</span>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Syarat & Ketentuan
                </a>
                <span className="text-gray-600">|</span>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
