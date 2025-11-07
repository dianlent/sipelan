import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Get total users
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (usersError) {
      console.error('Error fetching users count:', usersError)
    }

    // Get total pengaduan
    const { count: totalPengaduan, error: pengaduanError } = await supabase
      .from('pengaduan')
      .select('*', { count: 'exact', head: true })

    if (pengaduanError) {
      console.error('Error fetching pengaduan count:', pengaduanError)
    }

    // Get completed pengaduan (status = 'selesai')
    const { count: selesai, error: selesaiError } = await supabase
      .from('pengaduan')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'selesai')

    if (selesaiError) {
      console.error('Error fetching selesai count:', selesaiError)
    }

    // Calculate average response time (in hours)
    // This is a simplified calculation - you may want to adjust based on your actual data
    const { data: pengaduanData, error: timeError } = await supabase
      .from('pengaduan')
      .select('created_at, updated_at, status')
      .eq('status', 'selesai')
      .limit(100)

    let avgResponseTime = 24 // Default 24 hours

    if (!timeError && pengaduanData && pengaduanData.length > 0) {
      const totalHours = pengaduanData.reduce((sum, p) => {
        const created = new Date(p.created_at)
        const updated = new Date(p.updated_at)
        const hours = Math.abs(updated.getTime() - created.getTime()) / 36e5
        return sum + hours
      }, 0)
      avgResponseTime = Math.round(totalHours / pengaduanData.length)
    }

    // Calculate satisfaction rate (based on completed vs total)
    let satisfaction = 95 // Default 95%
    if (totalPengaduan && totalPengaduan > 0 && selesai) {
      satisfaction = Math.round((selesai / totalPengaduan) * 100)
    }

    const stats = {
      totalUsers: totalUsers || 0,
      totalPengaduan: totalPengaduan || 0,
      selesai: selesai || 0,
      avgResponseTime: avgResponseTime,
      satisfaction: satisfaction
    }

    return NextResponse.json(stats)
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
