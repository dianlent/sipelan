import { NextRequest, NextResponse } from 'next/server'
import { maskName, maskEmail } from '@/lib/utils'
import { query } from '@/lib/db'

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

    const pengaduanResult = await query(
      `
        SELECT
          p.*,
          json_build_object('id', k.id, 'nama_kategori', k.nama_kategori, 'deskripsi', k.deskripsi) AS kategori_pengaduan,
          json_build_object('bidang_id', b.id, 'nama_bidang', b.nama_bidang, 'kode_bidang', b.kode_bidang) AS bidang,
          json_build_object('nama_lengkap', u.nama_lengkap, 'email', u.email) AS users
        FROM pengaduan p
        LEFT JOIN kategori_pengaduan k ON k.id = p.kategori_id
        LEFT JOIN bidang b ON b.id = p.bidang_id
        LEFT JOIN users u ON u.id = p.user_id
        WHERE p.kode_pengaduan = $1
        LIMIT 1
      `,
      [kode.toUpperCase()]
    )

    const pengaduan = pengaduanResult.rows[0]

    if (!pengaduan) {
      return NextResponse.json(
        { success: false, message: 'Pengaduan tidak ditemukan' },
        { status: 404 }
      )
    }

    const timelineResult = await query(
      `
        SELECT *
        FROM pengaduan_status
        WHERE pengaduan_id = $1
        ORDER BY created_at ASC
      `,
      [pengaduan.id]
    )

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
        nama_lengkap: maskName(pengaduan.nama_pelapor || 'Anonim'),
        email: maskEmail(pengaduan.email_pelapor || '')
      } : (pengaduan.users || {
        nama_lengkap: pengaduan.nama_pelapor,
        email: pengaduan.email_pelapor
      }),
      bidang: pengaduan.bidang,
      timeline: timelineResult.rows || [],
      anonim: pengaduan.anonim
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
