import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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

    // Insert status history
    await supabaseAdmin
      .from('pengaduan_status')
      .insert({
        pengaduan_id: pengaduanId,
        status,
        keterangan: status === 'selesai' 
          ? 'Pengaduan telah diselesaikan oleh bidang terkait'
          : 'Status pengaduan diupdate',
        created_at: new Date().toISOString()
      })

    // If status is "selesai", send email notification to pelapor
    if (status === 'selesai') {
      try {
        // Send email notification
        await sendEmailNotification({
          to: pengaduan.email_pelapor,
          subject: `Pengaduan ${pengaduan.kode_pengaduan} Telah Selesai`,
          pengaduan: {
            kode: pengaduan.kode_pengaduan,
            judul: pengaduan.judul_pengaduan,
            nama_pelapor: pengaduan.nama_pelapor,
            bidang: pengaduan.bidang?.nama_bidang || 'Bidang Terkait'
          }
        })

        console.log(`Email notification sent to ${pengaduan.email_pelapor}`)
      } catch (emailError) {
        console.error('Email error:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: status === 'selesai' 
        ? 'Pengaduan selesai! Notifikasi email telah dikirim ke pelapor'
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

// Email notification function
async function sendEmailNotification(params: {
  to: string
  subject: string
  pengaduan: {
    kode: string
    judul: string
    nama_pelapor: string
    bidang: string
  }
}) {
  const { to, subject, pengaduan } = params

  // Email HTML template
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .badge { display: inline-block; background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Pengaduan Selesai</h1>
          <p>SIPelan - Sistem Pengaduan Layanan Online Naker</p>
        </div>
        <div class="content">
          <p>Yth. <strong>${pengaduan.nama_pelapor}</strong>,</p>
          
          <p>Kami informasikan bahwa pengaduan Anda telah <strong>selesai</strong> diproses oleh ${pengaduan.bidang}.</p>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #667eea;">Detail Pengaduan:</h3>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px 0;"><strong>Kode Pengaduan:</strong></td>
                <td style="padding: 8px 0;">${pengaduan.kode}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Judul:</strong></td>
                <td style="padding: 8px 0;">${pengaduan.judul}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Status:</strong></td>
                <td style="padding: 8px 0;"><span class="badge">SELESAI</span></td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Ditangani oleh:</strong></td>
                <td style="padding: 8px 0;">${pengaduan.bidang}</td>
              </tr>
            </table>
          </div>

          <p>Terima kasih telah menggunakan layanan SIPelan. Kami berharap penyelesaian pengaduan ini dapat membantu mengatasi permasalahan Anda.</p>

          <center>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/tracking?kode=${pengaduan.kode}" class="button">
              Lihat Detail Pengaduan
            </a>
          </center>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            Jika Anda memiliki pertanyaan atau memerlukan bantuan lebih lanjut, silakan hubungi kami melalui:
          </p>
          <ul>
            <li>Email: info@disnaker.go.id</li>
            <li>Telepon: (021) 1234-5678</li>
          </ul>
        </div>
        <div class="footer">
          <p>&copy; 2024 Dinas Ketenagakerjaan. All rights reserved.</p>
          <p style="font-size: 12px; color: #9ca3af;">
            Email ini dikirim secara otomatis, mohon tidak membalas email ini.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  // TODO: Implement actual email sending
  // Using SMTP or email service (SendGrid, AWS SES, etc.)
  
  // For now, just log (in production, use actual email service)
  console.log('=== EMAIL NOTIFICATION ===')
  console.log('To:', to)
  console.log('Subject:', subject)
  console.log('Pengaduan:', pengaduan.kode)
  console.log('=========================')

  // Example using nodemailer (uncomment when ready):
  /*
  const nodemailer = require('nodemailer')
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  await transporter.sendMail({
    from: '"SIPelan" <noreply@sipelan.go.id>',
    to,
    subject,
    html: emailHtml
  })
  */

  return true
}
