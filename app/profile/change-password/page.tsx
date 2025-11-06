'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Key,
  Eye,
  EyeOff,
  Lock,
  Shield,
  CheckCircle,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import Footer from '@/components/Footer'

export default function ChangePasswordPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
      return
    }
  }, [user, authLoading, isAuthenticated, router])

  useEffect(() => {
    // Calculate password strength
    const password = formData.newPassword
    let strength = 0
    
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    
    setPasswordStrength(strength)
  }, [formData.newPassword])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    })
  }

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500'
    if (passwordStrength <= 3) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Lemah'
    if (passwordStrength <= 3) return 'Sedang'
    return 'Kuat'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Password baru dan konfirmasi tidak cocok')
      return
    }

    if (formData.newPassword.length < 8) {
      toast.error('Password minimal 8 karakter')
      return
    }

    if (passwordStrength < 3) {
      toast.error('Password terlalu lemah. Gunakan kombinasi huruf besar, kecil, angka, dan simbol')
      return
    }

    setIsLoading(true)

    try {
      // TODO: Implement API call to change password
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      toast.success('Password berhasil diubah!')
      router.push('/profile')
    } catch (error) {
      toast.error('Gagal mengubah password')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
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
              href="/profile"
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Kembali</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Ganti Password</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Icon */}
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-sm">
              <Key className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mt-4">Keamanan Akun</h2>
            <p className="text-purple-100 mt-2">Ubah password Anda secara berkala untuk keamanan</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password Saat Ini
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    placeholder="Masukkan password saat ini"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Key className="w-4 h-4 inline mr-2" />
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    placeholder="Masukkan password baru"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">Kekuatan Password:</span>
                      <span className={`text-xs font-bold ${
                        passwordStrength <= 1 ? 'text-red-600' : 
                        passwordStrength <= 3 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    placeholder="Konfirmasi password baru"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <p className="text-xs text-red-600 mt-2 flex items-center">
                    <X className="w-3 h-3 mr-1" />
                    Password tidak cocok
                  </p>
                )}
                {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                  <p className="text-xs text-green-600 mt-2 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Password cocok
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Persyaratan Password:</h4>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className={`flex items-center ${formData.newPassword.length >= 8 ? 'text-green-600' : ''}`}>
                    <CheckCircle className={`w-3 h-3 mr-2 ${formData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} />
                    Minimal 8 karakter
                  </li>
                  <li className={`flex items-center ${/[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword) ? 'text-green-600' : ''}`}>
                    <CheckCircle className={`w-3 h-3 mr-2 ${/[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}`} />
                    Kombinasi huruf besar dan kecil
                  </li>
                  <li className={`flex items-center ${/[0-9]/.test(formData.newPassword) ? 'text-green-600' : ''}`}>
                    <CheckCircle className={`w-3 h-3 mr-2 ${/[0-9]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}`} />
                    Mengandung angka
                  </li>
                  <li className={`flex items-center ${/[^a-zA-Z0-9]/.test(formData.newPassword) ? 'text-green-600' : ''}`}>
                    <CheckCircle className={`w-3 h-3 mr-2 ${/[^a-zA-Z0-9]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}`} />
                    Mengandung karakter khusus (!@#$%^&*)
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isLoading || formData.newPassword !== formData.confirmPassword || passwordStrength < 3}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Mengubah Password...</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-5 h-5" />
                      <span>Ubah Password</span>
                    </>
                  )}
                </button>
                <Link
                  href="/profile"
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
                >
                  <X className="w-5 h-5" />
                  <span>Batal</span>
                </Link>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Security Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-purple-600" />
            Tips Keamanan
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span>Jangan gunakan password yang sama dengan akun lain</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span>Ubah password secara berkala (minimal 3 bulan sekali)</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span>Jangan bagikan password kepada siapapun</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span>Gunakan kombinasi yang sulit ditebak</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
