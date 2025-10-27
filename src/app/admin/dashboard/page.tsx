"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data untuk dashboard
const statsData = {
  totalPengaduan: 1247,
  pending: 45,
  diproses: 89,
  selesai: 1058,
  ditolak: 55,
  pengaduanBulanIni: 127,
  rataRataWaktuSelesai: "4.2 hari",
  tingkatKepuasan: "87%",
};

// Data untuk chart trend bulanan
const monthlyTrendData = [
  { bulan: "Jan", total: 85, selesai: 78, pending: 7 },
  { bulan: "Feb", total: 92, selesai: 85, pending: 7 },
  { bulan: "Mar", total: 108, selesai: 98, pending: 10 },
  { bulan: "Apr", total: 95, selesai: 88, pending: 7 },
  { bulan: "Mei", total: 112, selesai: 105, pending: 7 },
  { bulan: "Jun", total: 118, selesai: 110, pending: 8 },
  { bulan: "Jul", total: 125, selesai: 115, pending: 10 },
  { bulan: "Agu", total: 132, selesai: 122, pending: 10 },
  { bulan: "Sep", total: 128, selesai: 120, pending: 8 },
  { bulan: "Okt", total: 127, selesai: 118, pending: 9 },
];

// Data untuk pie chart kategori
const categoryData = [
  { name: "Upah/Gaji", value: 385, color: "#3B82F6" },
  { name: "PHK", value: 245, color: "#EF4444" },
  { name: "BPJS", value: 198, color: "#10B981" },
  { name: "Kontrak Kerja", value: 156, color: "#F59E0B" },
  { name: "Jam Kerja", value: 132, color: "#8B5CF6" },
  { name: "Lainnya", value: 131, color: "#6B7280" },
];

// Data untuk status distribution
const statusData = [
  { name: "Selesai", value: 1058, color: "#10B981" },
  { name: "Diproses", value: 89, color: "#3B82F6" },
  { name: "Ditolak", value: 55, color: "#EF4444" },
  { name: "Pending", value: 45, color: "#F59E0B" },
];

// Data pengaduan terbaru
const recentComplaints = [
  {
    id: "ADU-202410-3847",
    nama: "Budi Santoso",
    kategori: "Upah/Gaji Tidak Dibayar",
    tanggal: "2024-10-27",
    status: "diproses",
  },
  {
    id: "ADU-202410-3846",
    nama: "Siti Aminah",
    kategori: "PHK Sepihak",
    tanggal: "2024-10-27",
    status: "pending",
  },
  {
    id: "ADU-202410-3845",
    nama: "Ahmad Fauzi",
    kategori: "Tidak Ada BPJS",
    tanggal: "2024-10-26",
    status: "selesai",
  },
  {
    id: "ADU-202410-3844",
    nama: "Dewi Lestari",
    kategori: "Jam Kerja Berlebihan",
    tanggal: "2024-10-26",
    status: "diproses",
  },
  {
    id: "ADU-202410-3843",
    nama: "Rudi Hartono",
    kategori: "Keselamatan Kerja",
    tanggal: "2024-10-25",
    status: "selesai",
  },
];

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("30");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "diproses":
        return <Badge variant="info">Diproses</Badge>;
      case "selesai":
        return <Badge variant="success">Selesai</Badge>;
      case "ditolak":
        return <Badge variant="destructive">Ditolak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <LayoutDashboard className="mr-3 h-8 w-8 text-blue-600" />
                Dashboard Admin SIPELAN
              </h1>
              <p className="text-gray-600 mt-1">
                Monitoring dan analisis pengaduan ketenagakerjaan
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Pengaduan
                  </CardTitle>
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {statsData.totalPengaduan.toLocaleString()}
                </div>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% dari bulan lalu
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-yellow-500">
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
                  {statsData.diproses}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {statsData.pending} pending verifikasi
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-green-600">
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
                  {statsData.selesai.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Rata-rata {statsData.rataRataWaktuSelesai}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-l-4 border-l-purple-600">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Tingkat Kepuasan
                  </CardTitle>
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {statsData.tingkatKepuasan}
                </div>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3% dari bulan lalu
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Trend Pengaduan Bulanan
                </CardTitle>
                <CardDescription>
                  Perbandingan total pengaduan dan yang selesai
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrendData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSelesai" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bulan" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#3B82F6"
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                      name="Total Pengaduan"
                    />
                    <Area
                      type="monotone"
                      dataKey="selesai"
                      stroke="#10B981"
                      fillOpacity={1}
                      fill="url(#colorSelesai)"
                      name="Selesai"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Kategori</CardTitle>
                <CardDescription>
                  Pengaduan berdasarkan jenis permasalahan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Status Pengaduan</CardTitle>
                <CardDescription>Distribusi berdasarkan status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {statusData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Complaints Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Pengaduan Terbaru</CardTitle>
                <CardDescription>5 pengaduan terakhir yang masuk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                          Nomor Tiket
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                          Pelapor
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                          Kategori
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                          Tanggal
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentComplaints.map((complaint, index) => (
                        <motion.tr
                          key={complaint.id}
                          className="border-b hover:bg-gray-50 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                        >
                          <td className="py-3 px-4 text-sm font-mono text-blue-600">
                            {complaint.id}
                          </td>
                          <td className="py-3 px-4 text-sm">{complaint.nama}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {complaint.kategori}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(complaint.tanggal).toLocaleDateString("id-ID")}
                          </td>
                          <td className="py-3 px-4">{getStatusBadge(complaint.status)}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm">
                    Lihat Semua Pengaduan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
