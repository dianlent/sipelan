'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  Users, 
  Database,
  CheckCircle,
  ArrowLeft,
  Mail,
  Phone,
  ClipboardCheck,
  ClipboardList,
  Clock,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react'

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Kembali ke Beranda</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Kebijakan Privasi
            </h1>
            <p className="text-xl text-white/90">
              Komitmen kami dalam melindungi data dan privasi Anda
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendahuluan</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Terakhir diperbarui: November 2024
                  </p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Selamat datang di SIPelan (Sistem Pengaduan Layanan Online Naker). Kami berkomitmen untuk melindungi 
                privasi dan keamanan data pribadi Anda. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, 
                menggunakan, menyimpan, dan melindungi informasi pribadi Anda saat menggunakan layanan kami.
              </p>
            </motion.div>

            {/* Data Collection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Informasi yang Kami Kumpulkan</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>1. Informasi Pribadi</span>
                      </h3>
                      <ul className="ml-7 space-y-2 text-gray-700">
                        <li className="flex items-start space-x-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>Nama lengkap</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>Alamat email</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>Nomor telepon</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>Alamat lengkap</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>NIK (Nomor Induk Kependudukan)</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>2. Informasi Pengaduan</span>
                      </h3>
                      <ul className="ml-7 space-y-2 text-gray-700">
                        <li className="flex items-start space-x-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>Detail pengaduan yang Anda sampaikan</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>Dokumen pendukung yang Anda unggah</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>Komunikasi terkait pengaduan</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>3. Informasi Teknis</span>
                      </h3>
                      <ul className="ml-7 space-y-2 text-gray-700">
                        <li className="flex items-start space-x-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>Alamat IP</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>Jenis browser dan perangkat</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>Waktu akses dan aktivitas di platform</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Data Usage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Penggunaan Informasi</h2>
                  
                  <p className="text-gray-700 mb-4">
                    Kami menggunakan informasi yang dikumpulkan untuk:
                  </p>

                  <div className="space-y-3">
                    {[
                      'Memproses dan menindaklanjuti pengaduan Anda',
                      'Berkomunikasi dengan Anda terkait status pengaduan',
                      'Meningkatkan kualitas layanan kami',
                      'Memenuhi kewajiban hukum dan regulasi',
                      'Mencegah penyalahgunaan dan fraud',
                      'Melakukan analisis statistik untuk perbaikan layanan'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Data Protection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Keamanan Data</h2>
                  
                  <p className="text-gray-700 mb-4">
                    Kami menerapkan berbagai langkah keamanan untuk melindungi informasi pribadi Anda:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { icon: <Lock />, title: 'Enkripsi SSL/TLS', desc: 'Semua data ditransmisikan dengan enkripsi' },
                      { icon: <Shield />, title: 'Firewall', desc: 'Perlindungan dari akses tidak sah' },
                      { icon: <Database />, title: 'Backup Rutin', desc: 'Data di-backup secara berkala' },
                      { icon: <Users />, title: 'Akses Terbatas', desc: 'Hanya petugas berwenang yang dapat mengakses' }
                    ].map((item, index) => (
                      <div key={index} className="p-4 bg-purple-50 rounded-xl">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                            {item.icon}
                          </div>
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* User Rights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Hak Anda</h2>
                  
                  <p className="text-gray-700 mb-4">
                    Sebagai pengguna, Anda memiliki hak untuk:
                  </p>

                  <div className="space-y-3">
                    {[
                      'Mengakses data pribadi yang kami simpan',
                      'Meminta koreksi data yang tidak akurat',
                      'Meminta penghapusan data pribadi Anda',
                      'Menarik persetujuan penggunaan data',
                      'Mengajukan keberatan atas pemrosesan data',
                      'Mendapatkan salinan data Anda'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white"
            >
              <h2 className="text-2xl font-bold mb-4">Hubungi Kami</h2>
              <p className="mb-6 text-white/90">
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin menggunakan hak Anda, 
                silakan hubungi kami:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5" />
                  <span>privacy@disnaker.go.id</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5" />
                  <span>(021) 1234-5678</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
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
                <Link href="/kebijakan-privasi" className="text-gray-400 hover:text-white transition-colors">
                  Kebijakan Privasi
                </Link>
                <span className="text-gray-600">|</span>
                <Link href="/syarat-ketentuan" className="text-gray-400 hover:text-white transition-colors">
                  Syarat & Ketentuan
                </Link>
                <span className="text-gray-600">|</span>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
