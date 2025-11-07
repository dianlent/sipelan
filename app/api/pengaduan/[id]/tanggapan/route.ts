import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { tanggapan, petugas, status } = await request.json()
    const pengaduanId = params.id

    if (!tanggapan || !petugas) {
      return NextResponse.json(
        { success: false, message: 'Tanggapan dan nama petugas harus diisi' },
        { status: 400 }
      )
    }

    // Insert new status with tanggapan
    const { data: newStatus, error: statusError } = await supabaseAdmin
      .from('pengaduan_status')
      .insert({
        pengaduan_id: pengaduanId,
        status: status,
        keterangan: `Tanggapan dari ${petugas}`,
        tanggapan: tanggapan,
        petugas: petugas
      })
      .select()
      .single()

    if (statusError) {
      console.error('Error inserting status:', statusError)
      return NextResponse.json(
        { success: false, message: 'Gagal menambahkan tanggapan' },
        { status: 500 }
      )
    }

    // Update pengaduan status if provided
    if (status) {
      const { error: updateError } = await supabaseAdmin
        .from('pengaduan')
        .update({ status: status })
        .eq('id', pengaduanId)

      if (updateError) {
        console.error('Error updating pengaduan status:', updateError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Tanggapan berhasil ditambahkan',
      data: newStatus
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server: ' + error.message },
      { status: 500 }
    )
  }
}
