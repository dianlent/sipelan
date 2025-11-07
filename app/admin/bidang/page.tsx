'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Building, Plus, Edit, Trash2, Search, Users, FileText, CheckCircle, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import AdminSidebar from '@/components/AdminSidebar'

interface Bidang {
  id: number
  nama_bidang: string
  kode_bidang: string
  deskripsi?: string
  created_at: string
  user_count?: number
  pengaduan_count?: number
}

interface KategoriBidang {
  id: number
  nama_kategori: string
  kode_kategori: string
}

export default function BidangManagementPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth()
  const [bidangList, setBidangList] = useState<Bidang[]>([])
  const [filteredBidang, setFilteredBidang] = useState<Bidang[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedBidang, setSelectedBidang] = useState<Bidang | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [kategoriBidangList, setKategoriBidangList] = useState<KategoriBidang[]>([])
  const [formData, setFormData] = useState({
    nama_bidang: '',
    kode_bidang: '',
    deskripsi: ''
  })

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    loadBidang()
    loadKategoriBidang()
  }, [user, authLoading, isAuthenticated, router])

  useEffect(() => {
    let filtered = bidangList
    
    if (searchQuery) {
      filtered = filtered.filter(b => 
        b.nama_bidang.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.kode_bidang.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    setFilteredBidang(filtered)
  }, [bidangList, searchQuery])

  const loadBidang = async () => {
    setIsLoadingData(true)
    try {
      const response = await fetch('/api/bidang')
      const result = await response.json()
      
      if (result.success) {
        console.log('Bidang data loaded:', result.data)
        setBidangList(result.data)
        setFilteredBidang(result.data)
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('Error loading bidang:', error)
      toast.error('Gagal memuat data bidang')
      setBidangList([])
      setFilteredBidang([])
    } finally {
      setIsLoadingData(false)
    }
  }

  const loadKategoriBidang = async () => {
    try {
      const response = await fetch('/api/kategori-bidang')
      const result = await response.json()
      
      if (result.success) {
        console.log('Kategori bidang loaded:', result.data)
        setKategoriBidangList(result.data)
      }
    } catch (error) {
      console.error('Error loading kategori bidang:', error)
    }
  }

  const handleAdd = async () => {
    if (!formData.nama_bidang || !formData.kode_bidang) {
      toast.error('Nama dan kode bidang harus diisi')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/bidang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Bidang berhasil ditambahkan')
        setShowAddModal(false)
        setFormData({ nama_bidang: '', kode_bidang: '', deskripsi: '' })
        loadBidang()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Gagal menambahkan bidang')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedBidang || !formData.nama_bidang || !formData.kode_bidang) {
      toast.error('Nama dan kode bidang harus diisi')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/bidang/${selectedBidang.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Bidang berhasil diupdate')
        setShowEditModal(false)
        setSelectedBidang(null)
        setFormData({ nama_bidang: '', kode_bidang: '', deskripsi: '' })
        loadBidang()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Gagal mengupdate bidang')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus bidang ini?')) return

    try {
      const response = await fetch(`/api/bidang/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Bidang berhasil dihapus')
        loadBidang()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Gagal menghapus bidang')
    }
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
          <div className="px-8 py-4">
            <h2 className="text-2xl font-bold text-gray-900">Manajemen Bidang</h2>
            <p className="text-sm text-gray-500">Kelola bidang/departemen di Disnaker</p>
          </div>
        </header>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{bidangList.length}</h3>
              <p className="text-sm text-gray-500">Total Bidang</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {bidangList.reduce((sum, b) => sum + (b.user_count || 0), 0)}
              </h3>
              <p className="text-sm text-gray-500">Total Staff</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {bidangList.reduce((sum, b) => sum + (b.pengaduan_count || 0), 0)}
              </h3>
              <p className="text-sm text-gray-500">Total Pengaduan</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari bidang..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={loadBidang}
                  disabled={isLoadingData}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Bidang</span>
                </button>
              </div>
            </div>

            {/* Bidang Grid */}
            {isLoadingData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-6 animate-pulse">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                    <div className="h-16 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between pt-4 border-t border-gray-100">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBidang.map((bidang) => (
                <motion.div
                  key={bidang.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedBidang(bidang)
                          setFormData({
                            nama_bidang: bidang.nama_bidang,
                            kode_bidang: bidang.kode_bidang,
                            deskripsi: bidang.deskripsi || ''
                          })
                          setShowEditModal(true)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(bidang.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">{bidang.nama_bidang}</h3>
                  <p className="text-sm text-blue-600 font-semibold mb-3">{bidang.kode_bidang}</p>
                  
                  {bidang.deskripsi && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{bidang.deskripsi}</p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{bidang.user_count || 0} Staff</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{bidang.pengaduan_count || 0} Pengaduan</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredBidang.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Tidak ada bidang ditemukan</p>
                </div>
              )}
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tambah Bidang Baru</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Bidang <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nama_bidang}
                  onChange={(e) => setFormData({...formData, nama_bidang: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Bidang Hubungan Industrial"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori Bidang <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.kode_bidang}
                  onChange={(e) => setFormData({...formData, kode_bidang: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Kategori Bidang</option>
                  {kategoriBidangList.map((kategori) => (
                    <option key={kategori.id} value={kategori.kode_kategori}>
                      {kategori.nama_kategori} ({kategori.kode_kategori})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Deskripsi bidang..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={handleAdd}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setFormData({ nama_bidang: '', kode_bidang: '', deskripsi: '' })
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedBidang && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Bidang</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Bidang <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nama_bidang}
                  onChange={(e) => setFormData({...formData, nama_bidang: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori Bidang <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.kode_bidang}
                  onChange={(e) => setFormData({...formData, kode_bidang: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Kategori Bidang</option>
                  {kategoriBidangList.map((kategori) => (
                    <option key={kategori.id} value={kategori.kode_kategori}>
                      {kategori.nama_kategori} ({kategori.kode_kategori})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={handleEdit}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Menyimpan...' : 'Update'}
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedBidang(null)
                  setFormData({ nama_bidang: '', kode_bidang: '', deskripsi: '' })
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
