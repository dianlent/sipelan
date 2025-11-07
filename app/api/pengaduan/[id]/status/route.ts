import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEmail, generateStatusUpdateEmail } from '@/lib/email'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, kode_bidang } = await request.json()
    const pengaduanId = params.id

    // Validate input
    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Status harus diisi' },
        { status: 400 }
      )
    }

    // Get current pengaduan data first (to get old status)
    const { data: currentPengaduan } = await supabaseAdmin
      .from('pengaduan')
      .select('*, kategori_pengaduan (nama_kategori), bidang (nama_bidang, kode_bidang)')
      .eq('id', pengaduanId)
      .single()

    const oldStatus = currentPengaduan?.status || 'masuk'

    // Update status in database
    const { data: pengaduan, error: updateError } = await supabaseAdmin
      .from('pengaduan')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', pengaduanId)
      .select(`
        *,
        kategori_pengaduan (nama_kategori),
        bidang (nama_bidang, kode_bidang)
      `)
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { success: false, message: 'Gagal mengupdate status' },
        { status: 500 }
      )
    }

    // Status keterangan mapping
    const statusKeterangan: Record<string, string> = {
      'masuk': 'Pengaduan telah diterima sistem dan menunggu verifikasi',
      'terverifikasi': 'Pengaduan telah diverifikasi oleh admin dan siap didisposisi',
      'terdisposisi': 'Pengaduan telah didisposisikan ke bidang terkait untuk ditindaklanjuti',
      'tindak_lanjut': 'Pengaduan sedang dalam proses penanganan oleh bidang terkait',
      'selesai': 'Pengaduan telah diselesaikan. Terima kasih atas laporan Anda'
    }

    // Insert status history
    const { error: statusHistoryError } = await supabaseAdmin
      .from('pengaduan_status')
      .insert([{
        pengaduan_id: pengaduanId,
        status,
        keterangan: statusKeterangan[status] || 'Status pengaduan diupdate',
        created_at: new Date().toISOString()
      }])

    // Send email notification to reporter (if not anonymous and status changed)
    if (!pengaduan.anonim && pengaduan.email_pelapor && oldStatus !== status) {
      try {
        const emailHtml = generateStatusUpdateEmail(pengaduan, oldStatus, status, pengaduan.email_pelapor)
        const emailResult = await sendEmail(
          pengaduan.email_pelapor,
          `Update Status Pengaduan - ${pengaduan.kode_pengaduan}`,
          emailHtml
        )
        
        if (emailResult.success) {
          console.log(`✅ Email notification sent to ${pengaduan.email_pelapor} for status change: ${oldStatus} → ${status}`)
        } else {
          console.error('❌ Failed to send email notification:', emailResult.error)
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError)
        // Don't fail the request if email fails
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
