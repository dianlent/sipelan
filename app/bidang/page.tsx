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
  MessageSquare,
  Send,
  LogOut,
  Filter,
  Search,
  Calendar,
  User,
  Home,
  User as UserIcon
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import Footer from '@/components/Footer'

interface Pengaduan {
  id: string
  kode_pengaduan: string
  judul_pengaduan: string
  isi_pengaduan: string
  kategori: string
  status: string
  nama_pelapor: string
  email_pelapor: string
  lokasi_kejadian?: string
  tanggal_kejadian?: string
  created_at: string
  disposisi_keterangan?: string
}

export default function BidangPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth()
  const [pengaduanList, setPengaduanList] = useState<Pengaduan[]>([])
  const [selectedPengaduan, setSelectedPengaduan] = useState<Pengaduan | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showTanggapanModal, setShowTanggapanModal] = useState(false)
  const [tanggapan, setTanggapan] = useState('')
  const [statusUpdate, setStatusUpdate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      console.log('⏳ Auth is loading...')
      return
    }

    // Check authentication using AuthContext
    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login')
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
      return
    }

    // Check role authorization
    if (user && user.role !== 'bidang') {
      console.log('❌ Not bidang role, redirecting to dashboard')
      toast.error('Akses ditolak. Halaman ini hanya untuk bidang')
      router.push('/dashboard')
      return
    }

    // Debug user data
    console.log('=== USER DATA ===')
    console.log('User object:', user)
    console.log('Role:', user?.role)
    console.log('Bidang ID:', user?.bidang_id)
    console.log('Kode Bidang:', user?.kode_bidang)

    // Load data if authenticated and authorized
    if (user && user.bidang_id) {
      console.log('✅ Authenticated as bidang, loading data for bidang_id:', user.bidang_id)
      loadPengaduan(user.bidang_id)
    } else if (user) {
      console.error('⚠️ User bidang tidak punya bidang_id!')
      toast.error('User bidang tidak memiliki bidang_id. Hubungi administrator.')
    }
  }, [user, authLoading, isAuthenticated, router])

  const loadPengaduan = async (bidangId: number) => {
    try {
      console.log('=== LOADING BIDANG PENGADUAN FROM DATABASE ===')
      console.log('Bidang ID:', bidangId)
      console.log('User:', user)
      
      // Fetch pengaduan from API filtered by bidang_id
      const apiUrl = `/api/pengaduan?bidang_id=${bidangId}&limit=100`
      console.log('Fetching:', apiUrl)
      
      const response = await fetch(apiUrl)
      const result = await response.json()
      
      console.log('API Response:', result)
      console.log('Response OK?', response.ok)
      console.log('Success?', result.success)
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal memuat data')
      }
      
      const pengaduanData = result.data || []
      console.log('Total pengaduan from DB:', pengaduanData.length)
      console.log('Pengaduan data:', pengaduanData)
      
      // Convert to display format
      const bidangPengaduan: Pengaduan[] = pengaduanData.map((p: any) => ({
        id: p.id,
        kode_pengaduan: p.kode_pengaduan,
        judul_pengaduan: p.judul_pengaduan,
        isi_pengaduan: p.isi_pengaduan,
        kategori: p.kategori_pengaduan?.nama_kategori || 'Tidak ada kategori',
        status: p.status,
        nama_pelapor: p.anonim ? 'Anonim' : (p.nama_pelapor || p.users?.nama_lengkap || 'Tidak diketahui'),
        email_pelapor: p.anonim ? '' : (p.email_pelapor || p.users?.email || ''),
        lokasi_kejadian: p.lokasi_kejadian || '',
        tanggal_kejadian: p.tanggal_kejadian || '',
        created_at: p.created_at,
        disposisi_keterangan: p.disposisi_keterangan || ''
      }))
      
      console.log('✅ Total pengaduan ditemukan:', bidangPengaduan.length)
      console.log('Pengaduan list:', bidangPengaduan)
      
      setPengaduanList(bidangPengaduan)
      
      if (bidangPengaduan.length === 0) {
        toast('Belum ada pengaduan yang didisposisikan ke bidang Anda', { icon: 'ℹ️' })
      } else {
        toast.success(`${bidangPengaduan.length} pengaduan berhasil dimuat`)
      }
    } catch (error) {
      console.error('❌ Load error:', error)
      console.error('Error type:', typeof error)
      console.error('Error message:', (error as Error)?.message)
      console.error('Full error:', JSON.stringify(error, null, 2))
      
      const errorMessage = (error as Error)?.message || 'Unknown error'
      toast.error('Gagal memuat data pengaduan: ' + errorMessage)
      setPengaduanList([])
    }
  }

  const handleUpdateStatus = async () => {
    if (!selectedPengaduan || !statusUpdate) {
      toast.error('Pilih status terlebih dahulu')
      return
    }

    setIsLoading(true)
    try {
      console.log('=== BIDANG UPDATE STATUS ===')
      console.log('Pengaduan:', selectedPengaduan.kode_pengaduan)
      console.log('New Status:', statusUpdate)

      // If there's a tanggapan, submit it along with status update
      if (tanggapan.trim()) {
        const tanggapanResponse = await fetch(`/api/pengaduan/${selectedPengaduan.id}/tanggapan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tanggapan: tanggapan,
            petugas: user?.nama_lengkap || 'Petugas Bidang',
            status: statusUpdate
          })
        })

        const tanggapanResult = await tanggapanResponse.json()

        if (!tanggapanResponse.ok || !tanggapanResult.success) {
          throw new Error(tanggapanResult.message || 'Gagal menyimpan tanggapan')
        }
      } else {
        // Update status only via API
        const response = await fetch(`/api/pengaduan/${selectedPengaduan.id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: statusUpdate
          })
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Gagal update status')
        }
      }

      console.log('✅ Status updated successfully')

      // Reload data from database
      if (user?.bidang_id) {
        await loadPengaduan(user.bidang_id)
      }

      // Show appropriate message based on status
      if (statusUpdate === 'selesai') {
        toast.success('Pengaduan selesai! Notifikasi email telah dikirim ke pelapor', {
          duration: 5000,
          icon: '✅'
        })
      } else {
        toast.success(tanggapan.trim() ? 'Status dan tanggapan berhasil diupdate' : 'Status berhasil diupdate')
      }

      setShowDetailModal(false)
      setStatusUpdate('')
      setTanggapan('')
      console.log('=== END UPDATE ===')
    } catch (error) {
      console.error('❌ Update error:', error)
      toast.error((error as Error).message || 'Gagal mengupdate status')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitTanggapan = async () => {
    if (!tanggapan.trim()) {
      toast.error('Isi tanggapan terlebih dahulu')
      return
    }

    if (!selectedPengaduan) {
      toast.error('Pengaduan tidak ditemukan')
      return
    }

    setIsLoading(true)
    try {
      console.log('=== SUBMIT TANGGAPAN ===')
      console.log('Pengaduan:', selectedPengaduan.kode_pengaduan)
      console.log('Tanggapan:', tanggapan)

      // Submit tanggapan via new API endpoint
      const tanggapanResponse = await fetch(`/api/pengaduan/${selectedPengaduan.id}/tanggapan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tanggapan: tanggapan,
          petugas: user?.nama_lengkap || 'Petugas Bidang',
          status: 'selesai'
        })
      })

      const tanggapanResult = await tanggapanResponse.json()

      if (!tanggapanResponse.ok || !tanggapanResult.success) {
        throw new Error(tanggapanResult.message || 'Gagal menyimpan tanggapan')
      }

      console.log('✅ Tanggapan saved successfully')
      
      // Reload data
      if (user?.bidang_id) {
        await loadPengaduan(user.bidang_id)
      }

      toast.success('Tanggapan berhasil dikirim! Pelapor dapat melihat tanggapan Anda di timeline', {
        duration: 5000,
        icon: '💬'
      })
      
      setShowTanggapanModal(false)
      setTanggapan('')
      setSelectedPengaduan(null)
    } catch (error) {
      toast.error((error as Error).message || 'Gagal mengirim tanggapan')
      console.error('Submit error:', error)
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
        return <Clock className="w-4 h-4" />
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

  const filteredPengaduan = filterStatus === 'all' 
    ? pengaduanList 
    : pengaduanList.filter(p => p.status === filterStatus)

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Detail Modal */}
      {showDetailModal && selectedPengaduan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Detail Pengaduan</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Kode & Status */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Kode Pengaduan</p>
                  <p className="text-xl font-mono font-bold text-primary-600">{selectedPengaduan.kode_pengaduan}</p>
                </div>
                <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold ${getStatusBadge(selectedPengaduan.status)}`}>
                  {getStatusIcon(selectedPengaduan.status)}
                  <span className="capitalize">{selectedPengaduan.status}</span>
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{selectedPengaduan.judul_pengaduan}</h3>
                <p className="text-gray-600 leading-relaxed">{selectedPengaduan.isi_pengaduan}</p>
              </div>

              {/* Info */}
              <div className="grid md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                <div>
                  <p className="text-sm text-gray-500">Pelapor</p>
                  <p className="font-semibold text-gray-900">{selectedPengaduan.nama_pelapor}</p>
                  <p className="text-sm text-gray-600">{selectedPengaduan.email_pelapor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kategori</p>
                  <p className="font-semibold text-gray-900">{selectedPengaduan.kategori}</p>
                </div>
                {selectedPengaduan.lokasi_kejadian && (
                  <div>
                    <p className="text-sm text-gray-500">Lokasi</p>
                    <p className="font-semibold text-gray-900">{selectedPengaduan.lokasi_kejadian}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Tanggal Dibuat</p>
                  <p className="font-semibold text-gray-900">{formatDate(selectedPengaduan.created_at)}</p>
                </div>
              </div>

              {/* Disposisi Note */}
              {selectedPengaduan.disposisi_keterangan && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Catatan Disposisi:</p>
                  <p className="text-blue-800">{selectedPengaduan.disposisi_keterangan}</p>
                </div>
              )}

              {/* Update Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Update Status
                </label>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
                >
                  <option value="">Pilih Status</option>
                  <option value="tindak_lanjut">Tindak Lanjut</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>

              {/* Tanggapan (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tanggapan (Opsional)
                </label>
                <textarea
                  value={tanggapan}
                  onChange={(e) => setTanggapan(e.target.value)}
                  placeholder="Berikan tanggapan atau keterangan tambahan untuk pelapor..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💬 Tanggapan akan ditampilkan di timeline pengaduan
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleUpdateStatus}
                  disabled={isLoading || !statusUpdate}
                  className="flex-1 bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Status'}
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setShowTanggapanModal(true)
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Beri Tanggapan</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tanggapan Modal */}
      {showTanggapanModal && selectedPengaduan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Beri Tanggapan</h2>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Pengaduan</p>
              <p className="font-semibold text-gray-900">{selectedPengaduan.judul_pengaduan}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Isi Tanggapan
              </label>
              <textarea
                value={tanggapan}
                onChange={(e) => setTanggapan(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none min-h-[150px]"
                placeholder="Tulis tanggapan Anda untuk pengaduan ini..."
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSubmitTanggapan}
                disabled={isLoading}
                className="flex-1 bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>{isLoading ? 'Mengirim...' : 'Kirim Tanggapan'}</span>
              </button>
              <button
                onClick={() => {
                  setShowTanggapanModal(false)
                  setTanggapan('')
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
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Panel Bidang</h1>
                <p className="text-xs text-gray-500">{user.kode_bidang}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold">{user.nama_lengkap}</p>
                    <p className="text-xs text-purple-100">{user.kode_bidang}</p>
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                  >
                    {/* User Info */}
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <UserIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold">{user.nama_lengkap}</p>
                          <p className="text-xs text-purple-100">{user.email}</p>
                          <p className="text-xs text-purple-100 mt-1">Bidang {user.kode_bidang}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-all"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserIcon className="w-5 h-5" />
                        <span className="font-medium">Profil Saya</span>
                      </Link>

                      <Link
                        href="/"
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Home className="w-5 h-5" />
                        <span className="font-medium">Beranda</span>
                      </Link>
                      
                      <Link
                        href="/tracking"
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-all"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Search className="w-5 h-5" />
                        <span className="font-medium">Lacak Pengaduan</span>
                      </Link>

                      <div className="my-2 border-t border-gray-100"></div>

                      <button
                        onClick={() => {
                          logout()
                          toast.success('Logout berhasil')
                          setShowUserMenu(false)
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-all"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Keluar</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - 2 Sidebar Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Empty for now */}
        <div className="w-20 bg-gradient-to-br from-purple-50 to-blue-50 border-r border-gray-200">
          {/* Minimized sidebar */}
        </div>

        {/* Center - Pengaduan List */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Daftar Pengaduan</h2>
              <p className="text-gray-600">Kelola pengaduan yang masuk ke bidang Anda</p>
            </motion.div>
          
            {filteredPengaduan.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Pengaduan</h3>
                <p className="text-gray-500 mb-1">
                  {filterStatus === 'all' 
                    ? 'Belum ada pengaduan yang didisposisikan ke bidang Anda.'
                    : `Tidak ada pengaduan dengan status "${filterStatus}".`
                  }
                </p>
                <p className="text-sm text-gray-400">Pengaduan akan muncul setelah admin melakukan disposisi.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPengaduan.map((pengaduan, index) => (
                  <motion.div
                    key={pengaduan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-purple-200 transition-all cursor-pointer"
                  >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-mono font-semibold text-primary-600">
                          {pengaduan.kode_pengaduan}
                        </span>
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(pengaduan.status)}`}>
                          {getStatusIcon(pengaduan.status)}
                          <span className="capitalize">{pengaduan.status}</span>
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {pengaduan.judul_pengaduan}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{pengaduan.isi_pengaduan}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{pengaduan.nama_pelapor}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(pengaduan.created_at)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {pengaduan.status === 'selesai' ? (
                        <div className="px-4 py-2 bg-green-50 text-green-700 rounded-xl flex items-center space-x-2 border-2 border-green-200">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-semibold">Selesai</span>
                        </div>
                      ) : pengaduan.status === 'tindak_lanjut' ? (
                        <button
                          onClick={() => {
                            setSelectedPengaduan(pengaduan)
                            setShowTanggapanModal(true)
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Selesaikan</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedPengaduan(pengaduan)
                            setShowDetailModal(true)
                            setStatusUpdate(pengaduan.status)
                          }}
                          className="px-4 py-2 bg-gradient-primary text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Proses</span>
                        </button>
                      )}
                    </div>
                  </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Stats, Filter & Info */}
        <div className="w-80 bg-gradient-to-br from-blue-50 to-purple-50 border-l border-gray-200 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Stats Cards */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Statistik</h3>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border-l-4 border-yellow-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Diproses</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {pengaduanList.filter(p => p.status === 'tindak_lanjut').length}
                    </h3>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border-l-4 border-green-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Selesai</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {pengaduanList.filter(p => p.status === 'selesai').length}
                    </h3>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl p-4 shadow-lg text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-purple-100 font-medium mb-1">Total</p>
                    <h3 className="text-3xl font-bold">{pengaduanList.length}</h3>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Filter Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'Semua', icon: FileText, color: 'purple' },
                  { value: 'terdisposisi', label: 'Terdisposisi', icon: Send, color: 'blue' },
                  { value: 'tindak_lanjut', label: 'Tindak Lanjut', icon: Clock, color: 'yellow' },
                  { value: 'selesai', label: 'Selesai', icon: CheckCircle, color: 'green' }
                ].map((filter) => {
                  const Icon = filter.icon
                  return (
                    <button
                      key={filter.value}
                      onClick={() => setFilterStatus(filter.value)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        filterStatus === filter.value
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105'
                          : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="flex-1 text-left">{filter.label}</span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        filterStatus === filter.value
                          ? 'bg-white/20'
                          : 'bg-gray-100'
                      }`}>
                        {filter.value === 'all' ? pengaduanList.length : pengaduanList.filter(p => p.status === filter.value).length}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-purple-500" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Lihat Semua</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 bg-white border-2 border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 transition-all">
                  <Search className="w-5 h-5" />
                  <span className="font-medium">Cari Pengaduan</span>
                </button>
              </div>
            </motion.div>

            {/* Status Legend */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Status Legend</h3>
              <div className="space-y-3">
                {[
                  { status: 'terdisposisi', label: 'Terdisposisi', color: 'bg-purple-100 text-purple-700' },
                  { status: 'tindak_lanjut', label: 'Tindak Lanjut', color: 'bg-orange-100 text-orange-700' },
                  { status: 'selesai', label: 'Selesai', color: 'bg-emerald-100 text-emerald-700' }
                ].map((item) => (
                  <div key={item.status} className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${item.color}`}>
                      {item.label}
                    </div>
                    <span className="text-sm text-gray-500">
                      {pengaduanList.filter(p => p.status === item.status).length} item
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Help Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-6 shadow-lg text-white"
            >
              <h3 className="text-lg font-bold mb-2">Butuh Bantuan?</h3>
              <p className="text-sm text-purple-100 mb-4">
                Hubungi admin jika ada kendala dalam mengelola pengaduan
              </p>
              <button className="w-full bg-white text-purple-600 px-4 py-2 rounded-xl font-semibold hover:bg-purple-50 transition-all">
                Hubungi Admin
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
