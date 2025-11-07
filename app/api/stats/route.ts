import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Helper functions
function processMonthlyData(data: any[]) {
  const monthCounts: { [key: string]: number } = {}
  
  data.forEach(item => {
    const date = new Date(item.created_at)
    const monthKey = date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
    monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1
  })

  return Object.entries(monthCounts).map(([month, count]) => ({ month, count }))
}

function processStatusData(data: any[]) {
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

function processKategoriData(data: any[]) {
  const kategoriCounts: { [key: string]: number } = {}

  data.forEach(item => {
    const kategori = item.kategori_pengaduan?.nama_kategori || 'Lainnya'
    kategoriCounts[kategori] = (kategoriCounts[kategori] || 0) + 1
  })

  return Object.entries(kategoriCounts)
    .map(([kategori, count]) => ({ kategori, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Top 5 kategori
}

function processBidangData(data: any[]) {
  const bidangCounts: { [key: string]: number } = {}

  data.forEach(item => {
    const bidang = item.bidang?.nama_bidang || 'Belum Didisposisi'
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

    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Get total pengaduan
    const { count: totalPengaduan } = await supabase
      .from('pengaduan')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString())

    // Get pengaduan selesai
    const { count: pengaduanSelesai } = await supabase
      .from('pengaduan')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'selesai')
      .gte('created_at', startDate.toISOString())

    // Get pengaduan dalam proses
    const { count: pengaduanProses } = await supabase
      .from('pengaduan')
      .select('*', { count: 'exact', head: true })
      .in('status', ['masuk', 'terverifikasi', 'terdisposisi', 'tindak_lanjut'])
      .gte('created_at', startDate.toISOString())

    // Get pengaduan by month
    const { data: monthlyData } = await supabase
      .from('pengaduan')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    const pengaduanByMonth = processMonthlyData(monthlyData || [])

    // Get pengaduan by status
    const { data: statusData } = await supabase
      .from('pengaduan')
      .select('status')
      .gte('created_at', startDate.toISOString())

    const pengaduanByStatus = processStatusData(statusData || [])

    // Get pengaduan by kategori
    const { data: kategoriData } = await supabase
      .from('pengaduan')
      .select('kategori_id, kategori_pengaduan(nama_kategori)')
      .gte('created_at', startDate.toISOString())

    const pengaduanByKategori = processKategoriData(kategoriData || [])

    // Get pengaduan by bidang
    const { data: bidangData } = await supabase
      .from('pengaduan')
      .select('bidang_id, bidang(nama_bidang)')
      .gte('created_at', startDate.toISOString())
      .not('bidang_id', 'is', null)

    const pengaduanByBidang = processBidangData(bidangData || [])

    // Calculate average response time (in hours)
    const { data: completedPengaduan } = await supabase
      .from('pengaduan')
      .select('created_at, updated_at')
      .eq('status', 'selesai')
      .gte('created_at', startDate.toISOString())
      .limit(50)

    let avgResponseTime = 24 // Default 24 hours
    if (completedPengaduan && completedPengaduan.length > 0) {
      const totalHours = completedPengaduan.reduce((sum, p) => {
        const created = new Date(p.created_at)
        const updated = new Date(p.updated_at)
        const hours = Math.abs(updated.getTime() - created.getTime()) / 36e5
        return sum + hours
      }, 0)
      avgResponseTime = Math.round(totalHours / completedPengaduan.length)
    }

    // Calculate satisfaction rate
    let satisfaction = 95
    if (totalPengaduan && totalPengaduan > 0 && pengaduanSelesai) {
      satisfaction = Math.round((pengaduanSelesai / totalPengaduan) * 100)
    }

    const stats = {
      totalUsers: totalUsers || 0,
      totalPengaduan: totalPengaduan || 0,
      selesai: pengaduanSelesai || 0,
      pengaduanSelesai: pengaduanSelesai || 0,
      pengaduanProses: pengaduanProses || 0,
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
