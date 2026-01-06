import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, generateStatusUpdateEmail } from '@/lib/email'
import { query } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const pengaduanId = params.id

    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Status harus diisi' },
        { status: 400 }
      )
    }

    const currentResult = await query(
      `
        SELECT
          p.*,
          k.nama_kategori,
          b.nama_bidang,
          b.kode_bidang
        FROM pengaduan p
        LEFT JOIN kategori_pengaduan k ON k.id = p.kategori_id
        LEFT JOIN bidang b ON b.id = p.bidang_id
        WHERE p.id = $1
        LIMIT 1
      `,
      [pengaduanId]
    )

    const currentPengaduan = currentResult.rows[0]
    const oldStatus = currentPengaduan?.status || 'masuk'

    await query(
      `
        UPDATE pengaduan
        SET status = $1,
            updated_at = NOW()
        WHERE id = $2
      `,
      [status, pengaduanId]
    )

    const pengaduanResult = await query(
      `
        SELECT
          p.*,
          json_build_object('nama_kategori', k.nama_kategori) AS kategori_pengaduan,
          json_build_object('nama_bidang', b.nama_bidang, 'kode_bidang', b.kode_bidang) AS bidang
        FROM pengaduan p
        LEFT JOIN kategori_pengaduan k ON k.id = p.kategori_id
        LEFT JOIN bidang b ON b.id = p.bidang_id
        WHERE p.id = $1
        LIMIT 1
      `,
      [pengaduanId]
    )

    const pengaduan = pengaduanResult.rows[0]

    if (!pengaduan) {
      return NextResponse.json(
        { success: false, message: 'Gagal mengupdate status' },
        { status: 500 }
      )
    }

    const statusKeterangan: Record<string, string> = {
      'masuk': 'Pengaduan telah diterima sistem dan menunggu verifikasi',
      'terverifikasi': 'Pengaduan telah diverifikasi oleh admin dan siap didisposisi',
      'terdisposisi': 'Pengaduan telah didisposisikan ke bidang terkait untuk ditindaklanjuti',
      'tindak_lanjut': 'Pengaduan sedang dalam proses penanganan oleh bidang terkait',
      'selesai': 'Pengaduan telah diselesaikan. Terima kasih atas laporan Anda'
    }

    await query(
      `
        INSERT INTO pengaduan_status (pengaduan_id, status, keterangan, created_at)
        VALUES ($1, $2, $3, NOW())
      `,
      [
        pengaduanId,
        status,
        statusKeterangan[status] || 'Status pengaduan diupdate'
      ]
    )

    if (!pengaduan.anonim && pengaduan.email_pelapor && oldStatus !== status) {
      try {
        const emailHtml = generateStatusUpdateEmail(pengaduan, oldStatus, status, pengaduan.email_pelapor)
        const emailResult = await sendEmail(
          pengaduan.email_pelapor,
          `Update Status Pengaduan - ${pengaduan.kode_pengaduan}`,
          emailHtml
        )
        
        if (emailResult.success) {
          console.log(`ƒo. Email notification sent to ${pengaduan.email_pelapor} for status change: ${oldStatus} -> ${status}`)
        } else {
          console.error('ƒ?O Failed to send email notification:', emailResult.error)
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: !pengaduan.anonim && pengaduan.email_pelapor
        ? 'Status berhasil diupdate dan notifikasi email telah dikirim'
        : 'Status berhasil diupdate',
      data: pengaduan
    })

  } catch (error) {
    console.error('Status update error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
