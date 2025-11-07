import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { nama_bidang, kode_bidang, deskripsi } = body
    const id = params.id

    if (!nama_bidang || !kode_bidang) {
      return NextResponse.json({
        success: false,
        message: 'Nama dan kode bidang harus diisi'
      }, { status: 400 })
    }

    // Check if kode already exists for other bidang
    const { data: existing } = await supabase
      .from('bidang')
      .select('id')
      .eq('kode_bidang', kode_bidang)
      .neq('id', id)
      .single()

    if (existing) {
      return NextResponse.json({
        success: false,
        message: 'Kode bidang sudah digunakan'
      }, { status: 400 })
    }

    const { data: updatedBidang, error } = await supabase
      .from('bidang')
      .update({
        nama_bidang,
        kode_bidang,
        deskripsi
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Bidang berhasil diupdate',
      data: updatedBidang
    })
  } catch (error: any) {
    console.error('Update bidang error:', error)
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    // Check if bidang has users
    const { data: users } = await supabase
      .from('users')
      .select('id')
      .eq('bidang_id', id)
      .limit(1)

    if (users && users.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Tidak dapat menghapus bidang yang masih memiliki user'
      }, { status: 400 })
    }

    // Check if bidang has pengaduan
    const { data: pengaduan } = await supabase
      .from('pengaduan')
      .select('id')
      .eq('bidang_id', id)
      .limit(1)

    if (pengaduan && pengaduan.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Tidak dapat menghapus bidang yang masih memiliki pengaduan'
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('bidang')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Bidang berhasil dihapus'
    })
  } catch (error: any) {
    console.error('Delete bidang error:', error)
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 })
  }
}
