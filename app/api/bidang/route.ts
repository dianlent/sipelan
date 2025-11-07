import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    // Get all bidang
    const { data: bidangList, error } = await supabase
      .from('bidang')
      .select('*')
      .order('id', { ascending: true })

    if (error) throw error

    // Get counts for each bidang
    const bidangWithCounts = await Promise.all(
      (bidangList || []).map(async (bidang) => {
        // Count users in this bidang
        const { count: userCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('bidang_id', bidang.id)

        // Count pengaduan in this bidang
        const { count: pengaduanCount } = await supabase
          .from('pengaduan')
          .select('*', { count: 'exact', head: true })
          .eq('bidang_id', bidang.id)

        return {
          ...bidang,
          user_count: userCount || 0,
          pengaduan_count: pengaduanCount || 0
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: bidangWithCounts
    })
  } catch (error: any) {
    console.error('Get bidang error:', error)
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nama_bidang, kode_bidang, deskripsi } = body

    if (!nama_bidang || !kode_bidang) {
      return NextResponse.json({
        success: false,
        message: 'Nama dan kode bidang harus diisi'
      }, { status: 400 })
    }

    // Check if kode already exists
    const { data: existing } = await supabase
      .from('bidang')
      .select('id')
      .eq('kode_bidang', kode_bidang)
      .single()

    if (existing) {
      return NextResponse.json({
        success: false,
        message: 'Kode bidang sudah digunakan'
      }, { status: 400 })
    }

    const { data: newBidang, error } = await supabase
      .from('bidang')
      .insert([{
        nama_bidang,
        kode_bidang,
        deskripsi
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Bidang berhasil ditambahkan',
      data: newBidang
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create bidang error:', error)
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 })
  }
}
