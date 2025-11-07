import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { kode: string } }
) {
  try {
    const kode = params.kode

    if (!kode) {
      return NextResponse.json(
        { success: false, message: 'Kode pengaduan tidak valid' },
        { status: 400 }
      )
    }

    // Fetch pengaduan with related data
    const { data: pengaduan, error: pengaduanError } = await supabaseAdmin
      .from('pengaduan')
      .select(`
        *,
        kategori_pengaduan (
          id,
          nama_kategori,
          deskripsi
        ),
        bidang (
          bidang_id,
          nama_bidang,
          kode_bidang
        ),
        users (
          nama_lengkap,
          email
        )
      `)
      .eq('kode_pengaduan', kode.toUpperCase())
      .single()

    if (pengaduanError || !pengaduan) {
      return NextResponse.json(
        { success: false, message: 'Pengaduan tidak ditemukan' },
        { status: 404 }
      )
    }

    // Fetch timeline with tanggapan and petugas
    const { data: timeline, error: timelineError } = await supabaseAdmin
      .from('pengaduan_status')
      .select('*, tanggapan, petugas')
      .eq('pengaduan_id', pengaduan.id)
      .order('created_at', { ascending: true })

    if (timelineError) {
      console.error('Timeline error:', timelineError)
    }

    // Prepare response data
    const responseData = {
      id: pengaduan.id,
      kode_pengaduan: pengaduan.kode_pengaduan,
      judul_pengaduan: pengaduan.judul_pengaduan,
      isi_pengaduan: pengaduan.isi_pengaduan,
      kategori: pengaduan.kategori_pengaduan?.nama_kategori || 'Tidak ada kategori',
      status: pengaduan.status,
      lokasi_kejadian: pengaduan.lokasi_kejadian,
      tanggal_kejadian: pengaduan.tanggal_kejadian,
      file_bukti: pengaduan.file_bukti,
      created_at: pengaduan.created_at,
      user: pengaduan.anonim ? {
        nama_lengkap: 'Anonim',
        email: ''
      } : (pengaduan.users || {
        nama_lengkap: pengaduan.nama_pelapor,
        email: pengaduan.email_pelapor
      }),
      bidang: pengaduan.bidang,
      timeline: timeline || []
    }

    return NextResponse.json({
      success: true,
      data: responseData
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server: ' + error.message },
      { status: 500 }
    )
  }
}
