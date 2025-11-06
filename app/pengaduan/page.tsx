'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  FileText,
  Upload,
  Send,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Phone,
  ClipboardCheck,
  ArrowRight,
  Search,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Users,
  ClipboardList,
  Clock
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

interface Category {
  id: number
  nama_kategori: string
  deskripsi: string
}

export default function PengaduanPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [kodeTracking, setKodeTracking] = useState('')
  const [formData, setFormData] = useState({
    kategori_id: '',
    judul_pengaduan: '',
    isi_pengaduan: '',
    lokasi_kejadian: '',
    tanggal_kejadian: '',
    file_bukti: null as File | null,
    nama_pelapor: '',
    email_pelapor: '',
    no_telepon: '',
    anonim: false
  })

  useEffect(() => {
    // Load categories - no authentication required
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const result = await response.json()
      
      if (result.success && result.data) {
        setCategories(result.data)
      } else {
        console.error('Failed to load categories:', result.message)
        toast.error('Gagal memuat kategori')
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Gagal memuat kategori')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 10MB')
        return
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Format file tidak didukung. Gunakan JPG, PNG, GIF, PDF, atau DOC')
        return
      }

      setFormData({ ...formData, file_bukti: file })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('=== FORM SUBMISSION START ===')
      console.log('Form Data:', formData)

      // Validation
      if (!formData.kategori_id) {
        toast.error('Pilih kategori pengaduan')
        setIsLoading(false)
        return
      }
      if (!formData.judul_pengaduan.trim()) {
        toast.error('Judul pengaduan harus diisi')
        setIsLoading(false)
        return
      }
      if (!formData.isi_pengaduan.trim()) {
        toast.error('Isi pengaduan harus diisi')
        setIsLoading(false)
        return
      }
      if (!formData.nama_pelapor.trim()) {
        toast.error('Nama pelapor harus diisi')
        setIsLoading(false)
        return
      }
      if (!formData.email_pelapor.trim()) {
        toast.error('Email pelapor harus diisi')
        setIsLoading(false)
        return
      }
      if (!formData.no_telepon.trim()) {
        toast.error('No telepon harus diisi')
        setIsLoading(false)
        return
      }

      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append('kategori_id', formData.kategori_id)
      submitData.append('judul_pengaduan', formData.judul_pengaduan)
      submitData.append('isi_pengaduan', formData.isi_pengaduan)
      submitData.append('lokasi_kejadian', formData.lokasi_kejadian)
      submitData.append('tanggal_kejadian', formData.tanggal_kejadian)
      submitData.append('nama_pelapor', formData.nama_pelapor)
      submitData.append('email_pelapor', formData.email_pelapor)
      submitData.append('no_telepon', formData.no_telepon)
      submitData.append('anonim', formData.anonim ? 'true' : 'false')
      if (formData.file_bukti) {
        submitData.append('file_bukti', formData.file_bukti)
      }

      console.log('✅ Form validation passed')
      console.log('Submit Data:', Object.fromEntries(submitData))

      // Send to API
      console.log('📤 Submitting to API...')
      const response = await fetch('/api/pengaduan', {
        method: 'POST',
        body: submitData
      })

      const result = await response.json()
      console.log('📥 API Response:', result)

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal menyimpan pengaduan')
      }

      // Success!
      const generatedCode = result.data.kode_pengaduan
      console.log('✅ Pengaduan berhasil disimpan dengan kode:', generatedCode)
      
      setKodeTracking(generatedCode)
      setShowSuccessModal(true)
      toast.success('Pengaduan berhasil disimpan ke database!')
      
      // Reset form after successful submission
      setFormData({
        kategori_id: '',
        judul_pengaduan: '',
        isi_pengaduan: '',
        lokasi_kejadian: '',
        tanggal_kejadian: '',
        file_bukti: null,
        nama_pelapor: '',
        email_pelapor: '',
        no_telepon: '',
        anonim: false
      })
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengajukan pengaduan. Silakan coba lagi.')
      console.error('Submit error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Pengaduan Berhasil Dikirim!
              </h2>
              <p className="text-gray-600 mb-6">
                Simpan kode tracking ini untuk melacak status pengaduan Anda
              </p>
              
              <div className="bg-gradient-primary p-6 rounded-2xl mb-6">
                <p className="text-white/80 text-sm mb-2">Kode Tracking Anda:</p>
                <p className="text-3xl font-bold font-mono text-white tracking-wider">
                  {kodeTracking}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm text-blue-900">
                  <strong>Catatan:</strong> Kode tracking juga telah dikirim ke email Anda. 
                  Gunakan kode ini untuk melacak status pengaduan.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href={`/tracking?kode=${kodeTracking}`}
                  className="block w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Lacak Pengaduan
                </Link>
                <button
                  onClick={() => {
                    setShowSuccessModal(false)
                    router.push('/')
                  }}
                  className="block w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-xl z-50 border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                  <ClipboardCheck className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </motion.div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  SIPelan
                </span>
                <p className="text-xs text-gray-500 -mt-1">Pengaduan Online</p>
              </div>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link 
                href="/" 
                className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors rounded-xl hover:bg-purple-50"
              >
                <span>Beranda</span>
              </Link>
              <Link 
                href="/pengaduan" 
                className="px-4 py-2 text-purple-600 font-medium transition-colors rounded-xl bg-purple-50 flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Buat Pengaduan</span>
              </Link>
              <Link 
                href="/tracking" 
                className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors rounded-xl hover:bg-purple-50 flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Tracking</span>
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              {isAuthenticated && user ? (
                <>
                  <div className="hidden md:flex items-center space-x-2 text-sm">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {user.nama_lengkap.charAt(0)}
                    </div>
                    <span className="font-semibold text-gray-900">{user.nama_lengkap}</span>
                  </div>
                  <Link 
                    href={user.role === 'admin' ? '/admin' : user.role === 'bidang' ? '/bidang' : '/dashboard'}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    <span>Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="hidden md:flex items-center space-x-2 px-5 py-2.5 text-gray-700 hover:text-purple-600 font-semibold transition-all rounded-xl hover:bg-gray-100"
                  >
                    <User className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link 
                    href="/tracking" 
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    <span>Lacak Status</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat Pengaduan Baru</h1>
          <p className="text-gray-600">Isi formulir di bawah ini untuk mengajukan pengaduan</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Data Pelapor */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Pelapor</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="nama_pelapor" className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nama_pelapor"
                    value={formData.nama_pelapor}
                    onChange={(e) => setFormData({ ...formData, nama_pelapor: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none bg-white"
                    placeholder="Nama Anda"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email_pelapor" className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email_pelapor"
                    value={formData.email_pelapor}
                    onChange={(e) => setFormData({ ...formData, email_pelapor: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none bg-white"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="no_telepon" className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    No. Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="no_telepon"
                    value={formData.no_telepon}
                    onChange={(e) => setFormData({ ...formData, no_telepon: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none bg-white"
                    placeholder="08xxxxxxxxxx"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Opsi Anonim */}
            <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4">
              <input
                id="anonim"
                type="checkbox"
                checked={formData.anonim}
                onChange={(e) => setFormData({ ...formData, anonim: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="anonim" className="text-sm text-gray-700">
                <span className="font-semibold">Ajukan sebagai Anonim</span>
                <span className="block text-gray-600 mt-1">Nama lengkap dan email Anda tidak akan ditampilkan di tampilan publik. Kami tetap menyimpannya untuk keperluan verifikasi dan komunikasi jika diperlukan.</span>
              </label>
            </div>

            {/* Kategori */}
            <div>
              <label htmlFor="kategori" className="block text-sm font-semibold text-gray-700 mb-2">
                Kategori Pengaduan <span className="text-red-500">*</span>
              </label>
              <select
                id="kategori"
                value={formData.kategori_id}
                onChange={(e) => setFormData({ ...formData, kategori_id: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nama_kategori} - {cat.deskripsi}
                  </option>
                ))}
              </select>
            </div>

            {/* Judul */}
            <div>
              <label htmlFor="judul" className="block text-sm font-semibold text-gray-700 mb-2">
                Judul Pengaduan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="judul"
                value={formData.judul_pengaduan}
                onChange={(e) => setFormData({ ...formData, judul_pengaduan: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
                placeholder="Contoh: Upah tidak dibayar sesuai UMR"
                required
                maxLength={255}
              />
            </div>

            {/* Isi Pengaduan */}
            <div>
              <label htmlFor="isi" className="block text-sm font-semibold text-gray-700 mb-2">
                Isi Pengaduan <span className="text-red-500">*</span>
              </label>
              <textarea
                id="isi"
                value={formData.isi_pengaduan}
                onChange={(e) => setFormData({ ...formData, isi_pengaduan: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none min-h-[150px]"
                placeholder="Jelaskan detail pengaduan Anda..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Jelaskan kronologi kejadian secara detail
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Lokasi */}
              <div>
                <label htmlFor="lokasi" className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Lokasi Kejadian
                </label>
                <input
                  type="text"
                  id="lokasi"
                  value={formData.lokasi_kejadian}
                  onChange={(e) => setFormData({ ...formData, lokasi_kejadian: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
                  placeholder="Contoh: PT ABC, Jl. Sudirman No. 123"
                />
              </div>

              {/* Tanggal */}
              <div>
                <label htmlFor="tanggal" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Tanggal Kejadian
                </label>
                <input
                  type="date"
                  id="tanggal"
                  value={formData.tanggal_kejadian}
                  onChange={(e) => setFormData({ ...formData, tanggal_kejadian: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="file" className="block text-sm font-semibold text-gray-700 mb-2">
                <Upload className="w-4 h-4 inline mr-1" />
                Upload Bukti (Opsional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                />
                <label htmlFor="file" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  {formData.file_bukti ? (
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formData.file_bukti.name}</p>
                      <p className="text-xs text-gray-500">{(formData.file_bukti.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Klik untuk upload file
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG, GIF, PDF, DOC (Max 10MB)
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Informasi Penting:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Pengaduan akan diproses maksimal 3x24 jam</li>
                  <li>Anda akan menerima kode tracking via email</li>
                  <li>Pastikan data yang diisi sudah benar</li>
                </ul>
              </div>
            </div>

            {/* Debug Buttons (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold text-yellow-800 mb-2">Debug Tools:</p>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Current formData:', formData)
                      console.log('localStorage allPengaduan:', JSON.parse(localStorage.getItem('allPengaduan') || '{}'))
                      console.log('localStorage myPengaduan:', JSON.parse(localStorage.getItem('myPengaduan') || '[]'))
                    }}
                    className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                  >
                    Debug Console
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        kategori_id: '1',
                        judul_pengaduan: 'Test Pengaduan - Upah Tidak Dibayar',
                        isi_pengaduan: 'Ini adalah pengaduan test untuk debugging. Perusahaan tidak membayar upah sesuai UMR.',
                        lokasi_kejadian: 'PT Contoh, Jakarta',
                        tanggal_kejadian: '2024-11-01',
                        file_bukti: null,
                        nama_pelapor: 'Test User',
                        email_pelapor: 'test@example.com',
                        no_telepon: '08123456789',
                        anonim: false
                      })
                      toast.success('Form diisi dengan data test')
                    }}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  >
                    Isi Test Data
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center space-x-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-primary text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Kirim Pengaduan</span>
                  </>
                )}
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Batal
              </Link>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
        {/* Main Footer */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <ClipboardCheck className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold">SIPelan</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Sistem Pengaduan Layanan Online Naker - Melayani pengaduan masyarakat terkait ketenagakerjaan dengan cepat dan transparan.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Menu Cepat</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    <span>Beranda</span>
                  </Link>
                </li>
                <li>
                  <Link href="/pengaduan" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    <span>Buat Pengaduan</span>
                  </Link>
                </li>
                <li>
                  <Link href="/tracking" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    <span>Tracking Pengaduan</span>
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    <span>Login</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Layanan */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Layanan Kami</h3>
              <ul className="space-y-3">
                <li className="text-gray-400 flex items-start space-x-2">
                  <ClipboardList className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Pengaduan Ketenagakerjaan</span>
                </li>
                <li className="text-gray-400 flex items-start space-x-2">
                  <Users className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Konsultasi Hubungan Industrial</span>
                </li>
                <li className="text-gray-400 flex items-start space-x-2">
                  <FileText className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Informasi Peraturan Ketenagakerjaan</span>
                </li>
                <li className="text-gray-400 flex items-start space-x-2">
                  <Clock className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Tracking Status Real-time</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Hubungi Kami</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                  <span>Jl. Disnaker No. 123<br />Jakarta Pusat, DKI Jakarta<br />10110</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <Phone className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <span>(021) 1234-5678</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <Mail className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <span>info@disnaker.go.id</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-sm text-gray-400 mb-2">Jam Layanan:</p>
                <p className="text-white font-semibold">Senin - Jumat</p>
                <p className="text-gray-400 text-sm">08:00 - 16:00 WIB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm text-center md:text-left">
                &copy; 2024 Dinas Ketenagakerjaan. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Kebijakan Privasi
                </a>
                <span className="text-gray-600">|</span>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Syarat & Ketentuan
                </a>
                <span className="text-gray-600">|</span>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
