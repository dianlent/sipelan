'use client'

import { useState, useEffect } from 'react'
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
  Search,
  ClipboardCheck
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [appName, setAppName] = useState('SIPelan')
  const [appLogo, setAppLogo] = useState<string | null>(null)
  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: ''
  })

  // Load app settings
  useEffect(() => {
    const fetchAppSettings = async () => {
      try {
        const response = await fetch('/api/settings/app/public')
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            setAppName(result.data.app_name || 'SIPelan')
            setAppLogo(result.data.app_logo_url || null)
            setSocialMedia({
              facebook: result.data.facebook_url || '',
              twitter: result.data.twitter_url || '',
              instagram: result.data.instagram_url || '',
              youtube: result.data.youtube_url || ''
            })
          }
        }
      } catch (error) {
        console.error('Error fetching app settings:', error)
      }
    }
    fetchAppSettings()
  }, [])

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              {appLogo ? (
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-purple-400/50 bg-white">
                  <img 
                    src={appLogo} 
                    alt={appName}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6 text-white" />
                </div>
              )}
              <h3 className="text-xl font-bold">{appName}</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Sistem Informasi Pengaduan Pelayanan Naker 
              Layanan pengaduan yang cepat, transparan, dan terpercaya.
            </p>
            <div className="flex space-x-3">
              {socialMedia.facebook && (
                <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {socialMedia.twitter && (
                <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-sky-500 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {socialMedia.instagram && (
                <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-pink-500 transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {socialMedia.youtube && (
                <a href={socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-500 transition-all">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {!socialMedia.facebook && !socialMedia.twitter && !socialMedia.instagram && !socialMedia.youtube && (
                <p className="text-gray-500 text-sm">Belum ada sosial media</p>
              )}
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
                <span>disnakerpati@gmail.com</span>
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
              © {currentYear} <span className="font-semibold text-white">{appName}</span> - Dinas Tenaga Kerja. 
              <span className="hidden md:inline"> All rights reserved.</span>
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-purple-400 transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="/terms" className="hover:text-purple-400 transition-colors">
                Syarat & Ketentuan
              </Link>
              <Link href="/faq" className="hover:text-purple-400 transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
