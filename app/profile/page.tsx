'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  User,
  Mail,
  Building,
  Shield,
  Calendar,
  Edit,
  Key,
  Bell,
  Settings
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import Footer from '@/components/Footer'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
      return
    }
  }, [user, authLoading, isAuthenticated, router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={user.role === 'admin' ? '/admin' : user.role === 'bidang' ? '/bidang' : '/'}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Kembali</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Profil Saya</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-purple-100"
        >
          {/* Cover Image with Pattern */}
          <div className="h-48 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32 blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-48 translate-y-48 blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-yellow-400/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-6 -mt-16">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center border-4 border-white">
                  <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-16 h-16 text-white" />
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white hover:shadow-xl transition-all shadow-lg">
                  <Edit className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              <div className="mt-6 md:mt-0 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">{user.nama_lengkap}</h2>
                    <p className="text-gray-600 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {user.email}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all flex items-center space-x-2 shadow-lg">
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg">
                    {user.role === 'admin' ? '👑 Administrator' : user.role === 'bidang' ? '📋 Bidang' : '👤 Masyarakat'}
                  </span>
                  {user.kode_bidang && (
                    <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-semibold shadow-lg">
                      🏢 {user.kode_bidang}
                    </span>
                  )}
                  <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-semibold shadow-lg">
                    ✓ Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-lg">Role</span>
            </div>
            <h3 className="text-3xl font-bold mb-1 capitalize">{user.role}</h3>
            <p className="text-purple-100 text-sm">Hak akses sistem</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Building className="w-6 h-6" />
              </div>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-lg">Bidang</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{user.kode_bidang || '-'}</h3>
            <p className="text-blue-100 text-sm">Unit kerja</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-lg">Status</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">Aktif</h3>
            <p className="text-pink-100 text-sm">Akun terverifikasi</p>
          </motion.div>
        </div>

        {/* 2 Column Layout: 33% Left, 66% Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - 33% */}
          <div className="lg:col-span-1 space-y-6">
            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100 hover:border-purple-300 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  Info Personal
                </h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                  <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Nama Lengkap</label>
                  <p className="font-bold text-gray-900 mt-1">{user.nama_lengkap}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Username</label>
                  <p className="font-bold text-gray-900 mt-1">@{user.username}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email</label>
                  <p className="font-bold text-gray-900 flex items-center mt-1">
                    <Mail className="w-4 h-4 mr-2 text-purple-500" />
                    {user.email}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Role & Bidang Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100 hover:border-blue-300 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  Role & Akses
                </h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Role</label>
                  <p className="font-bold text-gray-900 capitalize mt-1">{user.role}</p>
                </div>
                {user.kode_bidang && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Kode Bidang</label>
                    <p className="font-bold text-gray-900 flex items-center mt-1">
                      <Building className="w-4 h-4 mr-2 text-blue-500" />
                      {user.kode_bidang}
                    </p>
                  </div>
                )}
                {user.bidang_id && (
                  <div className="p-4 bg-gradient-to-r from-pink-50 to-blue-50 rounded-xl">
                    <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Bidang ID</label>
                    <p className="font-bold text-gray-900 mt-1">#{user.bidang_id}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Content - 66% */}
          <div className="lg:col-span-2">
            {/* Action Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-3">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  Pengaturan Akun
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/profile/edit">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all group"
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                      <Edit className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-lg">Edit Profil</span>
                    <span className="text-sm text-purple-100 mt-2">Ubah informasi pribadi</span>
                  </motion.button>
                </Link>

                <Link href="/profile/change-password">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all group"
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                      <Key className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-lg">Ganti Password</span>
                    <span className="text-sm text-blue-100 mt-2">Keamanan akun Anda</span>
                  </motion.button>
                </Link>

                <motion.button 
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all group"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                    <Bell className="w-8 h-8" />
                  </div>
                  <span className="font-bold text-lg">Notifikasi</span>
                  <span className="text-sm text-pink-100 mt-2">Atur preferensi notif</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
