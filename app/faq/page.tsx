'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HelpCircle,
  ChevronDown,
  Search,
  MessageSquare,
  Clock,
  FileText,
  Shield,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle,
  ClipboardCheck,
  ClipboardList,
  Users,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')

  const categories = ['Semua', 'Umum', 'Pengaduan', 'Tracking', 'Akun', 'Keamanan']

  const faqs: FAQItem[] = [
    {
      category: 'Umum',
      question: 'Apa itu SIPelan?',
      answer: 'SIPelan (Sistem Pengaduan Layanan Online Naker) adalah platform digital yang memudahkan masyarakat untuk menyampaikan pengaduan terkait masalah ketenagakerjaan. Platform ini menyediakan layanan pengaduan online yang cepat, transparan, dan mudah diakses.'
    },
    {
      category: 'Umum',
      question: 'Apakah layanan SIPelan gratis?',
      answer: 'Ya, seluruh layanan SIPelan sepenuhnya gratis. Anda tidak perlu membayar biaya apapun untuk mengajukan pengaduan, melacak status, atau menggunakan fitur-fitur lainnya.'
    },
    {
      category: 'Umum',
      question: 'Siapa yang bisa menggunakan SIPelan?',
      answer: 'SIPelan dapat digunakan oleh seluruh masyarakat Indonesia yang memiliki masalah atau keluhan terkait ketenagakerjaan, termasuk pekerja, pencari kerja, pengusaha, atau pihak lain yang berkepentingan.'
    },
    {
      category: 'Pengaduan',
      question: 'Bagaimana cara membuat pengaduan?',
      answer: 'Untuk membuat pengaduan, klik tombol "Buat Pengaduan" di halaman utama, kemudian isi formulir dengan lengkap meliputi data diri, detail pengaduan, dan unggah dokumen pendukung jika ada. Setelah selesai, klik "Kirim Pengaduan" dan Anda akan mendapatkan kode tracking.'
    },
    {
      category: 'Pengaduan',
      question: 'Apakah harus login untuk membuat pengaduan?',
      answer: 'Tidak, Anda tidak perlu login atau membuat akun untuk mengajukan pengaduan. Cukup isi formulir pengaduan dengan data yang valid dan Anda akan mendapatkan kode tracking untuk memantau status pengaduan.'
    },
    {
      category: 'Pengaduan',
      question: 'Jenis pengaduan apa saja yang bisa diajukan?',
      answer: 'Anda dapat mengajukan berbagai jenis pengaduan ketenagakerjaan seperti: masalah upah/gaji, PHK tidak sesuai prosedur, jaminan sosial, keselamatan kerja, diskriminasi di tempat kerja, pelanggaran kontrak kerja, dan masalah ketenagakerjaan lainnya.'
    },
    {
      category: 'Pengaduan',
      question: 'Berapa lama proses pengaduan?',
      answer: 'Pengaduan Anda akan diverifikasi dalam waktu maksimal 1x24 jam. Setelah diverifikasi, pengaduan akan didisposisikan ke bidang terkait. Total waktu penyelesaian tergantung kompleksitas kasus, namun kami berkomitmen untuk memberikan respon dan solusi secepat mungkin.'
    },
    {
      category: 'Pengaduan',
      question: 'Dokumen apa saja yang perlu disiapkan?',
      answer: 'Dokumen pendukung yang dapat Anda unggah meliputi: KTP, kontrak kerja, slip gaji, surat peringatan, foto/screenshot bukti, atau dokumen relevan lainnya. Semakin lengkap dokumen yang Anda berikan, semakin cepat proses penanganan pengaduan.'
    },
    {
      category: 'Tracking',
      question: 'Bagaimana cara melacak status pengaduan?',
      answer: 'Setelah mengajukan pengaduan, Anda akan mendapatkan kode tracking unik. Gunakan kode tersebut di halaman "Tracking" untuk melihat status terkini pengaduan Anda. Anda juga akan menerima notifikasi email setiap ada update status.'
    },
    {
      category: 'Tracking',
      question: 'Apa saja status pengaduan yang ada?',
      answer: 'Status pengaduan meliputi: "Diterima" (pengaduan baru masuk), "Diverifikasi" (sedang diverifikasi tim), "Diproses" (sedang ditangani bidang terkait), "Selesai" (pengaduan telah diselesaikan), dan "Ditolak" (jika pengaduan tidak sesuai kriteria).'
    },
    {
      category: 'Tracking',
      question: 'Apakah saya akan mendapat notifikasi?',
      answer: 'Ya, Anda akan menerima notifikasi email setiap kali ada perubahan status pada pengaduan Anda. Pastikan alamat email yang Anda berikan valid dan aktif.'
    },
    {
      category: 'Tracking',
      question: 'Kode tracking hilang, bagaimana?',
      answer: 'Jika kode tracking hilang, Anda dapat menghubungi kami melalui email atau telepon dengan menyertakan data diri dan informasi pengaduan. Tim kami akan membantu Anda mendapatkan kembali kode tracking tersebut.'
    },
    {
      category: 'Akun',
      question: 'Apakah perlu membuat akun?',
      answer: 'Tidak wajib. Anda dapat mengajukan pengaduan tanpa membuat akun. Namun, dengan membuat akun, Anda dapat melihat riwayat semua pengaduan Anda, menyimpan draft, dan mendapatkan akses ke fitur tambahan lainnya.'
    },
    {
      category: 'Akun',
      question: 'Bagaimana cara membuat akun?',
      answer: 'Klik tombol "Register" di pojok kanan atas, kemudian isi formulir pendaftaran dengan data yang valid. Setelah mendaftar, Anda akan menerima email verifikasi. Klik link verifikasi untuk mengaktifkan akun Anda.'
    },
    {
      category: 'Akun',
      question: 'Lupa password, bagaimana cara reset?',
      answer: 'Klik "Lupa Password" di halaman login, masukkan email yang terdaftar, dan Anda akan menerima link reset password melalui email. Klik link tersebut dan buat password baru.'
    },
    {
      category: 'Keamanan',
      question: 'Apakah data saya aman?',
      answer: 'Ya, kami sangat serius dalam menjaga keamanan data Anda. Semua data ditransmisikan dengan enkripsi SSL/TLS, disimpan dengan aman, dan hanya dapat diakses oleh petugas yang berwenang. Kami juga mematuhi peraturan perlindungan data pribadi.'
    },
    {
      category: 'Keamanan',
      question: 'Siapa saja yang bisa melihat pengaduan saya?',
      answer: 'Pengaduan Anda hanya dapat dilihat oleh tim verifikasi dan petugas bidang terkait yang menangani kasus Anda. Kami menjaga kerahasiaan identitas dan detail pengaduan Anda sesuai dengan kebijakan privasi.'
    },
    {
      category: 'Keamanan',
      question: 'Bagaimana jika ada penyalahgunaan data?',
      answer: 'Jika Anda mencurigai adanya penyalahgunaan data, segera hubungi kami melalui email privacy@disnaker.go.id atau telepon (021) 1234-5678. Kami akan segera menindaklanjuti laporan Anda.'
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'Semua' || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

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
      <section className="relative py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl mb-6">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Pertanyaan yang Sering Diajukan
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Temukan jawaban atas pertanyaan Anda tentang SIPelan
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari pertanyaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-lg border-2 border-white/50 focus:border-white focus:outline-none text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Tidak ada hasil ditemukan
                </h3>
                <p className="text-gray-600">
                  Coba gunakan kata kunci lain atau pilih kategori berbeda
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <HelpCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-lg">
                              {faq.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {faq.question}
                          </h3>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: activeIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0 ml-4"
                      >
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {activeIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pl-20">
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-l-4 border-purple-500">
                              <p className="text-gray-700 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: <MessageSquare />, title: '18 FAQ', desc: 'Pertanyaan Tersedia', color: 'from-purple-500 to-pink-500' },
                { icon: <Clock />, title: '24/7', desc: 'Dukungan Online', color: 'from-blue-500 to-cyan-500' },
                { icon: <CheckCircle />, title: '95%', desc: 'Tingkat Kepuasan', color: 'from-green-500 to-emerald-500' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg text-center"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.title}</h3>
                  <p className="text-gray-600">{stat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 rounded-3xl shadow-2xl p-12 text-white text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl mb-6">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  Tidak Menemukan Jawaban?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Tim kami siap membantu Anda. Hubungi kami melalui email atau telepon untuk bantuan lebih lanjut.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:info@disnaker.go.id"
                    className="inline-flex items-center space-x-3 bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Email Kami</span>
                  </a>
                  <a
                    href="tel:02112345678"
                    className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-purple-600 transition-all"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Hubungi Kami</span>
                  </a>
                </div>

                <div className="mt-8 pt-8 border-t border-white/20">
                  <p className="text-white/80 text-sm">
                    Jam Layanan: Senin - Jumat, 08:00 - 16:00 WIB
                  </p>
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
