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
  Eye,
  User as UserIcon,
  Settings,
  ChevronDown,
  RefreshCw
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
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) {
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

    // Redirect to role-specific dashboard
    if (user) {
      console.log('✅ Authenticated, redirecting to role-specific dashboard')
      if (user.role === 'admin') {
        router.push('/dashboard/admin')
      } else if (user.role === 'bidang') {
        router.push('/dashboard/bidang')
      } else {
        // For regular users, load their data
        loadUserData(user.id)
      }
    }
  }, [user, isLoading, isAuthenticated, router])

  // Reload data when window regains focus (user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      if (user && user.role !== 'bidang') {
        loadUserData(user.id)
      }
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [user])

  const handleRefresh = () => {
    if (user) {
      if (user.role === 'bidang') {
        loadBidangData(user.kode_bidang)
      } else {
        loadUserData(user.id)
      }
      toast.success('Data diperbarui')
    }
  }

  const loadBidangData = async (kodeBidang?: string) => {
    try {
      // Load pengaduan from localStorage that are dispositioned to this bidang
      const allPengaduan = JSON.parse(localStorage.getItem('allPengaduan') || '{}')
      
      console.log('=== BIDANG DASHBOARD DEBUG ===')
      console.log('Kode Bidang:', kodeBidang)
      console.log('All Pengaduan:', allPengaduan)
      console.log('Total pengaduan in localStorage:', Object.keys(allPengaduan).length)
      
      // Filter only pengaduan that are dispositioned to this bidang
      const bidangPengaduan: Pengaduan[] = Object.values(allPengaduan)
        .filter((p: any) => {
          // Check if pengaduan has been dispositioned to this bidang
          const hasBidang = p.bidang && (
            p.bidang.kode_bidang === kodeBidang || 
            p.bidang === kodeBidang ||
            (typeof p.bidang === 'string' && p.bidang.includes(kodeBidang))
          )
          
          console.log(`Pengaduan ${p.kode_pengaduan}:`, {
            hasBidang,
            bidangData: p.bidang,
            status: p.status
          })
          
          return hasBidang
        })
        .map((p: any) => ({
          id: p.id,
          kode_pengaduan: p.kode_pengaduan,
          judul_pengaduan: p.judul_pengaduan,
          isi_pengaduan: p.isi_pengaduan,
          kategori: p.kategori,
          status: p.status,
          nama_pelapor: p.user?.nama_lengkap || 'Anonim',
          created_at: p.created_at
        }))
      
      console.log('Filtered bidang pengaduan:', bidangPengaduan.length)
      console.log('Pengaduan list:', bidangPengaduan)
      console.log('=== END DEBUG ===')
      
      // Sort by date (newest first)
      bidangPengaduan.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      
      // Calculate stats
      const total = bidangPengaduan.length
      const diterima = bidangPengaduan.filter(p => p.status === 'masuk' || p.status === 'diterima' || p.status === 'terdisposisi').length
      const diproses = bidangPengaduan.filter(p => p.status === 'di proses' || p.status === 'tindak_lanjut').length
      const selesai = bidangPengaduan.filter(p => p.status === 'selesai').length
      
      setStats({
        total,
        diterima,
        diproses,
        selesai
      })
      
      setRecentPengaduan(bidangPengaduan.slice(0, 5)) // Show latest 5
      
      if (bidangPengaduan.length > 0) {
        toast.success(`${bidangPengaduan.length} pengaduan ditemukan`)
      }
    } catch (error) {
      console.error('Load error:', error)
      setStats({
        total: 0,
        diterima: 0,
        diproses: 0,
        selesai: 0
      })
      setRecentPengaduan([])
    }
  }

  const loadUserData = async (userId: string) => {
    try {
      // Load from localStorage
      const myPengaduanList = JSON.parse(localStorage.getItem('myPengaduan') || '[]')
      const allPengaduan = JSON.parse(localStorage.getItem('allPengaduan') || '{}')
      
      // Get full data for each pengaduan
      const userPengaduan = myPengaduanList.map((item: any) => {
        const fullData = allPengaduan[item.kode]
        if (fullData) {
          return {
            id: fullData.id,
            kode_pengaduan: fullData.kode_pengaduan,
            judul_pengaduan: fullData.judul_pengaduan,
            isi_pengaduan: fullData.isi_pengaduan,
            kategori: fullData.kategori,
            status: fullData.status,
            nama_pelapor: fullData.user?.nama_lengkap || 'Anda',
            created_at: fullData.created_at
          }
        }
        return null
      }).filter(Boolean)
      
      // Calculate stats
      const total = userPengaduan.length
      const diterima = userPengaduan.filter((p: any) => p.status === 'masuk' || p.status === 'diterima').length
      const diproses = userPengaduan.filter((p: any) => p.status === 'di proses' || p.status === 'terverifikasi' || p.status === 'terdisposisi' || p.status === 'tindak_lanjut').length
      const selesai = userPengaduan.filter((p: any) => p.status === 'selesai').length
      
      setStats({
        total,
        diterima,
        diproses,
        selesai
      })
      
      setRecentPengaduan(userPengaduan.slice(0, 5)) // Show latest 5
    } catch (error) {
      console.error('Load error:', error)
      setStats({
        total: 0,
        diterima: 0,
        diproses: 0,
        selesai: 0
      })
      setRecentPengaduan([])
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

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
    <div className="min-h-screen bg-gray-50">
      {/* Professional Navbar */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  SIPelan
                </h1>
                <p className="text-xs text-gray-600 font-medium">Dashboard {user.role === 'bidang' ? 'Bidang' : 'User'}</p>
              </div>
            </Link>

            {/* Navigation & Profile */}
            <div className="flex items-center space-x-4">
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="hidden lg:flex items-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-lg hover:scale-105 transition-all"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                    {user.nama_lengkap.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">{user.nama_lengkap}</p>
                    <p className="text-xs text-purple-600 font-semibold capitalize flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                  >
                    {/* Profile Header */}
                    <div className="relative p-6 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 text-white overflow-hidden">
                      {/* Decorative circles */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                      
                      <div className="relative flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl border-2 border-white/30">
                          {user.nama_lengkap.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-lg mb-1">{user.nama_lengkap}</p>
                          <p className="text-sm text-white/90 capitalize flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                              {user.role}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="relative mt-4 pt-4 border-t border-white/20">
                        <p className="text-xs text-white/70 mb-1">Email</p>
                        <p className="text-sm font-medium truncate">{user.email || 'user@example.com'}</p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-3">
                      <Link
                        href="/settings"
                        className="flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all group"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                          <Settings className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900">Pengaturan</p>
                          <p className="text-xs text-gray-500">Kelola profil & preferensi</p>
                        </div>
                      </Link>

                      <button
                        onClick={() => {
                          setShowProfileDropdown(false)
                          handleLogout()
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all group mt-1"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                          <LogOut className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-bold text-gray-900">Logout</p>
                          <p className="text-xs text-gray-500">Keluar dari akun Anda</p>
                        </div>
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                      <p className="text-xs text-gray-500 text-center">
                        SIPelan v2.0 • © {new Date().getFullYear()}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={handleLogout}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2-Column Layout */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDEBAR - Stats & Profile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Welcome Card */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold">{user.nama_lengkap.charAt(0)}</span>
              </div>
              <h2 className="text-lg font-bold text-center mb-1">{user.nama_lengkap}</h2>
              <p className="text-sm text-white/80 text-center capitalize mb-4">{user.role}</p>
              <div className="pt-4 border-t border-white/20">
                <p className="text-xs text-white/70 mb-1">Email</p>
                <p className="text-sm font-medium truncate">{user.email || 'user@example.com'}</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="space-y-3">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-xs text-gray-600">Total Pengaduan</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-gray-900">{stats.diproses}</p>
                    <p className="text-xs text-gray-600">Sedang Diproses</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-gray-900">{stats.selesai}</p>
                    <p className="text-xs text-gray-600">Selesai</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Menu Cepat</h3>
              <div className="space-y-2">
                <Link
                  href="/pengaduan"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-700">Buat Pengaduan</span>
                </Link>
                <Link
                  href="/tracking"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Search className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Tracking</span>
                </Link>
                <Link
                  href={user.role === 'bidang' ? '/bidang' : '/riwayat'}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4 text-pink-600" />
                  <span className="text-gray-700">{user.role === 'bidang' ? 'Panel Bidang' : 'Riwayat'}</span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDEBAR - Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Welcome Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Selamat Datang, {user.nama_lengkap}! 👋
                  </h1>
                  <p className="text-sm text-gray-600">Kelola pengaduan Anda dengan mudah dan efisien</p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 rounded-xl hover:shadow-md transition-all group"
                >
                  <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="text-sm font-semibold">Refresh</span>
                </button>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Link
                href="/pengaduan"
                className="flex items-center space-x-3 p-4 bg-gradient-primary text-white rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Buat Pengaduan</h3>
                  <p className="text-xs text-white/80">Ajukan pengaduan baru</p>
                </div>
              </Link>

              <Link
                href="/tracking"
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <Search className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Tracking</h3>
                  <p className="text-xs text-white/80">Lacak status pengaduan</p>
                </div>
              </Link>

              <Link
                href={user.role === 'bidang' ? '/bidang' : '/riwayat'}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <Eye className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">{user.role === 'bidang' ? 'Panel Bidang' : 'Riwayat'}</h3>
                  <p className="text-xs text-white/80">{user.role === 'bidang' ? 'Kelola pengaduan' : 'Lihat semua'}</p>
                </div>
              </Link>
            </motion.div>

            {/* Activity List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
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
              
              <div className="space-y-3">
                {recentPengaduan.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {user.role === 'bidang' ? 'Belum Ada Pengaduan' : 'Belum Ada Pengaduan'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {user.role === 'bidang' 
                        ? 'Pengaduan yang didisposisi akan muncul di sini'
                        : 'Mulai buat pengaduan pertama Anda'
                      }
                    </p>
                    {user.role !== 'bidang' && (
                      <Link
                        href="/pengaduan"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-md transition-all text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Buat Pengaduan</span>
                      </Link>
                    )}
                  </div>
                ) : (
                  recentPengaduan.map((pengaduan) => (
                    <div
                      key={pengaduan.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-sm hover:border-gray-300 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono font-semibold text-primary-600">
                              {pengaduan.kode_pengaduan}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(pengaduan.status)}`}>
                              {pengaduan.status}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                              {pengaduan.kategori}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 mb-1 truncate">
                            {pengaduan.judul_pengaduan}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-1 mb-2">{pengaduan.isi_pengaduan}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {pengaduan.nama_pelapor}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(pengaduan.created_at)}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={user.role === 'bidang' ? '/bidang' : `/tracking?kode=${pengaduan.kode_pengaduan}`}
                          className="flex-shrink-0 px-3 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-md transition-all flex items-center gap-1.5 text-sm"
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
      </div>
    </div>
  )
}
