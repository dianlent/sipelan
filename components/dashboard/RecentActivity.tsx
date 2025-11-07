'use client'

import { motion } from 'framer-motion'
import { Clock, Eye } from 'lucide-react'
import Link from 'next/link'

interface Activity {
  id: string
  kode_pengaduan: string
  judul_pengaduan: string
  status: string
  created_at: string
  kategori?: string
}

interface RecentActivityProps {
  activities: Activity[]
  title?: string
}

const statusColors = {
  'diterima': 'bg-blue-100 text-blue-700',
  'diproses': 'bg-yellow-100 text-yellow-700',
  'selesai': 'bg-green-100 text-green-700',
  'ditolak': 'bg-red-100 text-red-700'
}

export default function RecentActivity({ activities, title = 'Aktivitas Terbaru' }: RecentActivityProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} menit yang lalu`
    if (diffHours < 24) return `${diffHours} jam yang lalu`
    if (diffDays < 7) return `${diffDays} hari yang lalu`
    
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada aktivitas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {activity.kode_pengaduan}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[activity.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}>
                    {activity.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                  {activity.judul_pengaduan}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(activity.created_at)}</span>
                  {activity.kategori && (
                    <>
                      <span>•</span>
                      <span>{activity.kategori}</span>
                    </>
                  )}
                </div>
              </div>
              <Link
                href={`/pengaduan/${activity.id}`}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
