import Link from 'next/link'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  FileText,
  Home,
  Search
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">SIPelan</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Sistem Informasi Pengaduan Online Naker 
              Layanan pengaduan yang cepat, transparan, dan terpercaya.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-purple-500 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-pink-500 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-500 transition-all">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Menu Cepat</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center space-x-2 text-sm">
                  <Home className="w-4 h-4" />
                  <span>Beranda</span>
                </Link>
              </li>
              <li>
                <Link href="/pengaduan" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center space-x-2 text-sm">
                  <FileText className="w-4 h-4" />
                  <span>Buat Pengaduan</span>
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center space-x-2 text-sm">
                  <Search className="w-4 h-4" />
                  <span>Lacak Pengaduan</span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="text-lg font-bold mb-4">Layanan Kami</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="hover:text-purple-400 transition-colors cursor-pointer">
                Pengaduan Ketenagakerjaan
              </li>
              <li className="hover:text-purple-400 transition-colors cursor-pointer">
                Konsultasi Hubungan Industrial
              </li>
              <li className="hover:text-purple-400 transition-colors cursor-pointer">
                Pelatihan Kerja
              </li>
              <li className="hover:text-purple-400 transition-colors cursor-pointer">
                Informasi Lowongan Kerja
              </li>
              <li className="hover:text-purple-400 transition-colors cursor-pointer">
                Sertifikasi Kompetensi
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Hubungi Kami</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-gray-400">
                <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>
                  Jl. Panglima Sudirman No 70<br />
                  Kabupaten Pati, Provinsi Jawa Tengah
                </span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span>(0295) 381471</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <Mail className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span>info@disnaker.go.id</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-gray-400">
                <strong className="text-white">Jam Layanan:</strong><br />
                Senin - Jumat: 08:00 - 16:00<br />
                Sabtu - Minggu: Tutup
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} <span className="font-semibold text-white">SIPelan</span> - Dinas Tenaga Kerja. 
              <span className="hidden md:inline"> All rights reserved.</span>
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-purple-400 transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="#" className="hover:text-purple-400 transition-colors">
                Syarat & Ketentuan
              </Link>
              <Link href="#" className="hover:text-purple-400 transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
