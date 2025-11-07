'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FileText, Search, Filter, Eye, Send, CheckCircle, 
  Clock, AlertCircle, RefreshCw, Calendar, User, Building
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import AdminSidebar from '@/components/AdminSidebar'

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

export default function PengaduanManagementPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth()
  const [pengaduanList, setPengaduanList] = useState<Pengaduan[]>([])
  const [filteredPengaduan, setFilteredPengaduan] = useState<Pengaduan[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [showDisposisiModal, setShowDisposisiModal] = useState(false)
  const [selectedPengaduan, setSelectedPengaduan] = useState<Pengaduan | null>(null)
  const [disposisiBidang, setDisposisiBidang] = useState('')
  const [keterangan, setKeterangan] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const bidangList = [
    { bidang_id: 1, nama: 'Bidang Hubungan Industrial', kode: 'HI' },
    { bidang_id: 2, nama: 'Bidang Latihan Kerja dan Produktivitas', kode: 'LATTAS' },
    { bidang_id: 3, nama: 'Bidang PTPK', kode: 'PTPK' },
    { bidang_id: 4, nama: 'Bidang BLK', kode: 'BLK' },
    { bidang_id: 5, nama: 'Bidang Sekretariat', kode: 'SEKRETARIAT' }
  ]

  const stats = {
    total: pengaduanList.length,
    masuk: pengaduanList.filter(p => p.status === 'masuk').length,
    terverifikasi: pengaduanList.filter(p => p.status === 'terverifikasi').length,
    terdisposisi: pengaduanList.filter(p => p.status === 'terdisposisi').length,
    selesai: pengaduanList.filter(p => p.status === 'selesai').length
  }

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    loadPengaduan()
  }, [user, authLoading, isAuthenticated, router])

  useEffect(() => {
    let filtered = pengaduanList
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.kode_pengaduan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.judul_pengaduan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nama_pelapor.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter)
    }
    
    setFilteredPengaduan(filtered)
  }, [pengaduanList, searchQuery, statusFilter])

  const loadPengaduan = async () => {
    setIsLoadingData(true)
    try {
      const response = await fetch('/api/pengaduan?page=1&limit=100')
      const result = await response.json()
      
      if (result.success) {
        const pengaduanData = result.data.map((p: any) => ({
          id: p.id,
          kode_pengaduan: p.kode_pengaduan,
          judul_pengaduan: p.judul_pengaduan,
          kategori: p.kategori_pengaduan?.nama_kategori || 'Tidak ada kategori',
          status: p.status,
          nama_pelapor: p.anonim ? 'Anonim' : (p.nama_pelapor || p.users?.nama_lengkap || 'Tidak diketahui'),
          created_at: p.created_at,
          bidang: p.bidang?.nama_bidang || null
        }))
        
        setPengaduanList(pengaduanData)
        setFilteredPengaduan(pengaduanData)
      }
    } catch (error) {
      console.error('Error loading pengaduan:', error)
      toast.error('Gagal memuat data pengaduan')
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleVerifikasi = async (pengaduan: Pengaduan) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/pengaduan/${pengaduan.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'terverifikasi' })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Pengaduan telah diverifikasi')
        loadPengaduan()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Gagal memverifikasi pengaduan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisposisi = async () => {
    if (!disposisiBidang || !keterangan || !selectedPengaduan) {
      toast.error('Pilih bidang dan isi keterangan')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/disposisi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pengaduan_id: selectedPengaduan.id,
          dari_bidang_id: null,
          ke_bidang_id: parseInt(disposisiBidang),
          keterangan: keterangan,
          user_id: user?.id || null
        })
      })

      const result = await response.json()

      if (result.success) {
        const selectedBidang = bidangList.find(b => b.bidang_id.toString() === disposisiBidang)
        toast.success(`Pengaduan berhasil didisposisikan ke ${selectedBidang?.nama}`)
        setShowDisposisiModal(false)
        setDisposisiBidang('')
        setKeterangan('')
        loadPengaduan()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Gagal mendisposisikan pengaduan')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      'masuk': 'bg-blue-100 text-blue-700 border-blue-200',
      'terverifikasi': 'bg-green-100 text-green-700 border-green-200',
      'terdisposisi': 'bg-purple-100 text-purple-700 border-purple-200',
      'tindak_lanjut': 'bg-orange-100 text-orange-700 border-orange-200',
      'selesai': 'bg-emerald-100 text-emerald-700 border-emerald-200'
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-700'
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      'masuk': 'Pengaduan Masuk',
      'terverifikasi': 'Terverifikasi',
      'terdisposisi': 'Terdisposisi',
      'tindak_lanjut': 'Tindak Lanjut',
      'selesai': 'Selesai'
    }
    return labels[status as keyof typeof labels] || status
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar user={user} onLogout={() => {
        logout()
        toast.success('Logout berhasil')
      }} />
      
      <div className="lg:pl-[280px]">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Manajemen Pengaduan</h2>
            <p className="text-sm text-gray-500">Kelola dan disposisikan pengaduan masyarakat</p>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</h3>
              <p className="text-sm text-gray-500">Total Pengaduan</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.masuk}</h3>
              <p className="text-sm text-gray-500">Masuk</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.terverifikasi}</h3>
              <p className="text-sm text-gray-500">Terverifikasi</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Send className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.terdisposisi}</h3>
              <p className="text-sm text-gray-500">Terdisposisi</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.selesai}</h3>
              <p className="text-sm text-gray-500">Selesai</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex-1 flex gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari pengaduan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Status</option>
                  <option value="masuk">Masuk</option>
                  <option value="terverifikasi">Terverifikasi</option>
                  <option value="terdisposisi">Terdisposisi</option>
                  <option value="tindak_lanjut">Tindak Lanjut</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>

              <button
                onClick={loadPengaduan}
                disabled={isLoadingData}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Pengaduan List */}
            {isLoadingData ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-6 animate-pulse">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div className="w-24 h-10 bg-gray-200 rounded"></div>
                        <div className="w-24 h-10 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPengaduan.map((pengaduan) => (
                  <motion.div
                    key={pengaduan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                            {pengaduan.kode_pengaduan}
                          </span>
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(pengaduan.status)}`}>
                            {getStatusLabel(pengaduan.status)}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {pengaduan.judul_pengaduan}
                        </h3>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span>{pengaduan.kategori}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{pengaduan.nama_pelapor}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(pengaduan.created_at)}</span>
                          </div>
                          {pengaduan.bidang && (
                            <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-lg">
                              <Building className="w-4 h-4 text-purple-600" />
                              <span className="text-purple-700 font-semibold">{pengaduan.bidang}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-6">
                        <Link
                          href={`/tracking?kode=${pengaduan.kode_pengaduan}`}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Detail</span>
                        </Link>
                        
                        {pengaduan.status === 'masuk' && (
                          <button
                            onClick={() => handleVerifikasi(pengaduan)}
                            disabled={isLoading}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Verifikasi</span>
                          </button>
                        )}
                        
                        {pengaduan.status === 'terverifikasi' && (
                          <button
                            onClick={() => {
                              setSelectedPengaduan(pengaduan)
                              setShowDisposisiModal(true)
                            }}
                            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                          >
                            <Send className="w-4 h-4" />
                            <span>Disposisi</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {filteredPengaduan.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Tidak ada pengaduan ditemukan</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Disposisi Modal */}
      {showDisposisiModal && selectedPengaduan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Disposisi Pengaduan</h3>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Kode Pengaduan</p>
              <p className="font-mono font-semibold text-blue-600">{selectedPengaduan.kode_pengaduan}</p>
              <p className="text-sm text-gray-900 mt-2">{selectedPengaduan.judul_pengaduan}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Disposisi ke Bidang <span className="text-red-500">*</span>
                </label>
                <select
                  value={disposisiBidang}
                  onChange={(e) => setDisposisiBidang(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Bidang</option>
                  {bidangList.map((bidang) => (
                    <option key={bidang.bidang_id} value={bidang.bidang_id}>
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Catatan untuk bidang yang menangani..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={handleDisposisi}
                disabled={isLoading}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Mengirim...' : 'Kirim Disposisi'}
              </button>
              <button
                onClick={() => {
                  setShowDisposisiModal(false)
                  setDisposisiBidang('')
                  setKeterangan('')
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
