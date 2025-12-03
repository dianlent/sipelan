'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Settings, User, Lock, Bell, Mail, Shield, Database,
  Save, RefreshCw, Eye, EyeOff, Check, AlertCircle, ShieldCheck, Image as ImageIcon, Upload,
  Facebook, Twitter, Instagram, Youtube
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
  recaptcha: {
    site_key: string
    secret_key: string
    enabled: boolean
    score_threshold: number
  }
  app: {
    nama_aplikasi: string
    logo_url: string
    facebook_url: string
    twitter_url: string
    instagram_url: string
    youtube_url: string
  }
}

export default function SettingsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  
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
    },
    recaptcha: {
      site_key: '',
      secret_key: '',
      enabled: false,
      score_threshold: 0.5
    },
    app: {
      nama_aplikasi: 'SIPelan',
      logo_url: '',
      facebook_url: '',
      twitter_url: '',
      instagram_url: '',
      youtube_url: ''
    }
  })

  // Load settings from database
  useEffect(() => {
    const loadAllSettings = async () => {
      try {
        const response = await fetch('/api/settings', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setSettings(prev => ({
              ...prev,
              recaptcha: {
                enabled: data.data.recaptcha_enabled || false,
                site_key: data.data.recaptcha_site_key || '',
                secret_key: data.data.recaptcha_secret_key || '',
                score_threshold: data.data.recaptcha_score_threshold || 0.5
              },
              app: {
                nama_aplikasi: data.data.app_name || 'SIPelan',
                logo_url: data.data.app_logo_url || '',
                facebook_url: data.data.facebook_url || '',
                twitter_url: data.data.twitter_url || '',
                instagram_url: data.data.instagram_url || '',
                youtube_url: data.data.youtube_url || ''
              }
            }))
            
            // Set logo preview if exists
            if (data.data.app_logo_url) {
              setLogoPreview(data.data.app_logo_url)
            }
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }

    if (user && user.role === 'admin') {
      loadAllSettings()
    }
  }, [user])

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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      toast.error('Format file harus JPG, PNG, atau SVG')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB')
      return
    }

    setLogoFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLogoFile(null)
    setLogoPreview('')
  }

  const handleSaveApp = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('app_name', settings.app.nama_aplikasi)
      formData.append('facebook_url', settings.app.facebook_url)
      formData.append('twitter_url', settings.app.twitter_url)
      formData.append('instagram_url', settings.app.instagram_url)
      formData.append('youtube_url', settings.app.youtube_url)
      
      if (logoFile) {
        formData.append('logo', logoFile)
      }

      const response = await fetch('/api/settings/app', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Pengaturan aplikasi berhasil disimpan')
        
        // Update logo URL if uploaded
        if (data.logo_url) {
          setSettings(prev => ({
            ...prev,
            app: {
              ...prev.app,
              logo_url: data.logo_url
            }
          }))
          setLogoPreview(data.logo_url)
          setLogoFile(null)
        }
      } else {
        toast.error(data.message || 'Gagal menyimpan pengaturan')
      }
    } catch (error) {
      console.error('Error saving app settings:', error)
      toast.error('Terjadi kesalahan saat menyimpan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveRecaptcha = async () => {
    setIsLoading(true)
    try {
      // Validate reCAPTCHA keys
      if (settings.recaptcha.enabled) {
        if (!settings.recaptcha.site_key || !settings.recaptcha.secret_key) {
          toast.error('Site Key dan Secret Key harus diisi')
          setIsLoading(false)
          return
        }
        if (settings.recaptcha.score_threshold < 0 || settings.recaptcha.score_threshold > 1) {
          toast.error('Score threshold harus antara 0.0 dan 1.0')
          setIsLoading(false)
          return
        }
      }
      
      // Save to database
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          settings: {
            recaptcha_enabled: settings.recaptcha.enabled,
            recaptcha_site_key: settings.recaptcha.site_key,
            recaptcha_secret_key: settings.recaptcha.secret_key,
            recaptcha_score_threshold: settings.recaptcha.score_threshold
          }
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Pengaturan reCAPTCHA berhasil disimpan')
        toast('reCAPTCHA akan aktif dalam beberapa detik', { icon: 'ℹ️', duration: 3000 })
      } else {
        toast.error(data.message || 'Gagal menyimpan pengaturan')
      }
    } catch (error) {
      console.error('Save reCAPTCHA error:', error)
      toast.error('Gagal menyimpan pengaturan reCAPTCHA')
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'app', label: 'Aplikasi', icon: ImageIcon },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'password', label: 'Keamanan', icon: Lock },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'system', label: 'Sistem', icon: Database },
    { id: 'recaptcha', label: 'reCAPTCHA', icon: ShieldCheck }
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

            {/* App Tab */}
            {activeTab === 'app' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-8"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Pengaturan Aplikasi</h3>
                  <p className="text-sm text-gray-600">Kelola logo dan nama aplikasi yang ditampilkan di homepage</p>
                </div>

                <div className="space-y-6">
                  {/* Nama Aplikasi */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Aplikasi
                    </label>
                    <input
                      type="text"
                      value={settings.app.nama_aplikasi}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        app: { ...prev.app, nama_aplikasi: e.target.value }
                      }))}
                      placeholder="SIPelan"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Nama aplikasi akan ditampilkan di header homepage</p>
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Logo Aplikasi
                    </label>
                    
                    {/* Logo Preview */}
                    {logoPreview ? (
                      <div className="mb-4">
                        <div className="relative inline-block">
                          <img 
                            src={logoPreview} 
                            alt="Logo Preview" 
                            className="w-32 h-32 object-contain border-2 border-gray-200 rounded-lg p-2 bg-white"
                          />
                          <button
                            onClick={handleRemoveLogo}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Klik × untuk menghapus logo</p>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Belum ada logo</p>
                      </div>
                    )}

                    {/* Upload Button */}
                    <div>
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm font-medium">Upload Logo</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG, SVG (Max 2MB)</p>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-md font-semibold text-gray-800 mb-4">Link Sosial Media</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Facebook */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <Facebook className="w-4 h-4 text-blue-600" />
                            <span>Facebook</span>
                          </div>
                        </label>
                        <input
                          type="url"
                          value={settings.app.facebook_url}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            app: { ...prev.app, facebook_url: e.target.value }
                          }))}
                          placeholder="https://facebook.com/..."
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>

                      {/* Twitter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <Twitter className="w-4 h-4 text-sky-500" />
                            <span>Twitter / X</span>
                          </div>
                        </label>
                        <input
                          type="url"
                          value={settings.app.twitter_url}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            app: { ...prev.app, twitter_url: e.target.value }
                          }))}
                          placeholder="https://twitter.com/..."
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>

                      {/* Instagram */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <Instagram className="w-4 h-4 text-pink-600" />
                            <span>Instagram</span>
                          </div>
                        </label>
                        <input
                          type="url"
                          value={settings.app.instagram_url}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            app: { ...prev.app, instagram_url: e.target.value }
                          }))}
                          placeholder="https://instagram.com/..."
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>

                      {/* Youtube */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <Youtube className="w-4 h-4 text-red-600" />
                            <span>Youtube</span>
                          </div>
                        </label>
                        <input
                          type="url"
                          value={settings.app.youtube_url}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            app: { ...prev.app, youtube_url: e.target.value }
                          }))}
                          placeholder="https://youtube.com/..."
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Kosongkan jika tidak ingin menampilkan link sosial media</p>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSaveApp}
                      disabled={isLoading}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                </div>
              </motion.div>
            )}

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

            {/* reCAPTCHA Tab */}
            {activeTab === 'recaptcha' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-8"
              >
                <div className="flex items-start space-x-3 mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900">Google reCAPTCHA v3</h4>
                    <p className="text-sm text-green-700">Lindungi formulir pengaduan dari spam dan bot dengan reCAPTCHA v3</p>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-6">Konfigurasi reCAPTCHA v3</h3>
                
                <div className="space-y-6">
                  {/* Enable/Disable Toggle */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Aktifkan reCAPTCHA</h4>
                      <p className="text-sm text-gray-500">Aktifkan atau nonaktifkan perlindungan reCAPTCHA pada formulir</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.recaptcha.enabled}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          recaptcha: { ...prev.recaptcha, enabled: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Site Key */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Site Key (Public Key)
                    </label>
                    <input
                      type="text"
                      value={settings.recaptcha.site_key}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        recaptcha: { ...prev.recaptcha, site_key: e.target.value }
                      }))}
                      placeholder="6L..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      disabled={!settings.recaptcha.enabled}
                    />
                    <p className="text-xs text-gray-500 mt-1">Kunci publik yang digunakan di frontend (NEXT_PUBLIC_RECAPTCHA_SITE_KEY)</p>
                  </div>

                  {/* Secret Key */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Secret Key (Private Key)
                    </label>
                    <input
                      type="password"
                      value={settings.recaptcha.secret_key}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        recaptcha: { ...prev.recaptcha, secret_key: e.target.value }
                      }))}
                      placeholder="6L..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      disabled={!settings.recaptcha.enabled}
                    />
                    <p className="text-xs text-gray-500 mt-1">Kunci rahasia yang digunakan di backend (RECAPTCHA_SECRET_KEY)</p>
                  </div>

                  {/* Score Threshold */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Score Threshold
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.recaptcha.score_threshold}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          recaptcha: { ...prev.recaptcha, score_threshold: parseFloat(e.target.value) }
                        }))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        disabled={!settings.recaptcha.enabled}
                      />
                      <span className="text-lg font-bold text-blue-600 w-12 text-center">
                        {settings.recaptcha.score_threshold.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>0.0 (Lenient)</span>
                      <span>0.5 (Balanced)</span>
                      <span>1.0 (Strict)</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Skor minimum untuk diterima. Semakin tinggi semakin ketat (0.5 direkomendasikan)
                    </p>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-2">Cara Mendapatkan Keys:</p>
                        <ol className="list-decimal list-inside space-y-1 text-blue-800">
                          <li>Kunjungi <a href="https://www.google.com/recaptcha/admin/create" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Google reCAPTCHA Admin</a></li>
                          <li>Pilih reCAPTCHA v3 dan daftarkan domain Anda</li>
                          <li>Salin Site Key dan Secret Key</li>
                          <li>Masukkan keys di atas dan simpan</li>
                          <li>Restart aplikasi untuk menerapkan perubahan</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <button
                      onClick={handleSaveRecaptcha}
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
                          <span>Simpan Konfigurasi reCAPTCHA</span>
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
