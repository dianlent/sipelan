import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Create new disposisi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pengaduan_id, dari_bidang_id, ke_bidang_id, keterangan, user_id } = body

    // Validate required fields
    if (!pengaduan_id || !ke_bidang_id || !keterangan) {
      return NextResponse.json(
        { success: false, message: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    console.log('=== CREATING DISPOSISI ===')
    console.log('Pengaduan ID:', pengaduan_id)
    console.log('Ke Bidang ID:', ke_bidang_id)
    console.log('Keterangan:', keterangan)

    // Insert disposisi record
    const { data: disposisi, error: disposisiError } = await supabaseAdmin
      .from('disposisi')
      .insert([{
        pengaduan_id,
        dari_bidang_id: dari_bidang_id || null,
        ke_bidang_id,
        keterangan,
        user_id: user_id || null,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (disposisiError) {
      console.error('Disposisi error:', disposisiError)
      return NextResponse.json(
        { success: false, message: 'Gagal menyimpan disposisi: ' + disposisiError.message },
        { status: 500 }
      )
    }

    console.log('✅ Disposisi created:', disposisi)

    console.log('=== UPDATING PENGADUAN ===')
    console.log('Setting bidang_id to:', ke_bidang_id)
    console.log('Setting status to: terdisposisi')

    // Update pengaduan with bidang_id and status
    const { data: pengaduan, error: updateError } = await supabaseAdmin
      .from('pengaduan')
      .update({
        bidang_id: ke_bidang_id,
        status: 'terdisposisi',
        updated_at: new Date().toISOString()
      })
      .eq('id', pengaduan_id)
      .select(`
        *,
        kategori_pengaduan (nama_kategori),
        bidang (bidang_id, nama_bidang, kode_bidang)
      `)
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { success: false, message: 'Gagal update pengaduan: ' + updateError.message },
        { status: 500 }
      )
    }

    console.log('✅ Pengaduan updated:', {
      id: pengaduan.id,
      kode: pengaduan.kode_pengaduan,
      bidang_id: pengaduan.bidang_id,
      status: pengaduan.status,
      bidang: pengaduan.bidang?.nama_bidang
    })

    // Insert status history
    const { error: statusError } = await supabaseAdmin
      .from('pengaduan_status')
      .insert([{
        pengaduan_id,
        status: 'terdisposisi',
        keterangan: `Pengaduan didisposisikan ke ${pengaduan.bidang?.nama_bidang}. ${keterangan}`,
        user_id: user_id || null,
        created_at: new Date().toISOString()
      }])

    if (statusError) {
      console.error('Status error:', statusError)
      // Don't fail the request if status insert fails
    }

    return NextResponse.json({
      success: true,
      message: `Pengaduan berhasil didisposisikan ke ${pengaduan.bidang?.nama_bidang}`,
      data: {
        disposisi,
        pengaduan
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server: ' + error.message },
      { status: 500 }
    )
  }
}

// GET - Get disposisi history for pengaduan
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pengaduan_id = searchParams.get('pengaduan_id')

    if (!pengaduan_id) {
      return NextResponse.json(
        { success: false, message: 'pengaduan_id diperlukan' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('disposisi')
      .select(`
        *,
        dari_bidang:dari_bidang_id (
          bidang_id,
          nama_bidang,
          kode_bidang
        ),
        ke_bidang:ke_bidang_id (
          bidang_id,
          nama_bidang,
          kode_bidang
        ),
        users (
          nama_lengkap,
          email
        )
      `)
      .eq('pengaduan_id', pengaduan_id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
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
