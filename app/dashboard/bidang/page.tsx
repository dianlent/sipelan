'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  LogOut,
  Settings,
  ChevronDown,
  RefreshCw,
  Activity,
  Inbox
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import StatCard from '@/components/dashboard/StatCard'
import ChartCard from '@/components/dashboard/ChartCard'
import RecentActivity from '@/components/dashboard/RecentActivity'
import ProgressBar from '@/components/dashboard/ProgressBar'

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

interface Stats {
  total: number
  diterima: number
  diproses: number
  selesai: number
}

export default function BidangDashboard() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const [stats, setStats] = useState<Stats>({
    total: 0,
    diterima: 0,
    diproses: 0,
    selesai: 0
  })
  const [recentPengaduan, setRecentPengaduan] = useState<Pengaduan[]>([])
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [bidangName, setBidangName] = useState('')

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated || !user) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
      return
    }

    if (user.role !== 'bidang') {
      toast.error('Akses ditolak. Halaman ini hanya untuk bidang.')
      router.push('/dashboard')
      return
    }

    loadBidangData()
  }, [user, isLoading, isAuthenticated, router])

  const loadBidangData = async () => {
    try {
      if (!user?.kode_bidang) {
        toast.error('Kode bidang tidak ditemukan')
        return
      }

      // Get bidang name
      const bidangNames: { [key: string]: string } = {
        'BINWASNAKER': 'Pengawasan Ketenagakerjaan',
        'HUBINDUSTRI': 'Hubungan Industrial',
        'PELATIHAN': 'Pelatihan Kerja',
        'PENEMPATAN': 'Penempatan Tenaga Kerja',
        'TRANSMIGRASI': 'Transmigrasi'
      }
      setBidangName(bidangNames[user.kode_bidang] || user.kode_bidang)

      const response = await fetch('/api/pengaduan')
      if (!response.ok) throw new Error('Failed to fetch data')
      
      const data = await response.json()
      const allPengaduan = data.pengaduan || []

      // Filter pengaduan for this bidang
      const bidangPengaduan = allPengaduan.filter((p: Pengaduan) => {
        // Check if pengaduan is dispositioned to this bidang
        const disposisiData = localStorage.getItem(`disposisi_${p.id}`)
        if (disposisiData) {
          const disposisi = JSON.parse(disposisiData)
          return disposisi.kode_bidang === user.kode_bidang
        }
        return false
      })

      // Calculate statistics
      const statsData: Stats = {
        total: bidangPengaduan.length,
        diterima: bidangPengaduan.filter((p: Pengaduan) => p.status === 'diterima').length,
        diproses: bidangPengaduan.filter((p: Pengaduan) => p.status === 'diproses').length,
        selesai: bidangPengaduan.filter((p: Pengaduan) => p.status === 'selesai').length
      }
      setStats(statsData)

      // Get recent pengaduan (last 5)
      const recent = bidangPengaduan
        .sort((a: Pengaduan, b: Pengaduan) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 5)
      setRecentPengaduan(recent)

    } catch (error) {
      console.error('Error loading bidang data:', error)
      toast.error('Gagal memuat data dashboard')
    }
  }

  const handleRefresh = () => {
    loadBidangData()
    toast.success('Data diperbarui')
  }

  const handleLogout = () => {
    logout()
    toast.success('Berhasil logout')
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">SIPELAN</h1>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                Bidang
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.nama_lengkap?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user?.nama_lengkap}</p>
                    <p className="text-xs text-gray-500">{bidangName}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4" />
                      Pengaturan
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang, {user?.nama_lengkap}
          </h2>
          <p className="text-gray-600">
            {bidangName} - Berikut adalah ringkasan pengaduan yang ditugaskan kepada Anda
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Pengaduan"
            value={stats.total}
            icon={Inbox}
            color="purple"
          />
          <StatCard
            title="Diterima"
            value={stats.diterima}
            icon={Clock}
            color="yellow"
          />
          <StatCard
            title="Diproses"
            value={stats.diproses}
            icon={Activity}
            color="blue"
          />
          <StatCard
            title="Selesai"
            value={stats.selesai}
            icon={CheckCircle}
            color="green"
          />
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Progress Chart */}
          <ChartCard
            title="Progress Penyelesaian"
            subtitle="Status pengaduan yang ditugaskan"
            icon={Activity}
          >
            <div className="space-y-4">
              <ProgressBar
                label="Selesai"
                value={stats.selesai}
                max={stats.total}
                color="green"
              />
              <ProgressBar
                label="Diproses"
                value={stats.diproses}
                max={stats.total}
                color="blue"
              />
              <ProgressBar
                label="Diterima"
                value={stats.diterima}
                max={stats.total}
                color="yellow"
              />
            </div>
          </ChartCard>

          {/* Performance Card */}
          <ChartCard
            title="Kinerja Bidang"
            subtitle="Tingkat penyelesaian pengaduan"
          >
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Tingkat Penyelesaian</p>
                <p className="text-4xl font-bold text-purple-600">
                  {stats.total > 0 ? ((stats.selesai / stats.total) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {stats.selesai} dari {stats.total} pengaduan selesai
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Sedang Diproses</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.diproses}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Menunggu</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.diterima}</p>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-6">
          <RecentActivity
            activities={recentPengaduan}
            title="Pengaduan Terbaru"
          />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/pengaduan"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:border-purple-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Semua Pengaduan</h3>
                <p className="text-sm text-gray-500">Lihat semua pengaduan bidang Anda</p>
              </div>
            </div>
          </Link>

          <Link
            href="/pengaduan?status=diproses"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:border-blue-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sedang Diproses</h3>
                <p className="text-sm text-gray-500">Pengaduan yang sedang ditangani</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
