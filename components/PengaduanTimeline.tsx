'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  CheckCircle, 
  Send, 
  RefreshCw, 
  CheckCheck,
  Clock,
  Paperclip,
  Download,
  Image as ImageIcon,
  FileIcon
} from 'lucide-react'

interface TimelineStep {
  id: number
  title: string
  description: string
  status: 'completed' | 'current' | 'pending'
  date?: string
  icon: React.ReactNode
  color: string
  tanggapan?: string
  petugas?: string
  file_url?: string
  bidang_nama?: string
}

interface PengaduanTimelineProps {
  currentStatus: 'masuk' | 'terverifikasi' | 'terdisposisi' | 'tindak_lanjut' | 'selesai'
  timeline?: Array<{
    status: string
    keterangan: string
    created_at: string
    tanggapan?: string
    petugas?: string
    file_url?: string
    bidang_nama?: string
  }>
  bidangNama?: string
}

export default function PengaduanTimeline({ currentStatus, timeline = [], bidangNama }: PengaduanTimelineProps) {
  const statusOrder = ['masuk', 'terverifikasi', 'terdisposisi', 'tindak_lanjut', 'selesai']
  const currentIndex = statusOrder.indexOf(currentStatus)

  // Status mapping untuk judul dan deskripsi
  const statusInfo: Record<string, { title: string; description: string; color: string }> = {
    'masuk': {
      title: 'Pengaduan Masuk',
      description: 'Pengaduan telah diterima dan dicatat dalam sistem',
      color: 'gray'
    },
    'terverifikasi': {
      title: 'Pengaduan Terverifikasi',
      description: 'Pengaduan telah diverifikasi oleh admin dan siap didisposisi',
      color: 'blue'
    },
    'terdisposisi': {
      title: 'Pengaduan Terdisposisi',
      description: 'Pengaduan telah didisposisi ke bidang terkait untuk ditindaklanjuti',
      color: 'orange'
    },
    'tindak_lanjut': {
      title: 'Tanggapan',
      description: 'Bidang terkait memberikan tanggapan terhadap pengaduan',
      color: 'purple'
    },
    'selesai': {
      title: 'Selesai',
      description: 'Pengaduan telah selesai diproses dan ditutup',
      color: 'green'
    }
  }

  // Build complete timeline with all statuses
  const steps: TimelineStep[] = statusOrder.map((statusKey, index) => {
    const info = statusInfo[statusKey]
    
    // Find matching timeline item for this status
    const timelineItem = timeline.find(item => item.status === statusKey)
    
    // For "Tanggapan" status, also look for tanggapan in tindak_lanjut or selesai
    let tanggapanData = timelineItem
    if (statusKey === 'tindak_lanjut' && !timelineItem?.tanggapan) {
      // Look for tanggapan in any timeline item with tanggapan field
      tanggapanData = timeline.find(item => item.tanggapan) || timelineItem
    }
    
    // Determine step status
    let stepStatus: 'completed' | 'current' | 'pending'
    if (index < currentIndex) {
      stepStatus = 'completed'
    } else if (index === currentIndex) {
      stepStatus = 'current'
    } else {
      stepStatus = 'pending'
    }

    // Custom description for terdisposisi with bidang name
    let description = timelineItem?.keterangan || info.description
    if (statusKey === 'terdisposisi' && bidangNama) {
      description = `Pengaduan telah didisposisi ke Bidang ${bidangNama}`
    }

    return {
      id: index + 1,
      title: info.title,
      description: description,
      status: stepStatus,
      icon: <CheckCircle className="w-6 h-6" />,
      color: info.color,
      date: timelineItem?.created_at,
      tanggapan: tanggapanData?.tanggapan,
      petugas: tanggapanData?.petugas,
      file_url: tanggapanData?.file_url,
      bidang_nama: timelineItem?.bidang_nama || bidangNama
    }
  })

  const getFileExtension = (url: string) => {
    return url.split('.').pop()?.toLowerCase() || ''
  }

  const isImageFile = (url: string) => {
    const ext = getFileExtension(url)
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)
  }

  const getFileName = (url: string) => {
    return url.split('/').pop() || 'file'
  }

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
    if (step.status !== 'completed') return 'bg-gray-300'
    
    switch (step.color) {
      case 'gray':
        return 'bg-gray-400'
      case 'blue':
        return 'bg-blue-500'
      case 'orange':
        return 'bg-orange-500'
      case 'purple':
        return 'bg-purple-500'
      case 'green':
        return 'bg-green-500'
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
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium mb-2 ${
                  step.status === 'completed' ? bgColor : 'bg-gray-300'
                }`}>
                  {step.title === 'Selesai' && step.status === 'completed' && (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  <span>{step.title}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
                
                {/* Show tanggapan if available */}
                {step.tanggapan && (
                  <div className="mt-3 bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">💬</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-purple-700">Tanggapan Bidang</span>
                          {step.petugas && (
                            <span className="text-xs text-purple-600">• {step.petugas}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {step.tanggapan}
                        </p>
                        
                        {/* Show file attachment if available */}
                        {step.file_url && (
                          <div className="mt-3 pt-3 border-t border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Paperclip className="w-4 h-4 text-purple-600" />
                              <span className="text-xs font-semibold text-purple-700">Lampiran:</span>
                            </div>
                            
                            {isImageFile(step.file_url) ? (
                              // Image preview
                              <div className="space-y-2">
                                <div className="relative rounded-lg overflow-hidden border-2 border-purple-200 bg-white">
                                  <img 
                                    src={step.file_url} 
                                    alt="Lampiran"
                                    className="w-full max-h-64 object-contain"
                                  />
                                </div>
                                <a
                                  href={step.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                  <Download className="w-4 h-4" />
                                  <span>Download Gambar</span>
                                </a>
                              </div>
                            ) : (
                              // Document link
                              <a
                                href={step.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-white border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all group"
                              >
                                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                  <FileIcon className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {getFileName(step.file_url)}
                                  </p>
                                  <p className="text-xs text-gray-500 uppercase">
                                    {getFileExtension(step.file_url)} file
                                  </p>
                                </div>
                                <Download className="w-5 h-5 text-purple-600 flex-shrink-0" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

    </div>
  )
}
