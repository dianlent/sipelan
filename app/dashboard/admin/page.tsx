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
  TrendingUp,
  Users,
  LogOut,
  Settings,
  ChevronDown,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
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
  ditolak: number
}

interface CategoryStats {
  [key: string]: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const [stats, setStats] = useState<Stats>({
    total: 0,
    diterima: 0,
    diproses: 0,
    selesai: 0,
    ditolak: 0
  })
  const [categoryStats, setCategoryStats] = useState<CategoryStats>({})
  const [recentPengaduan, setRecentPengaduan] = useState<Pengaduan[]>([])
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [monthlyTrend, setMonthlyTrend] = useState({
    current: 0,
    previous: 0,
    percentage: 0
  })

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated || !user) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
      return
    }

    if (user.role !== 'admin') {
      toast.error('Akses ditolak. Halaman ini hanya untuk admin.')
      router.push('/dashboard')
      return
    }

    loadAdminData()
  }, [user, isLoading, isAuthenticated, router])

  const loadAdminData = async () => {
    try {
      const response = await fetch('/api/pengaduan')
      if (!response.ok) throw new Error('Failed to fetch data')
      
      const data = await response.json()
      const pengaduanList = data.pengaduan || []

      // Calculate statistics
      const statsData: Stats = {
        total: pengaduanList.length,
        diterima: pengaduanList.filter((p: Pengaduan) => p.status === 'diterima').length,
        diproses: pengaduanList.filter((p: Pengaduan) => p.status === 'diproses').length,
        selesai: pengaduanList.filter((p: Pengaduan) => p.status === 'selesai').length,
        ditolak: pengaduanList.filter((p: Pengaduan) => p.status === 'ditolak').length
      }
      setStats(statsData)

      // Calculate category statistics
      const categories: CategoryStats = {}
      pengaduanList.forEach((p: Pengaduan) => {
        categories[p.kategori] = (categories[p.kategori] || 0) + 1
      })
      setCategoryStats(categories)

      // Calculate monthly trend
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      
      const currentMonthData = pengaduanList.filter((p: Pengaduan) => {
        const date = new Date(p.created_at)
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear
      })
      
      const previousMonthData = pengaduanList.filter((p: Pengaduan) => {
        const date = new Date(p.created_at)
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
        return date.getMonth() === prevMonth && date.getFullYear() === prevYear
      })

      const current = currentMonthData.length
      const previous = previousMonthData.length
      const percentage = previous > 0 ? ((current - previous) / previous) * 100 : 0

      setMonthlyTrend({ current, previous, percentage })

      // Get recent pengaduan (last 5)
      const recent = pengaduanList
        .sort((a: Pengaduan, b: Pengaduan) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 5)
      setRecentPengaduan(recent)

    } catch (error) {
      console.error('Error loading admin data:', error)
      toast.error('Gagal memuat data dashboard')
    }
  }

  const handleRefresh = () => {
    loadAdminData()
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
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                Admin
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
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.nama_lengkap?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user?.nama_lengkap}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
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
            Berikut adalah ringkasan sistem pengaduan hari ini
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Pengaduan"
            value={stats.total}
            icon={FileText}
            color="blue"
            trend={{
              value: monthlyTrend.percentage,
              isPositive: monthlyTrend.percentage >= 0
            }}
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
            color="purple"
          />
          <StatCard
            title="Selesai"
            value={stats.selesai}
            icon={CheckCircle}
            color="green"
          />
        </div>

        {/* Charts and Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Target */}
          <ChartCard
            title="Target Bulanan"
            subtitle="Target penyelesaian pengaduan bulan ini"
            icon={TrendingUp}
          >
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Bulan Ini</p>
                <p className="text-2xl font-bold text-blue-600">{monthlyTrend.current} Pengaduan</p>
              </div>
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
                color="yellow"
              />
              <ProgressBar
                label="Diterima"
                value={stats.diterima}
                max={stats.total}
                color="blue"
              />
            </div>
          </ChartCard>

          {/* Category Statistics */}
          <ChartCard
            title="Statistik Kategori"
            subtitle="Distribusi pengaduan berdasarkan kategori"
            icon={PieChart}
          >
            <div className="space-y-3">
              {Object.entries(categoryStats)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count], index) => {
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
                  const colors = ['blue', 'green', 'yellow', 'purple', 'red']
                  const color = colors[index % colors.length] as 'blue' | 'green' | 'yellow' | 'purple' | 'red'
                  
                  return (
                    <ProgressBar
                      key={category}
                      label={category}
                      value={count}
                      max={stats.total}
                      color={color}
                    />
                  )
                })}
              {Object.keys(categoryStats).length === 0 && (
                <p className="text-center text-gray-500 py-8">Belum ada data kategori</p>
              )}
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/pengaduan"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:border-blue-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Semua Pengaduan</h3>
                <p className="text-sm text-gray-500">Lihat semua pengaduan</p>
              </div>
            </div>
          </Link>

          <Link
            href="/users"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:border-green-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Kelola Pengguna</h3>
                <p className="text-sm text-gray-500">Manajemen pengguna</p>
              </div>
            </div>
          </Link>

          <Link
            href="/reports"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:border-purple-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Laporan</h3>
                <p className="text-sm text-gray-500">Lihat laporan statistik</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
