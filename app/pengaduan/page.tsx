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
  Phone
} from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  id: string
  username: string
  email: string
  nama_lengkap: string
  role: string
}

interface Category {
  id: number
  nama_kategori: string
  deskripsi: string
}

export default function PengaduanPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
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
    no_telepon: ''
  })

  useEffect(() => {
    // Load categories - no authentication required
    loadCategories()
    
    // Optional: Load user data if logged in
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const loadCategories = async () => {
    try {
      // TODO: Fetch from API
      // Temporary mock data
      setCategories([
        { id: 1, nama_kategori: 'Pengupahan', deskripsi: 'Masalah gaji, upah minimum, tunjangan' },
        { id: 2, nama_kategori: 'Ketenagakerjaan', deskripsi: 'PHK, kontrak kerja, jam kerja' },
        { id: 3, nama_kategori: 'K3', deskripsi: 'Keselamatan dan kesehatan kerja' },
        { id: 4, nama_kategori: 'Pelatihan Kerja', deskripsi: 'Program pelatihan dan penempatan' },
        { id: 5, nama_kategori: 'Lainnya', deskripsi: 'Pengaduan lainnya' }
      ])
    } catch (error) {
      console.error('Error loading categories:', error)
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
      if (formData.file_bukti) {
        submitData.append('file_bukti', formData.file_bukti)
      }

      // TODO: Send to API
      // const response = await fetch('/api/pengaduan', {
      //   method: 'POST',
      //   body: submitData
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generate mock tracking code
      const year = new Date().getFullYear()
      const randomNum = Math.floor(Math.random() * 9999) + 1
      const generatedCode = `ADU-${year}-${String(randomNum).padStart(4, '0')}`
      
      setKodeTracking(generatedCode)
      setShowSuccessModal(true)
      
      // Save to localStorage for tracking
      const savedCodes = JSON.parse(localStorage.getItem('myPengaduan') || '[]')
      savedCodes.push({
        kode: generatedCode,
        judul: formData.judul_pengaduan,
        tanggal: new Date().toISOString()
      })
      localStorage.setItem('myPengaduan', JSON.stringify(savedCodes))
      
      toast.success('Pengaduan berhasil diajukan!')
    } catch (error) {
      toast.error('Gagal mengajukan pengaduan')
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
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Kembali</span>
            </Link>
            {user && (
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{user.nama_lengkap}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
    </div>
  )
}
