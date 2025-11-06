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
  Home
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

    // Load data if authenticated and authorized
    if (user && user.bidang_id) {
      console.log('✅ Authenticated as bidang, loading data')
      loadPengaduan(user.bidang_id)
    }
  }, [user, authLoading, isAuthenticated, router])

  const loadPengaduan = async (bidangId: number) => {
    try {
      console.log('=== LOADING BIDANG PENGADUAN FROM DATABASE ===')
      console.log('Bidang ID:', bidangId)
      
      // Fetch pengaduan from API filtered by bidang_id
      const response = await fetch(`/api/pengaduan?bidang_id=${bidangId}&limit=100`)
      const result = await response.json()
      
      console.log('API Response:', result)
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal memuat data')
      }
      
      const pengaduanData = result.data || []
      console.log('Total pengaduan from DB:', pengaduanData.length)
      
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
      toast.error('Gagal memuat data pengaduan: ' + (error as Error).message)
      console.error('❌ Load error:', error)
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

      // Update status via API
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
        toast.success('Status berhasil diupdate')
      }

      setShowDetailModal(false)
      setStatusUpdate('')
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

      // Update status to selesai via API
      const response = await fetch(`/api/pengaduan/${selectedPengaduan.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'selesai'
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal menyimpan tanggapan')
      }

      console.log('✅ Tanggapan saved successfully')
      
      // Reload data
      if (user?.bidang_id) {
        await loadPengaduan(user.bidang_id)
      }

      toast.success('Tanggapan berhasil dikirim! Email notifikasi telah dikirim ke pelapor', {
        duration: 5000,
        icon: '📧'
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
      'diterima': 'bg-green-100 text-green-700',
      'di proses': 'bg-yellow-100 text-yellow-700',
      'selesai': 'bg-blue-100 text-blue-700'
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
                  <option value="di proses">Sedang Diproses</option>
                  <option value="selesai">Selesai</option>
                </select>
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
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-900">{user.nama_lengkap}</p>
                <p className="text-xs text-primary-600 font-medium">Bidang {user.kode_bidang}</p>
              </div>
              <Link
                href="/"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden md:inline">Home</span>
              </Link>
              <button
                onClick={() => {
                  logout()
                  toast.success('Logout berhasil')
                }}
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {pengaduanList.filter(p => p.status === 'di proses').length}
            </h3>
            <p className="text-sm text-gray-600">Sedang Diproses</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {pengaduanList.filter(p => p.status === 'selesai').length}
            </h3>
            <p className="text-sm text-gray-600">Selesai</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{pengaduanList.length}</h3>
            <p className="text-sm text-gray-600">Total Pengaduan</p>
          </motion.div>
        </div>

        {/* Filter & Debug */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="font-semibold text-gray-700">Filter Status:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'terdisposisi', 'diproses', 'tindak_lanjut', 'selesai'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-gradient-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'Semua' : status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
          
          {/* Debug Button (Development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  console.log('=== DEBUG INFO ===')
                  console.log('User:', user)
                  console.log('Kode Bidang:', user?.kode_bidang)
                  console.log('Pengaduan List:', pengaduanList)
                  console.log('Filter Status:', filterStatus)
                  const allPengaduan = JSON.parse(localStorage.getItem('allPengaduan') || '{}')
                  console.log('All Pengaduan:', allPengaduan)
                  console.log('Pengaduan dengan bidang:', Object.values(allPengaduan).filter((p: any) => p.bidang))
                }}
                className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
              >
                🐛 Debug Console
              </button>
            </div>
          )}
        </div>

        {/* Pengaduan List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Daftar Pengaduan</h2>
          
          {filteredPengaduan.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada pengaduan</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPengaduan.map((pengaduan) => (
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
