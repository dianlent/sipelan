'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Scale,
  UserCheck,
  ShieldAlert,
  ArrowLeft,
  Mail,
  Phone,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  Users,
  Clock,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react'

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
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
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl mb-6">
              <Scale className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Syarat & Ketentuan
            </h1>
            <p className="text-xl text-white/90">
              Ketentuan penggunaan layanan SIPelan yang perlu Anda ketahui
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
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendahuluan</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Terakhir diperbarui: November 2024
                  </p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Selamat datang di SIPelan (Sistem Pengaduan Layanan Online Naker). Dengan mengakses dan menggunakan 
                layanan kami, Anda setuju untuk terikat dengan syarat dan ketentuan berikut. Harap membaca dengan 
                seksama sebelum menggunakan layanan kami.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <p className="text-sm text-blue-900">
                  <strong>Penting:</strong> Jika Anda tidak setuju dengan syarat dan ketentuan ini, mohon untuk 
                  tidak menggunakan layanan kami.
                </p>
              </div>
            </motion.div>

            {/* Acceptance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Penerimaan Ketentuan</h2>
                  
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Dengan menggunakan layanan SIPelan, Anda menyatakan bahwa:
                    </p>
                    
                    <div className="space-y-3">
                      {[
                        'Anda telah membaca dan memahami syarat dan ketentuan ini',
                        'Anda berusia minimal 17 tahun atau memiliki izin dari orang tua/wali',
                        'Informasi yang Anda berikan adalah benar dan akurat',
                        'Anda akan menggunakan layanan ini sesuai dengan hukum yang berlaku',
                        'Anda bertanggung jawab atas keamanan akun Anda (jika terdaftar)'
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Service Usage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Penggunaan Layanan</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Hak Pengguna</h3>
                      <div className="space-y-2">
                        {[
                          'Mengajukan pengaduan terkait ketenagakerjaan',
                          'Melacak status pengaduan yang telah diajukan',
                          'Mendapatkan tanggapan atas pengaduan yang disampaikan',
                          'Mengakses informasi terkait layanan ketenagakerjaan'
                        ].map((item, index) => (
                          <div key={index} className="flex items-start space-x-2 text-gray-700">
                            <span className="text-purple-500 mt-1">✓</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Kewajiban Pengguna</h3>
                      <div className="space-y-2">
                        {[
                          'Memberikan informasi yang benar dan akurat',
                          'Tidak menyalahgunakan layanan untuk tujuan ilegal',
                          'Tidak mengirimkan konten yang melanggar hukum atau norma',
                          'Menjaga kerahasiaan kode tracking pengaduan',
                          'Tidak melakukan spam atau pengaduan palsu',
                          'Menghormati privasi pihak lain'
                        ].map((item, index) => (
                          <div key={index} className="flex items-start space-x-2 text-gray-700">
                            <span className="text-purple-500 mt-1">•</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Prohibited Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Tindakan yang Dilarang</h2>
                  
                  <p className="text-gray-700 mb-4">
                    Pengguna dilarang untuk:
                  </p>

                  <div className="space-y-3">
                    {[
                      'Menggunakan layanan untuk tujuan yang melanggar hukum',
                      'Mengirimkan informasi palsu atau menyesatkan',
                      'Melakukan hacking, phishing, atau serangan siber lainnya',
                      'Menyebarkan virus, malware, atau kode berbahaya',
                      'Mengakses akun atau data pengguna lain tanpa izin',
                      'Melakukan spamming atau flooding pengaduan',
                      'Mengunggah konten yang mengandung SARA, pornografi, atau kekerasan',
                      'Menyalahgunakan sistem untuk kepentingan komersial tanpa izin'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg">
                    <p className="text-sm text-red-900">
                      <strong>Peringatan:</strong> Pelanggaran terhadap ketentuan ini dapat mengakibatkan 
                      pemblokiran akses, penghapusan akun, dan/atau tindakan hukum sesuai peraturan yang berlaku.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Intellectual Property */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Hak Kekayaan Intelektual</h2>
                  
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Seluruh konten, desain, logo, dan materi lainnya di platform SIPelan adalah milik 
                      Dinas Ketenagakerjaan dan dilindungi oleh hukum hak cipta dan kekayaan intelektual.
                    </p>
                    
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Anda tidak diperkenankan untuk:</h3>
                      <ul className="space-y-2 ml-4">
                        <li className="flex items-start space-x-2">
                          <span className="text-indigo-600 mt-1">•</span>
                          <span>Menyalin, memodifikasi, atau mendistribusikan konten tanpa izin</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-indigo-600 mt-1">•</span>
                          <span>Menggunakan logo atau merek dagang kami tanpa persetujuan tertulis</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-indigo-600 mt-1">•</span>
                          <span>Melakukan reverse engineering terhadap sistem kami</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Liability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Batasan Tanggung Jawab</h2>
                  
                  <div className="space-y-4 text-gray-700">
                    <p>
                      SIPelan berusaha memberikan layanan terbaik, namun kami tidak bertanggung jawab atas:
                    </p>
                    
                    <div className="space-y-3">
                      {[
                        'Gangguan layanan akibat pemeliharaan sistem atau force majeure',
                        'Kerugian yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan',
                        'Keakuratan informasi yang diberikan oleh pengguna lain',
                        'Tindakan pihak ketiga yang tidak sah',
                        'Kehilangan data akibat kesalahan pengguna'
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                          <span className="text-orange-600 font-bold mt-0.5">!</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Changes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Perubahan Ketentuan</h2>
                  
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Kami berhak untuk mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan 
                      berlaku segera setelah dipublikasikan di platform ini.
                    </p>
                    
                    <div className="bg-cyan-50 p-4 rounded-lg">
                      <p className="text-sm">
                        <strong>Catatan:</strong> Penggunaan layanan setelah perubahan ketentuan berarti 
                        Anda menyetujui perubahan tersebut. Kami menyarankan Anda untuk memeriksa halaman 
                        ini secara berkala.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white"
            >
              <h2 className="text-2xl font-bold mb-4">Hubungi Kami</h2>
              <p className="mb-6 text-white/90">
                Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5" />
                  <span>legal@disnaker.go.id</span>
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
