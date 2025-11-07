'use client'

import { FileText, CheckCircle, AlertCircle, Scale, Users, Shield } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Syarat & Ketentuan
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
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Penerimaan Syarat</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Dengan mengakses dan menggunakan layanan SIPelan (Sistem Pengaduan Layanan Online Naker), 
                Anda setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan 
                syarat ini, mohon untuk tidak menggunakan layanan kami.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Penggunaan Layanan</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  Anda setuju untuk menggunakan layanan SIPelan dengan cara yang bertanggung jawab:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Memberikan informasi yang akurat dan benar</li>
                  <li>Tidak menyampaikan pengaduan palsu atau menyesatkan</li>
                  <li>Tidak menggunakan layanan untuk tujuan ilegal</li>
                  <li>Menghormati privasi dan hak orang lain</li>
                  <li>Tidak menyalahgunakan sistem atau mencoba mengaksesnya secara tidak sah</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Pengaduan yang Dapat Diterima</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  SIPelan menerima pengaduan terkait:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Pelanggaran hak-hak pekerja</li>
                  <li>Masalah ketenagakerjaan dan hubungan industrial</li>
                  <li>Keluhan terhadap layanan Dinas Ketenagakerjaan</li>
                  <li>Pelanggaran peraturan ketenagakerjaan</li>
                  <li>Masalah lain yang berkaitan dengan ketenagakerjaan</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Larangan</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  Anda dilarang untuk:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Mengunggah konten yang mengandung SARA, pornografi, atau kekerasan</li>
                  <li>Melakukan spam atau pengaduan berulang yang sama</li>
                  <li>Menggunakan identitas palsu atau menyamar sebagai orang lain</li>
                  <li>Mencoba merusak atau mengganggu sistem</li>
                  <li>Menggunakan layanan untuk tujuan komersial tanpa izin</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Tanggung Jawab</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Anda bertanggung jawab penuh atas semua pengaduan dan informasi yang Anda sampaikan. 
                Dinas Ketenagakerjaan berhak untuk menolak, menghapus, atau tidak menindaklanjuti 
                pengaduan yang melanggar syarat dan ketentuan ini.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Proses Pengaduan</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  Setelah pengaduan diterima:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Pengaduan akan diverifikasi oleh admin</li>
                  <li>Pengaduan yang valid akan didisposisikan ke bidang terkait</li>
                  <li>Bidang terkait akan menindaklanjuti pengaduan</li>
                  <li>Status pengaduan dapat dilacak melalui kode tracking</li>
                  <li>Notifikasi akan dikirim untuk setiap perubahan status</li>
                </ol>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Hak Kami</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  Dinas Ketenagakerjaan berhak untuk:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Memodifikasi atau menghentikan layanan kapan saja</li>
                  <li>Menolak pengaduan yang tidak sesuai dengan ketentuan</li>
                  <li>Memblokir akses pengguna yang melanggar ketentuan</li>
                  <li>Mengubah Syarat dan Ketentuan ini tanpa pemberitahuan sebelumnya</li>
                  <li>Menggunakan data pengaduan untuk analisis dan pelaporan</li>
                </ul>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Hukum yang Berlaku</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. 
                Setiap perselisihan yang timbul akan diselesaikan melalui pengadilan yang berwenang di Jakarta.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pertanyaan?</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> info@disnaker.go.id</p>
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
