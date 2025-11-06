'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  MapPin,
  Calendar,
  User as UserIcon,
  Building,
  Send,
  RefreshCw,
  ClipboardCheck,
  ArrowRight,
  Phone,
  Mail,
  MapPin as MapPinIcon,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Users,
  ClipboardList
} from 'lucide-react'
import toast from 'react-hot-toast'
import PengaduanTimeline from '@/components/PengaduanTimeline'
import { useAuth } from '@/contexts/AuthContext'

interface PengaduanDetail {
  id: string
  kode_pengaduan: string
  judul_pengaduan: string
  isi_pengaduan: string
  kategori: string
  status: 'masuk' | 'terverifikasi' | 'terdisposisi' | 'tindak_lanjut' | 'selesai' | 'diterima' | 'di proses'
  lokasi_kejadian?: string
  tanggal_kejadian?: string
  file_bukti?: string
  created_at: string
  user: {
    nama_lengkap: string
    email: string
  }
  bidang?: {
    nama_bidang: string
  }
  timeline: Array<{
    status: string
    keterangan: string
    created_at: string
  }>
}

function TrackingContent() {
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const [kodeTracking, setKodeTracking] = useState(searchParams.get('kode') || '')
  const [pengaduan, setPengaduan] = useState<PengaduanDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (searchParams.get('kode')) {
      handleSearch()
    }
  }, [])

  const handleSearch = async () => {
    if (!kodeTracking.trim()) {
      toast.error('Masukkan kode tracking')
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      console.log('🔍 Searching for:', kodeTracking.toUpperCase())
      
      // Fetch from API
      const response = await fetch(`/api/pengaduan/tracking/${kodeTracking.toUpperCase()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (response.ok && data.success && data.data) {
        console.log('✅ Pengaduan found:', data.data)
        setPengaduan(data.data)
        toast.success('Pengaduan ditemukan!')
      } else if (response.status === 404) {
        console.log('❌ Pengaduan not found')
        toast.error('Pengaduan tidak ditemukan')
        setPengaduan(null)
      } else {
        throw new Error(data.message || 'Gagal mengambil data pengaduan')
      }
    } catch (error: any) {
      console.error('Error searching pengaduan:', error)
      toast.error(error.message || 'Terjadi kesalahan saat mencari pengaduan')
      setPengaduan(null)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'masuk':
        return 'text-blue-600 bg-blue-100'
      case 'terverifikasi':
        return 'text-green-600 bg-green-100'
      case 'terdisposisi':
        return 'text-purple-600 bg-purple-100'
      case 'tindak_lanjut':
        return 'text-orange-600 bg-orange-100'
      case 'selesai':
        return 'text-emerald-600 bg-emerald-100'
      // Legacy support
      case 'diterima':
        return 'text-green-600 bg-green-100'
      case 'di proses':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'masuk':
        return <FileText className="w-6 h-6" />
      case 'terverifikasi':
        return <CheckCircle className="w-6 h-6" />
      case 'terdisposisi':
        return <Send className="w-6 h-6" />
      case 'tindak_lanjut':
        return <RefreshCw className="w-6 h-6" />
      case 'selesai':
        return <CheckCircle className="w-6 h-6" />
      // Legacy support
      case 'diterima':
        return <AlertCircle className="w-6 h-6" />
      case 'di proses':
        return <Clock className="w-6 h-6" />
      default:
        return <FileText className="w-6 h-6" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'masuk':
        return 'Pengaduan Masuk'
      case 'terverifikasi':
        return 'Terverifikasi'
      case 'terdisposisi':
        return 'Terdisposisi'
      case 'tindak_lanjut':
        return 'Tindak Lanjut'
      case 'selesai':
        return 'Selesai'
      // Legacy support
      case 'diterima':
        return 'Diterima'
      case 'di proses':
        return 'Di Proses'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
                className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors rounded-xl hover:bg-purple-50 flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Buat Pengaduan</span>
              </Link>
              <Link 
                href="/tracking" 
                className="px-4 py-2 text-purple-600 font-medium transition-colors rounded-xl bg-purple-50 flex items-center space-x-2"
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
                    <UserIcon className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link 
                    href="/pengaduan" 
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    <span>Ajukan Pengaduan</span>
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tracking Pengaduan</h1>
          <p className="text-gray-600">Lacak status pengaduan Anda dengan kode tracking</p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={kodeTracking}
                onChange={(e) => setKodeTracking(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Masukkan kode tracking (contoh: ADU-2024-0001)"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-lg font-mono"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-primary text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Cari'
              )}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Kode tracking dikirimkan ke email Anda saat pengaduan dibuat
          </p>
        </motion.div>

        {/* Result */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : pengaduan ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Kode Tracking</p>
                  <p className="text-2xl font-bold font-mono text-primary-600">
                    {pengaduan.kode_pengaduan}
                  </p>
                </div>
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${getStatusColor(pengaduan.timeline.length > 0 ? pengaduan.timeline[pengaduan.timeline.length - 1].status : pengaduan.status)}`}>
                  {getStatusIcon(pengaduan.timeline.length > 0 ? pengaduan.timeline[pengaduan.timeline.length - 1].status : pengaduan.status)}
                  <span className="font-semibold">{getStatusLabel(pengaduan.timeline.length > 0 ? pengaduan.timeline[pengaduan.timeline.length - 1].status : pengaduan.status)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {pengaduan.judul_pengaduan}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {pengaduan.isi_pengaduan}
                </p>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Kategori</p>
                      <p className="font-semibold text-gray-900">{pengaduan.kategori}</p>
                    </div>
                  </div>
                  {pengaduan.lokasi_kejadian && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-500">Lokasi</p>
                        <p className="font-semibold text-gray-900">{pengaduan.lokasi_kejadian}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Tanggal Dibuat</p>
                      <p className="font-semibold text-gray-900">{formatDate(pengaduan.created_at)}</p>
                    </div>
                  </div>
                  {pengaduan.bidang && (
                    <div className="flex items-start space-x-3">
                      <Building className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-500">Ditangani Oleh</p>
                        <p className="font-semibold text-gray-900">{pengaduan.bidang.nama_bidang}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <PengaduanTimeline 
              currentStatus={pengaduan.timeline.length > 0 ? pengaduan.timeline[pengaduan.timeline.length - 1].status as any : pengaduan.status}
              timeline={pengaduan.timeline}
            />
          </motion.div>
        ) : hasSearched ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Pengaduan Tidak Ditemukan
            </h3>
            <p className="text-gray-600 mb-6">
              Pastikan kode tracking yang Anda masukkan sudah benar
            </p>
          </motion.div>
        ) : null}
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
                  <MapPinIcon className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
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

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat halaman tracking...</p>
        </div>
      </div>
    }>
      <TrackingContent />
    </Suspense>
  )
}
