'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ClipboardCheck, 
  FileText, 
  Search, 
  RefreshCw, 
  Mail,
  Users,
  ClipboardList,
  Clock,
  Star,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Shield,
  Zap,
  Award,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Sparkles,
  User
} from 'lucide-react'
import Footer from '@/components/Footer'

interface Stats {
  totalUsers: number
  totalPengaduan: number
  selesai: number
  avgResponseTime: number
  satisfaction: number
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalPengaduan: 0,
    selesai: 0,
    avgResponseTime: 24,
    satisfaction: 95
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats?format=simple&range=1year')
      if (response.ok) {
        const data = await response.json()
        console.log('Homepage stats loaded:', data)
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen">
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
                className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors rounded-xl hover:bg-purple-50 flex items-center space-x-2"
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
                className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors rounded-xl hover:bg-purple-50 flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Tracking</span>
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              <Link 
                href="/login" 
                className="hidden md:flex items-center space-x-2 px-5 py-2.5 text-gray-700 hover:text-purple-600 font-semibold transition-all rounded-xl hover:bg-gray-100"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link 
                href="/pengaduan" 
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                <span>Ajukan Pengaduan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Floating Gradient Orbs */}
          <div className="absolute top-0 left-0 w-full h-full">
            <motion.div 
              animate={{ 
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full blur-3xl opacity-30"
            ></motion.div>
            
            <motion.div 
              animate={{ 
                x: [0, -80, 0],
                y: [0, 100, 0],
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute top-40 right-20 w-[500px] h-[500px] bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-25"
            ></motion.div>
            
            <motion.div 
              animate={{ 
                x: [0, 60, 0],
                y: [0, -80, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4
              }}
              className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur-3xl opacity-30"
            ></motion.div>

            <motion.div 
              animate={{ 
                x: [0, -50, 0],
                y: [0, 60, 0],
                scale: [1, 1.15, 1]
              }}
              transition={{ 
                duration: 22,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-40 right-1/4 w-72 h-72 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-3xl opacity-20"
            ></motion.div>
          </div>

          {/* Animated Grid Pattern */}
          <motion.div 
            animate={{ 
              backgroundPosition: ['0px 0px', '60px 60px']
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"
          ></motion.div>

          {/* Floating Particles */}
          <div className="absolute inset-0" suppressHydrationWarning>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                suppressHydrationWarning
              />
            ))}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-600/10 to-purple-900/30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full mb-6 border border-white/30"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-white text-sm font-semibold">Layanan Terpercaya & Transparan</span>
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                Sampaikan
                <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                  Aspirasi Anda
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Platform pengaduan ketenagakerjaan yang mudah, cepat, dan transparan. Kami siap membantu menyelesaikan keluhan Anda.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/pengaduan"
                  className="group bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center justify-center space-x-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Buat Pengaduan</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/tracking"
                  className="group bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all inline-flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Lacak Status</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start space-x-8 mt-10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {isLoading ? '...' : `${stats.selesai}+`}
                  </div>
                  <div className="text-white/70 text-sm">Pengaduan Selesai</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {isLoading ? '...' : `${stats.satisfaction}%`}
                  </div>
                  <div className="text-white/70 text-sm">Kepuasan</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-white/70 text-sm">Support</div>
                </div>
              </div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                        <ClipboardCheck className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-bold">Pengaduan Baru</div>
                        <div className="text-white/60 text-sm">Status: Diterima</div>
                      </div>
                    </div>
                    
                    {/* Progress */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 w-full"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 w-2/3"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <Star className="w-5 h-5 text-white/50" />
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-white/20 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl"
                >
                  <Zap className="w-10 h-10 text-white" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl"
                >
                  <Shield className="w-10 h-10 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fitur Unggulan</h2>
            <p className="text-xl text-gray-600">Kemudahan dalam setiap langkah pengaduan Anda</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FileText className="w-10 h-10" />,
                title: "Buat Pengaduan",
                description: "Ajukan pengaduan Anda secara online dengan mudah dan cepat",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: <Search className="w-10 h-10" />,
                title: "Tracking Status",
                description: "Monitor progress pengaduan Anda secara real-time",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: <RefreshCw className="w-10 h-10" />,
                title: "Disposisi Cepat",
                description: "Pengaduan langsung diteruskan ke bidang terkait",
                gradient: "from-pink-500 to-yellow-500"
              },
              {
                icon: <Mail className="w-10 h-10" />,
                title: "Notifikasi Email",
                description: "Dapatkan update status melalui email Anda",
                gradient: "from-cyan-500 to-purple-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Users />, number: `${stats.totalUsers}+`, label: "Pengguna Aktif", color: "from-purple-500 to-pink-500" },
              { icon: <ClipboardList />, number: `${stats.selesai}+`, label: "Pengaduan Selesai", color: "from-blue-500 to-cyan-500" },
              { icon: <Star />, number: `${stats.satisfaction}%`, label: "Tingkat Kepuasan", color: "from-green-500 to-emerald-500" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all text-center border border-gray-100 group-hover:-translate-y-2">
                  <div className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  {isLoading ? (
                    <>
                      <div className="h-12 bg-gray-200 rounded-lg mx-auto mb-3 w-32 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded mx-auto w-24 animate-pulse"></div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">{stat.number}</h3>
                      <p className="text-gray-600 font-semibold uppercase tracking-wider text-sm">{stat.label}</p>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-white via-purple-50/30 to-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-purple-600 text-sm font-semibold">Mudah & Cepat</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Cara Kerja <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">SIPelan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Proses pengaduan yang mudah dan transparan dalam <span className="font-bold text-purple-600">3 langkah sederhana</span>
            </p>
          </motion.div>

          {/* Steps */}
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connector Lines */}
              <div className="hidden md:block absolute top-32 left-0 right-0 h-1 bg-gradient-to-r from-purple-200 via-blue-200 to-green-200 z-0" style={{width: '85%', left: '7.5%'}}></div>
              
              {[
                {
                  step: "01",
                  title: "Buat Pengaduan",
                  description: "Isi formulir pengaduan dengan lengkap. Tidak perlu login, cukup masukkan data diri dan detail pengaduan Anda.",
                  icon: <FileText className="w-10 h-10" />,
                  color: "from-purple-500 to-pink-500",
                  bgColor: "bg-purple-50",
                  iconBg: "bg-purple-100",
                  features: ["Tanpa Login", "Form Mudah", "Upload Bukti"]
                },
                {
                  step: "02",
                  title: "Proses Verifikasi",
                  description: "Tim kami akan memverifikasi dan mendisposisikan pengaduan ke bidang terkait dalam waktu 1x24 jam.",
                  icon: <RefreshCw className="w-10 h-10" />,
                  color: "from-blue-500 to-cyan-500",
                  bgColor: "bg-blue-50",
                  iconBg: "bg-blue-100",
                  features: ["Verifikasi Cepat", "Auto Disposisi", "Max 24 Jam"]
                },
                {
                  step: "03",
                  title: "Dapatkan Solusi",
                  description: "Pantau progress melalui kode tracking. Kami akan memberikan solusi terbaik untuk pengaduan Anda.",
                  icon: <CheckCircle className="w-10 h-10" />,
                  color: "from-green-500 to-emerald-500",
                  bgColor: "bg-green-50",
                  iconBg: "bg-green-100",
                  features: ["Real-time Track", "Notifikasi Email", "Solusi Tepat"]
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="relative"
                >
                  <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-gray-100 group hover:-translate-y-3 z-10">
                    {/* Step Number Badge */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-2xl border-4 border-white ring-4 ring-${step.bgColor.replace('bg-', '')}/50`}
                      >
                        <span className="text-2xl font-black text-white">{step.step}</span>
                      </motion.div>
                    </div>
                    
                    <div className="mt-12 text-center">
                      {/* Icon */}
                      <div className={`w-28 h-28 ${step.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all shadow-lg`}>
                        <div className={`w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-inner`}>
                          <div className={`bg-gradient-to-br ${step.color} bg-clip-text`}>
                            {step.icon}
                          </div>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                        {step.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {step.description}
                      </p>

                      {/* Features List */}
                      <div className="space-y-2">
                        {step.features.map((feature, idx) => (
                          <div key={idx} className={`flex items-center justify-center space-x-2 ${step.bgColor} px-4 py-2 rounded-xl`}>
                            <CheckCircle className={`w-4 h-4 bg-gradient-to-r ${step.color} bg-clip-text text-transparent`} style={{stroke: 'url(#gradient)'}} />
                            <span className="text-sm font-semibold text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Arrow Indicator */}
                      {index < 2 && (
                        <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-20">
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight className="w-8 h-8 text-purple-300" />
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16"
          >
            <Link 
              href="/pengaduan"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all group"
            >
              <span>Mulai Buat Pengaduan</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <p className="text-gray-500 text-sm mt-4">Gratis & Tanpa Login</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full mb-6 border border-white/30">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-semibold">Siap Membantu Anda</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Punya Keluhan Ketenagakerjaan?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Jangan ragu untuk menyampaikan aspirasi Anda. Tim kami siap membantu menyelesaikan permasalahan ketenagakerjaan Anda dengan cepat dan profesional.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/pengaduan"
                className="group bg-white text-purple-600 px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center justify-center space-x-2"
              >
                <FileText className="w-6 h-6" />
                <span>Ajukan Pengaduan Sekarang</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/tracking"
                className="group bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all inline-flex items-center justify-center space-x-2"
              >
                <Search className="w-6 h-6" />
                <span>Lacak Pengaduan</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-12 border-t border-white/20">
              <div className="flex items-center space-x-3 text-white">
                <Shield className="w-8 h-8 text-yellow-300" />
                <span className="font-semibold">Data Aman & Terlindungi</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <Zap className="w-8 h-8 text-yellow-300" />
                <span className="font-semibold">Respon Cepat 24 Jam</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <Award className="w-8 h-8 text-yellow-300" />
                <span className="font-semibold">Layanan Terpercaya</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
