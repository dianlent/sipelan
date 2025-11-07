'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2'
import {
  TrendingUp, FileText, Users, Clock, CheckCircle,
  AlertCircle, Calendar, Download, Filter
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import AdminSidebar from '@/components/AdminSidebar'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Stats {
  totalPengaduan: number
  totalUsers: number
  pengaduanSelesai: number
  pengaduanProses: number
  pengaduanByMonth: Array<{ month: string; count: number }>
  pengaduanByStatus: Array<{ status: string; count: number; color: string }>
  pengaduanByKategori: Array<{ kategori: string; count: number }>
  pengaduanByBidang: Array<{ bidang: string; count: number }>
}

export default function ReportsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('6months')

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    loadStats()
  }, [user, authLoading, isAuthenticated, router, timeRange])

  const loadStats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/stats?range=${timeRange}`)
      const result = await response.json()

      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
      toast.error('Gagal memuat data statistik')
    } finally {
      setIsLoading(false)
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
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Laporan & Statistik</h2>
              <p className="text-sm text-gray-500">Analisis data pengaduan dan performa sistem</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1month">1 Bulan Terakhir</option>
                <option value="3months">3 Bulan Terakhir</option>
                <option value="6months">6 Bulan Terakhir</option>
                <option value="1year">1 Tahun Terakhir</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat statistik...</p>
            </div>
          ) : stats ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
                >
                  <div className="flex items-center justify-between mb-4">
                    <FileText className="w-8 h-8 opacity-80" />
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.totalPengaduan}</h3>
                  <p className="text-blue-100 text-sm">Total Pengaduan</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
                >
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="w-8 h-8 opacity-80" />
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.pengaduanSelesai}</h3>
                  <p className="text-green-100 text-sm">Pengaduan Selesai</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-8 h-8 opacity-80" />
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.pengaduanProses}</h3>
                  <p className="text-orange-100 text-sm">Dalam Proses</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 opacity-80" />
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.totalUsers}</h3>
                  <p className="text-purple-100 text-sm">Total Pengguna</p>
                </motion.div>
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Line Chart - Trend Pengaduan */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl p-6 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Trend Pengaduan</h3>
                      <p className="text-sm text-gray-500">Pengaduan per bulan</p>
                    </div>
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="h-[300px]">
                    <Line
                      data={{
                        labels: stats.pengaduanByMonth.map(item => item.month),
                        datasets: [{
                          label: 'Jumlah Pengaduan',
                          data: stats.pengaduanByMonth.map(item => item.count),
                          borderColor: '#3B82F6',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          borderWidth: 3,
                          fill: true,
                          tension: 0.4,
                          pointRadius: 5,
                          pointHoverRadius: 7,
                          pointBackgroundColor: '#3B82F6'
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: true,
                            position: 'top' as const
                          },
                          tooltip: {
                            backgroundColor: '#fff',
                            titleColor: '#1f2937',
                            bodyColor: '#6b7280',
                            borderColor: '#e5e7eb',
                            borderWidth: 1,
                            padding: 12,
                            displayColors: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              color: '#6b7280',
                              font: { size: 12 }
                            },
                            grid: {
                              color: '#f3f4f6'
                            }
                          },
                          x: {
                            ticks: {
                              color: '#6b7280',
                              font: { size: 12 }
                            },
                            grid: {
                              display: false
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </motion.div>

                {/* Doughnut Chart - Status Pengaduan */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl p-6 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Status Pengaduan</h3>
                      <p className="text-sm text-gray-500">Distribusi berdasarkan status</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="h-[300px] flex items-center justify-center">
                    <Doughnut
                      data={{
                        labels: stats.pengaduanByStatus.map(item => item.status),
                        datasets: [{
                          data: stats.pengaduanByStatus.map(item => item.count),
                          backgroundColor: stats.pengaduanByStatus.map(item => item.color),
                          borderWidth: 2,
                          borderColor: '#fff'
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: true,
                            position: 'bottom' as const,
                            labels: {
                              padding: 15,
                              font: { size: 12 },
                              color: '#6b7280'
                            }
                          },
                          tooltip: {
                            backgroundColor: '#fff',
                            titleColor: '#1f2937',
                            bodyColor: '#6b7280',
                            borderColor: '#e5e7eb',
                            borderWidth: 1,
                            padding: 12
                          }
                        }
                      }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart - Pengaduan by Kategori */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl p-6 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Pengaduan per Kategori</h3>
                      <p className="text-sm text-gray-500">Top kategori pengaduan</p>
                    </div>
                    <Filter className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="h-[300px]">
                    <Bar
                      data={{
                        labels: stats.pengaduanByKategori.map(item => item.kategori),
                        datasets: [{
                          label: 'Jumlah',
                          data: stats.pengaduanByKategori.map(item => item.count),
                          backgroundColor: '#10B981',
                          borderRadius: 8,
                          borderSkipped: false
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          },
                          tooltip: {
                            backgroundColor: '#fff',
                            titleColor: '#1f2937',
                            bodyColor: '#6b7280',
                            borderColor: '#e5e7eb',
                            borderWidth: 1,
                            padding: 12
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              color: '#6b7280',
                              font: { size: 12 }
                            },
                            grid: {
                              color: '#f3f4f6'
                            }
                          },
                          x: {
                            ticks: {
                              color: '#6b7280',
                              font: { size: 12 }
                            },
                            grid: {
                              display: false
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </motion.div>

                {/* Bar Chart - Pengaduan by Bidang */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl p-6 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Pengaduan per Bidang</h3>
                      <p className="text-sm text-gray-500">Distribusi ke bidang</p>
                    </div>
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="h-[300px]">
                    <Bar
                      data={{
                        labels: stats.pengaduanByBidang.map(item => item.bidang),
                        datasets: [{
                          label: 'Jumlah',
                          data: stats.pengaduanByBidang.map(item => item.count),
                          backgroundColor: '#8B5CF6',
                          borderRadius: 8,
                          borderSkipped: false
                        }]
                      }}
                      options={{
                        indexAxis: 'y' as const,
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          },
                          tooltip: {
                            backgroundColor: '#fff',
                            titleColor: '#1f2937',
                            bodyColor: '#6b7280',
                            borderColor: '#e5e7eb',
                            borderWidth: 1,
                            padding: 12
                          }
                        },
                        scales: {
                          x: {
                            beginAtZero: true,
                            ticks: {
                              color: '#6b7280',
                              font: { size: 12 }
                            },
                            grid: {
                              color: '#f3f4f6'
                            }
                          },
                          y: {
                            ticks: {
                              color: '#6b7280',
                              font: { size: 12 }
                            },
                            grid: {
                              display: false
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Tidak ada data statistik</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
