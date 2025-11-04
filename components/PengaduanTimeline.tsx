'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  CheckCircle, 
  Send, 
  RefreshCw, 
  CheckCheck,
  Clock
} from 'lucide-react'

interface TimelineStep {
  id: number
  title: string
  description: string
  status: 'completed' | 'current' | 'pending'
  date?: string
  icon: React.ReactNode
  color: string
}

interface PengaduanTimelineProps {
  currentStatus: 'masuk' | 'terverifikasi' | 'terdisposisi' | 'tindak_lanjut' | 'selesai'
  timeline?: Array<{
    status: string
    keterangan: string
    created_at: string
  }>
}

export default function PengaduanTimeline({ currentStatus, timeline = [] }: PengaduanTimelineProps) {
  const statusOrder = ['masuk', 'terverifikasi', 'terdisposisi', 'tindak_lanjut', 'selesai']
  const currentIndex = statusOrder.indexOf(currentStatus)

  const steps: TimelineStep[] = [
    {
      id: 1,
      title: 'Pengaduan Masuk',
      description: 'Pelapor mengisi aduan melalui website',
      status: currentIndex >= 0 ? 'completed' : 'pending',
      icon: <FileText className="w-6 h-6" />,
      color: 'blue',
      date: timeline.find(t => t.status === 'masuk')?.created_at
    },
    {
      id: 2,
      title: 'Pengaduan Terverifikasi',
      description: 'Pengaduan sudah terverifikasi oleh admin',
      status: currentIndex > 0 ? 'completed' : currentIndex === 0 ? 'current' : 'pending',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'green',
      date: timeline.find(t => t.status === 'terverifikasi')?.created_at
    },
    {
      id: 3,
      title: 'Pengaduan Terdisposisi',
      description: 'Pengaduan sudah dikirim ke Bidang yang terkait',
      status: currentIndex > 1 ? 'completed' : currentIndex === 1 ? 'current' : 'pending',
      icon: <Send className="w-6 h-6" />,
      color: 'purple',
      date: timeline.find(t => t.status === 'terdisposisi')?.created_at
    },
    {
      id: 4,
      title: 'Pengaduan Tindak Lanjut',
      description: 'Pengaduan sudah ditindaklanjuti oleh Bidang terkait',
      status: currentIndex > 2 ? 'completed' : currentIndex === 2 ? 'current' : 'pending',
      icon: <RefreshCw className="w-6 h-6" />,
      color: 'orange',
      date: timeline.find(t => t.status === 'tindak_lanjut')?.created_at
    },
    {
      id: 5,
      title: 'Pengaduan Selesai',
      description: 'Pengaduan sudah selesai dan dikirim ke pelapor',
      status: currentIndex > 3 ? 'completed' : currentIndex === 3 ? 'current' : 'pending',
      icon: <CheckCheck className="w-6 h-6" />,
      color: 'emerald',
      date: timeline.find(t => t.status === 'selesai')?.created_at
    }
  ]

  const getStepColor = (step: TimelineStep) => {
    if (step.status === 'completed') {
      return {
        bg: `bg-${step.color}-100`,
        border: `border-${step.color}-500`,
        text: `text-${step.color}-700`,
        icon: `bg-${step.color}-500`,
        line: `bg-${step.color}-500`
      }
    } else if (step.status === 'current') {
      return {
        bg: `bg-${step.color}-50`,
        border: `border-${step.color}-400`,
        text: `text-${step.color}-600`,
        icon: `bg-${step.color}-400`,
        line: `bg-gray-200`
      }
    } else {
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-300',
        text: 'text-gray-500',
        icon: 'bg-gray-300',
        line: 'bg-gray-200'
      }
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBgColor = (step: TimelineStep) => {
    if (step.status !== 'completed') return 'bg-gray-200'
    
    switch (step.color) {
      case 'blue':
        return 'bg-gray-400'
      case 'green':
        return 'bg-blue-500'
      case 'purple':
        return 'bg-orange-500'
      case 'orange':
        return 'bg-purple-500'
      case 'emerald':
        return 'bg-teal-500'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Timeline Pengaduan</h2>
          <p className="text-gray-600">Lacak progress pengaduan Anda</p>
        </div>
      </div>

      <div className="relative space-y-4">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          const bgColor = getStatusBgColor(step)
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start gap-4"
            >
              {/* Date/Time Column */}
              <div className="w-32 flex-shrink-0 text-right">
                {step.date && (
                  <div className="text-sm text-gray-600">
                    <div className="font-medium">
                      {new Date(step.date).toLocaleDateString('id-ID', { 
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(step.date).toLocaleTimeString('id-ID', { 
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Connector Line */}
              <div className="relative flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${step.status === 'completed' ? bgColor : 'bg-gray-300'} z-10`}></div>
                {!isLast && (
                  <div className="w-0.5 h-full bg-gray-200 absolute top-3"></div>
                )}
              </div>

              {/* Content Column */}
              <div className="flex-1 pb-8">
                <div className={`inline-block px-4 py-2 rounded-lg text-white font-medium mb-2 ${
                  step.status === 'completed' ? bgColor : 'bg-gray-300'
                }`}>
                  {step.title}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
                
                {/* Keterangan */}
                {timeline.find(t => t.status === statusOrder[index])?.keterangan && (
                  <p className="text-sm text-gray-500 mt-2 italic">
                    {timeline.find(t => t.status === statusOrder[index])?.keterangan}
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">Progress Keseluruhan</span>
          <span className="text-sm font-bold text-purple-600">{Math.round(((currentIndex + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full"
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Mulai</span>
          <span>Selesai</span>
        </div>
      </div>
    </div>
  )
}
