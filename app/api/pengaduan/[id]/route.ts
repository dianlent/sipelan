import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET single pengaduan by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    const { data, error } = await supabaseAdmin
      .from('pengaduan')
      .select(`
        *,
        kategori_pengaduan (
          id,
          nama_kategori,
          deskripsi
        ),
        bidang (
          id,
          nama_bidang,
          kode_bidang
        ),
        users (
          nama_lengkap,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: 'Pengaduan tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

// PATCH - Update pengaduan
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()

    const { data, error } = await supabaseAdmin
      .from('pengaduan')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Pengaduan berhasil diupdate'
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

// DELETE pengaduan
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    const { error } = await supabaseAdmin
      .from('pengaduan')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Pengaduan berhasil dihapus'
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
