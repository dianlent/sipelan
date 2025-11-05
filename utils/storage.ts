// Storage utility functions for managing pengaduan data

export interface TimelineItem {
  status: string
  keterangan: string
  created_at: string
  updated_by?: string
}

export interface PengaduanData {
  id: string
  kode_pengaduan: string
  judul_pengaduan: string
  isi_pengaduan: string
  kategori: string
  status: string
  lokasi_kejadian: string
  tanggal_kejadian: string
  file_bukti: string | null
  created_at: string
  user: {
    nama_lengkap: string
    email: string
    anonim: boolean
  }
  no_telepon: string
  timeline: TimelineItem[]
  bidang?: string
  ditangani_oleh?: string
  tanggapan?: string
}

/**
 * Get all pengaduan from localStorage
 */
export const getAllPengaduan = (): Record<string, PengaduanData> => {
  if (typeof window === 'undefined') return {}
  
  try {
    const data = localStorage.getItem('allPengaduan')
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('Error reading allPengaduan:', error)
    return {}
  }
}

/**
 * Get single pengaduan by code
 */
export const getPengaduanByCode = (code: string): PengaduanData | null => {
  const allPengaduan = getAllPengaduan()
  return allPengaduan[code] || null
}

/**
 * Save pengaduan to localStorage
 */
export const savePengaduan = (code: string, data: PengaduanData): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    const allPengaduan = getAllPengaduan()
    allPengaduan[code] = data
    localStorage.setItem('allPengaduan', JSON.stringify(allPengaduan))
    console.log(`✅ Pengaduan ${code} saved successfully`)
    return true
  } catch (error) {
    console.error('Error saving pengaduan:', error)
    return false
  }
}

/**
 * Update pengaduan status and add timeline entry
 */
export const updatePengaduanStatus = (
  code: string,
  newStatus: string,
  keterangan: string,
  updatedBy?: string
): boolean => {
  const pengaduan = getPengaduanByCode(code)
  if (!pengaduan) {
    console.error(`Pengaduan ${code} not found`)
    return false
  }

  // Update status
  pengaduan.status = newStatus

  // Add timeline entry
  pengaduan.timeline.push({
    status: newStatus,
    keterangan,
    created_at: new Date().toISOString(),
    updated_by: updatedBy
  })

  // Save updated pengaduan
  return savePengaduan(code, pengaduan)
}

/**
 * Assign pengaduan to bidang
 */
export const assignPengaduanToBidang = (
  code: string,
  bidang: string,
  keterangan: string,
  assignedBy: string
): boolean => {
  const pengaduan = getPengaduanByCode(code)
  if (!pengaduan) {
    console.error(`Pengaduan ${code} not found`)
    return false
  }

  // Update bidang
  pengaduan.bidang = bidang
  pengaduan.status = 'diproses'

  // Add timeline entry
  pengaduan.timeline.push({
    status: 'diproses',
    keterangan: `Didisposisi ke ${bidang}. ${keterangan}`,
    created_at: new Date().toISOString(),
    updated_by: assignedBy
  })

  // Save updated pengaduan
  return savePengaduan(code, pengaduan)
}

/**
 * Add response to pengaduan
 */
export const addPengaduanResponse = (
  code: string,
  tanggapan: string,
  respondedBy: string
): boolean => {
  const pengaduan = getPengaduanByCode(code)
  if (!pengaduan) {
    console.error(`Pengaduan ${code} not found`)
    return false
  }

  // Update tanggapan
  pengaduan.tanggapan = tanggapan
  pengaduan.ditangani_oleh = respondedBy
  pengaduan.status = 'selesai'

  // Add timeline entry
  pengaduan.timeline.push({
    status: 'selesai',
    keterangan: `Pengaduan telah ditindaklanjuti oleh ${respondedBy}`,
    created_at: new Date().toISOString(),
    updated_by: respondedBy
  })

  // Save updated pengaduan
  return savePengaduan(code, pengaduan)
}

/**
 * Get my pengaduan codes
 */
export const getMyPengaduan = (): Array<{ kode: string; judul: string; tanggal: string }> => {
  if (typeof window === 'undefined') return []
  
  try {
    const data = localStorage.getItem('myPengaduan')
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading myPengaduan:', error)
    return []
  }
}

/**
 * Clear all pengaduan data (for testing)
 */
export const clearAllPengaduan = (): void => {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('allPengaduan')
  localStorage.removeItem('myPengaduan')
  console.log('🗑️ All pengaduan data cleared')
}

/**
 * Get pengaduan statistics
 */
export const getPengaduanStats = () => {
  const allPengaduan = getAllPengaduan()
  const pengaduanArray = Object.values(allPengaduan)

  return {
    total: pengaduanArray.length,
    masuk: pengaduanArray.filter(p => p.status === 'masuk').length,
    diproses: pengaduanArray.filter(p => p.status === 'diproses').length,
    selesai: pengaduanArray.filter(p => p.status === 'selesai').length,
    ditolak: pengaduanArray.filter(p => p.status === 'ditolak').length
  }
}
