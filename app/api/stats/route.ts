import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Helper functions
function processMonthlyData(data: Array<{ created_at: string }>) {
  const monthCounts: { [key: string]: number } = {}
  
  data.forEach(item => {
    const date = new Date(item.created_at)
    const monthKey = date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
    monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1
  })

  return Object.entries(monthCounts).map(([month, count]) => ({ month, count }))
}

function processStatusData(data: Array<{ status: string }>) {
  const statusCounts: { [key: string]: number } = {}
  const statusColors: { [key: string]: string } = {
    'masuk': '#3B82F6',
    'terverifikasi': '#10B981',
    'terdisposisi': '#F59E0B',
    'tindak_lanjut': '#8B5CF6',
    'selesai': '#059669'
  }

  data.forEach(item => {
    statusCounts[item.status] = (statusCounts[item.status] || 0) + 1
  })

  return Object.entries(statusCounts).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
    count,
    color: statusColors[status] || '#6B7280'
  }))
}

function processKategoriData(data: Array<{ nama_kategori: string | null }>) {
  const kategoriCounts: { [key: string]: number } = {}

  data.forEach(item => {
    const kategori = item.nama_kategori || 'Lainnya'
    kategoriCounts[kategori] = (kategoriCounts[kategori] || 0) + 1
  })

  return Object.entries(kategoriCounts)
    .map(([kategori, count]) => ({ kategori, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Top 5 kategori
}

function processBidangData(data: Array<{ nama_bidang: string | null }>) {
  const bidangCounts: { [key: string]: number } = {}

  data.forEach(item => {
    const bidang = item.nama_bidang || 'Belum Didisposisi'
    bidangCounts[bidang] = (bidangCounts[bidang] || 0) + 1
  })

  return Object.entries(bidangCounts)
    .map(([bidang, count]) => ({ bidang, count }))
    .sort((a, b) => b.count - a.count)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '6months'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    switch (range) {
      case '1month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case '3months':
        startDate.setMonth(now.getMonth() - 3)
        break
      case '6months':
        startDate.setMonth(now.getMonth() - 6)
        break
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    const startDateIso = startDate.toISOString()

    // Get total users
    const totalUsersResult = await query<{ count: string }>('SELECT COUNT(*)::text AS count FROM users')
    const totalUsers = parseInt(totalUsersResult.rows[0]?.count || '0', 10)

    // Get total pengaduan
    const totalPengaduanResult = await query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM pengaduan WHERE created_at >= $1',
      [startDateIso]
    )
    const totalPengaduan = parseInt(totalPengaduanResult.rows[0]?.count || '0', 10)

    // Get pengaduan selesai
    const pengaduanSelesaiResult = await query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM pengaduan WHERE status = $1 AND created_at >= $2',
      ['selesai', startDateIso]
    )
    const pengaduanSelesai = parseInt(pengaduanSelesaiResult.rows[0]?.count || '0', 10)

    // Get pengaduan dalam proses
    const pengaduanProsesResult = await query<{ count: string }>(
      `
        SELECT COUNT(*)::text AS count
        FROM pengaduan
        WHERE status = ANY($1::text[])
          AND created_at >= $2
      `,
      [['masuk', 'terverifikasi', 'terdisposisi', 'tindak_lanjut'], startDateIso]
    )
    const pengaduanProses = parseInt(pengaduanProsesResult.rows[0]?.count || '0', 10)

    // Get pengaduan by month
    const monthlyResult = await query<{ created_at: string }>(
      'SELECT created_at FROM pengaduan WHERE created_at >= $1 ORDER BY created_at ASC',
      [startDateIso]
    )
    const pengaduanByMonth = processMonthlyData(monthlyResult.rows || [])

    // Get pengaduan by status
    const statusResult = await query<{ status: string }>(
      'SELECT status FROM pengaduan WHERE created_at >= $1',
      [startDateIso]
    )
    const pengaduanByStatus = processStatusData(statusResult.rows || [])

    // Get pengaduan by kategori
    const kategoriResult = await query<{ nama_kategori: string | null }>(
      `
        SELECT k.nama_kategori
        FROM pengaduan p
        LEFT JOIN kategori_pengaduan k ON p.kategori_id = k.id
        WHERE p.created_at >= $1
      `,
      [startDateIso]
    )
    const pengaduanByKategori = processKategoriData(kategoriResult.rows || [])

    // Get pengaduan by bidang
    const bidangResult = await query<{ nama_bidang: string | null }>(
      `
        SELECT b.nama_bidang
        FROM pengaduan p
        LEFT JOIN bidang b ON p.bidang_id = b.id
        WHERE p.created_at >= $1
          AND p.bidang_id IS NOT NULL
      `,
      [startDateIso]
    )
    const pengaduanByBidang = processBidangData(bidangResult.rows || [])

    // Calculate average response time (in hours)
    const completedResult = await query<{ created_at: string; updated_at: string }>(
      `
        SELECT created_at, updated_at
        FROM pengaduan
        WHERE status = $1
          AND created_at >= $2
        ORDER BY created_at DESC
        LIMIT 50
      `,
      ['selesai', startDateIso]
    )

    let avgResponseTime = 24 // Default 24 hours
    if (completedResult.rows.length > 0) {
      const totalHours = completedResult.rows.reduce((sum, p) => {
        const created = new Date(p.created_at)
        const updated = new Date(p.updated_at)
        const hours = Math.abs(updated.getTime() - created.getTime()) / 36e5
        return sum + hours
      }, 0)
      avgResponseTime = Math.round(totalHours / completedResult.rows.length)
    }

    // Calculate satisfaction rate
    let satisfaction = 95
    if (totalPengaduan > 0 && pengaduanSelesai) {
      satisfaction = Math.round((pengaduanSelesai / totalPengaduan) * 100)
    }

    const stats = {
      totalUsers,
      totalPengaduan,
      selesai: pengaduanSelesai,
      pengaduanSelesai,
      pengaduanProses,
      avgResponseTime,
      satisfaction,
      pengaduanByMonth,
      pengaduanByStatus,
      pengaduanByKategori,
      pengaduanByBidang
    }

    // Return different format based on whether it's for homepage or reports
    if (searchParams.get('format') === 'simple') {
      return NextResponse.json({
        totalUsers: stats.totalUsers,
        totalPengaduan: stats.totalPengaduan,
        selesai: stats.selesai,
        avgResponseTime: stats.avgResponseTime,
        satisfaction: stats.satisfaction
      })
    }

    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error('Error in stats API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch statistics',
        totalUsers: 0,
        totalPengaduan: 0,
        selesai: 0,
        avgResponseTime: 24,
        satisfaction: 95
      },
      { status: 500 }
    )
  }
}
