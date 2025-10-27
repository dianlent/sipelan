"use client";

import Link from "next/link";
import { FileText, Search, TrendingUp, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Home() {
  // Mock statistics - in production, this would come from an API
  const stats = {
    total: 1247,
    inProgress: 89,
    completed: 1158,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1 
                className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                SIPELAN
                <br />
                <span className="text-blue-200">Sistem Pengaduan Layanan Disnaker Pati</span>
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Sampaikan keluhan atau masalah ketenagakerjaan Anda dengan mudah dan aman.
                Kami siap membantu melindungi hak-hak pekerja dan buruh di Kabupaten Pati.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link href="/buat-aduan">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-shadow">
                      <FileText className="mr-2 h-5 w-5" />
                      Buat Pengaduan
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/lacak-aduan">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg">
                      <Search className="mr-2 h-5 w-5" />
                      Lacak Aduan Anda
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-12 bg-gray-50 border-y">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Statistik Pengaduan
              </h2>
              <p className="text-gray-600">
                Transparansi layanan pengaduan kami
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Total Aduan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
              <Card className="border-t-4 border-t-blue-600 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total Aduan
                    </CardTitle>
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.total.toLocaleString('id-ID')}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Sejak sistem beroperasi
                  </p>
                </CardContent>
              </Card>
              </motion.div>

              {/* Dalam Proses */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
              <Card className="border-t-4 border-t-yellow-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Dalam Proses
                    </CardTitle>
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.inProgress.toLocaleString('id-ID')}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Sedang ditindaklanjuti
                  </p>
                </CardContent>
              </Card>
              </motion.div>

              {/* Selesai */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
              <Card className="border-t-4 border-t-green-600 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Selesai
                    </CardTitle>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.completed.toLocaleString('id-ID')}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Telah diselesaikan
                  </p>
                </CardContent>
              </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Mengapa Menggunakan Layanan Ini?
              </h2>
              <p className="text-gray-600">
                Kemudahan dan keamanan dalam menyampaikan pengaduan
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <FileText className="h-8 w-8" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Mudah Digunakan
                </h3>
                <p className="text-gray-600">
                  Formulir pengaduan yang sederhana dan mudah dipahami oleh semua kalangan
                </p>
              </motion.div>

              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle className="h-8 w-8" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Terpercaya
                </h3>
                <p className="text-gray-600">
                  Dikelola langsung oleh Dinas Tenaga Kerja Kabupaten Pati
                </p>
              </motion.div>

              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Search className="h-8 w-8" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Transparan
                </h3>
                <p className="text-gray-600">
                  Lacak status pengaduan Anda kapan saja dengan nomor tiket
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Informasi Penting
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Pastikan data yang Anda masukkan benar dan lengkap</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Simpan nomor tiket pengaduan untuk melacak status</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Pengaduan akan ditindaklanjuti maksimal 3x24 jam kerja</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Identitas pelapor akan dijaga kerahasiaannya</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
