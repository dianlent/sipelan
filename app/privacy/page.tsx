'use client'

import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SIPelan</span>
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Kebijakan Privasi
            </h1>
            <p className="text-lg text-gray-600">
              Terakhir diperbarui: November 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 space-y-8">
            {/* Section 1 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Pendahuluan</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                SIPelan (Sistem Pengaduan Layanan Online Naker) berkomitmen untuk melindungi privasi Anda. 
                Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi 
                informasi pribadi Anda saat menggunakan layanan kami.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Informasi yang Kami Kumpulkan</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Nama lengkap dan informasi kontak (email, nomor telepon)</li>
                  <li>NIK (Nomor Induk Kependudukan) untuk verifikasi identitas</li>
                  <li>Detail pengaduan yang Anda sampaikan</li>
                  <li>Dokumen pendukung yang Anda unggah</li>
                  <li>Informasi akun jika Anda mendaftar sebagai pengguna</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Penggunaan Informasi</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  Informasi yang kami kumpulkan digunakan untuk:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Memproses dan menindaklanjuti pengaduan Anda</li>
                  <li>Mengirimkan notifikasi terkait status pengaduan</li>
                  <li>Verifikasi identitas untuk mencegah penyalahgunaan</li>
                  <li>Meningkatkan kualitas layanan kami</li>
                  <li>Mematuhi kewajiban hukum dan regulasi</li>
                  <li>Analisis statistik untuk pelaporan internal</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Keamanan Data</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi 
                informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Data Anda 
                disimpan di server yang aman dan dienkripsi sesuai standar industri.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Hak Anda</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  Anda memiliki hak untuk:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Mengakses informasi pribadi yang kami simpan tentang Anda</li>
                  <li>Meminta koreksi data yang tidak akurat</li>
                  <li>Meminta penghapusan data dalam kondisi tertentu</li>
                  <li>Menarik persetujuan penggunaan data</li>
                  <li>Mengajukan keluhan kepada otoritas perlindungan data</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Pengaduan Anonim</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Jika Anda memilih untuk mengajukan pengaduan secara anonim, kami tidak akan mengumpulkan 
                informasi pribadi Anda. Namun, ini dapat membatasi kemampuan kami untuk menindaklanjuti 
                pengaduan Anda secara efektif.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Perubahan Kebijakan</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan 
                diumumkan melalui website kami dan akan berlaku segera setelah dipublikasikan.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Hubungi Kami</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> privacy@disnaker.go.id</p>
                <p><strong>Telepon:</strong> (021) 1234-5678</p>
                <p><strong>Alamat:</strong> Dinas Ketenagakerjaan, Jakarta</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">&copy; 2024 Dinas Ketenagakerjaan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
