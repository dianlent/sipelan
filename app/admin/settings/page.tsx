'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Settings, User, Lock, Bell, Mail, Shield, Database,
  Save, RefreshCw, Eye, EyeOff, Check, AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import AdminSidebar from '@/components/AdminSidebar'

interface SettingsData {
  profile: {
    nama_lengkap: string
    email: string
    username: string
  }
  password: {
    current_password: string
    new_password: string
    confirm_password: string
  }
  notifications: {
    email_pengaduan_baru: boolean
    email_status_update: boolean
    email_disposisi: boolean
  }
  system: {
    smtp_host: string
    smtp_port: string
    smtp_user: string
    smtp_pass: string
  }
}

export default function SettingsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  
  const [settings, setSettings] = useState<SettingsData>({
    profile: {
      nama_lengkap: '',
      email: '',
      username: ''
    },
    password: {
      current_password: '',
      new_password: '',
      confirm_password: ''
    },
    notifications: {
      email_pengaduan_baru: true,
      email_status_update: true,
      email_disposisi: true
    },
    system: {
      smtp_host: '',
      smtp_port: '587',
      smtp_user: '',
      smtp_pass: ''
    }
  })

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    loadSettings()
  }, [user, authLoading, isAuthenticated, router])

  const loadSettings = () => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        profile: {
          nama_lengkap: user.nama_lengkap || '',
          email: user.email || '',
          username: user.username || ''
        }
      }))
    }
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Profil berhasil diperbarui')
    } catch (error) {
      toast.error('Gagal memperbarui profil')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (settings.password.new_password !== settings.password.confirm_password) {
      toast.error('Password baru tidak cocok')
      return
    }
    
    if (settings.password.new_password.length < 6) {
      toast.error('Password minimal 6 karakter')
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Password berhasil diubah')
      setSettings(prev => ({
        ...prev,
        password: {
          current_password: '',
          new_password: '',
          confirm_password: ''
        }
      }))
    } catch (error) {
      toast.error('Gagal mengubah password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Pengaturan notifikasi berhasil disimpan')
    } catch (error) {
      toast.error('Gagal menyimpan pengaturan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSystem = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Pengaturan sistem berhasil disimpan')
    } catch (error) {
      toast.error('Gagal menyimpan pengaturan')
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'password', label: 'Keamanan', icon: Lock },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'system', label: 'Sistem', icon: Database }
  ]

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
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pengaturan</h2>
                <p className="text-sm text-gray-500">Kelola pengaturan akun dan sistem</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
              <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-8"
              >
                <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user.nama_lengkap?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{user.nama_lengkap}</h3>
                    <p className="text-gray-500">{user.email}</p>
                    <span className="inline-flex px-3 py-1 mt-2 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                      Administrator
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={settings.profile.nama_lengkap}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, nama_lengkap: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, email: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={settings.profile.username}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, username: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Simpan Perubahan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-8"
              >
                <div className="flex items-start space-x-3 mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900">Keamanan Akun</h4>
                    <p className="text-sm text-amber-700">Gunakan password yang kuat dengan minimal 6 karakter</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password Saat Ini
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={settings.password.current_password}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          password: { ...prev.password, current_password: e.target.value }
                        }))}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={settings.password.new_password}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          password: { ...prev.password, new_password: e.target.value }
                        }))}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      value={settings.password.confirm_password}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        password: { ...prev.password, confirm_password: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Mengubah...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          <span>Ubah Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-8"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-6">Pengaturan Notifikasi Email</h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'email_pengaduan_baru', label: 'Pengaduan Baru', desc: 'Terima email saat ada pengaduan baru masuk' },
                    { key: 'email_status_update', label: 'Update Status', desc: 'Terima email saat status pengaduan berubah' },
                    { key: 'email_disposisi', label: 'Disposisi', desc: 'Terima email saat pengaduan didisposisikan' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.label}</h4>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, [item.key]: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <button
                    onClick={handleSaveNotifications}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Simpan Pengaturan</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-8"
              >
                <div className="flex items-start space-x-3 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900">Pengaturan Sistem</h4>
                    <p className="text-sm text-red-700">Hanya admin yang dapat mengubah pengaturan ini</p>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-6">Konfigurasi SMTP Email</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        value={settings.system.smtp_host}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          system: { ...prev.system, smtp_host: e.target.value }
                        }))}
                        placeholder="smtp.gmail.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        SMTP Port
                      </label>
                      <input
                        type="text"
                        value={settings.system.smtp_port}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          system: { ...prev.system, smtp_port: e.target.value }
                        }))}
                        placeholder="587"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      SMTP User (Email)
                    </label>
                    <input
                      type="email"
                      value={settings.system.smtp_user}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        system: { ...prev.system, smtp_user: e.target.value }
                      }))}
                      placeholder="your-email@gmail.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      SMTP Password
                    </label>
                    <input
                      type="password"
                      value={settings.system.smtp_pass}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        system: { ...prev.system, smtp_pass: e.target.value }
                      }))}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleSaveSystem}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Simpan Konfigurasi</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
