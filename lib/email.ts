import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: `"SIPelan Disnaker" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    })
    
    console.log('Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export function generatePengaduanCreatedEmail(pengaduan: any, userEmail: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Pengaduan Diterima - ${pengaduan.kode_pengaduan}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px 20px; }
        .status-badge { 
          background: #10b981; 
          color: white; 
          padding: 8px 16px; 
          border-radius: 20px; 
          display: inline-block;
          font-weight: bold;
          font-size: 14px;
        }
        .info-box { 
          background: #f3f4f6; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0;
          border-left: 4px solid #667eea;
        }
        .info-box p { margin: 8px 0; }
        .info-box strong { color: #667eea; }
        .button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer { 
          background: #1f2937; 
          color: #9ca3af; 
          padding: 20px; 
          text-align: center; 
          font-size: 12px; 
        }
        .tracking-code {
          background: #fef3c7;
          border: 2px dashed #f59e0b;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
        }
        .tracking-code strong {
          font-size: 20px;
          color: #d97706;
          letter-spacing: 2px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Pengaduan Berhasil Diterima</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px;">SIPelan - Sistem Pengaduan Online Disnaker</p>
        </div>
        <div class="content">
          <p>Yth. Bapak/Ibu,</p>
          <p>Terima kasih telah menyampaikan pengaduan Anda melalui sistem kami. Pengaduan Anda telah berhasil diterima dan akan segera diproses.</p>
          
          <div class="tracking-code">
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #92400e;">Kode Tracking Pengaduan:</p>
            <strong>${pengaduan.kode_pengaduan}</strong>
            <p style="margin: 10px 0 0 0; font-size: 11px; color: #92400e;">Simpan kode ini untuk melacak status pengaduan Anda</p>
          </div>

          <div class="info-box">
            <p><strong>Judul Pengaduan:</strong><br>${pengaduan.judul_pengaduan}</p>
            <p><strong>Status:</strong> <span class="status-badge">DITERIMA</span></p>
            <p><strong>Tanggal Pengaduan:</strong> ${new Date(pengaduan.created_at).toLocaleString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>

          <p><strong>Langkah Selanjutnya:</strong></p>
          <ol style="padding-left: 20px;">
            <li>Tim kami akan melakukan verifikasi terhadap pengaduan Anda</li>
            <li>Pengaduan akan didisposisikan ke bidang terkait</li>
            <li>Anda akan menerima notifikasi email setiap ada update status</li>
            <li>Gunakan kode tracking untuk memantau progress pengaduan</li>
          </ol>

          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/tracking?kode=${pengaduan.kode_pengaduan}" class="button">
              🔍 Lacak Status Pengaduan
            </a>
          </div>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 13px;">
            <strong>Catatan:</strong> Email ini dikirim secara otomatis. Mohon tidak membalas email ini. Jika Anda memiliki pertanyaan, silakan hubungi kami melalui sistem atau kontak yang tersedia.
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0 0 10px 0;"><strong>Dinas Ketenagakerjaan</strong></p>
          <p style="margin: 0;">Jl. Contoh No. 123, Kota, Provinsi</p>
          <p style="margin: 5px 0;">📞 (021) 1234-5678 | 📧 info@disnaker.go.id</p>
          <p style="margin: 15px 0 0 0;">&copy; 2024 Dinas Ketenagakerjaan. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateStatusUpdateEmail(pengaduan: any, oldStatus: string, newStatus: string, userEmail: string) {
  const statusLabels: { [key: string]: string } = {
    'masuk': 'Pengaduan Masuk',
    'terverifikasi': 'Terverifikasi',
    'terdisposisi': 'Terdisposisi',
    'tindak_lanjut': 'Dalam Tindak Lanjut',
    'selesai': 'Selesai'
  }

  const statusColors: { [key: string]: string } = {
    'masuk': '#3b82f6',
    'terverifikasi': '#10b981',
    'terdisposisi': '#f59e0b',
    'tindak_lanjut': '#8b5cf6',
    'selesai': '#059669'
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Update Status Pengaduan - ${pengaduan.kode_pengaduan}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px 20px; }
        .status-badge { 
          color: white; 
          padding: 8px 16px; 
          border-radius: 20px; 
          display: inline-block;
          font-weight: bold;
          font-size: 14px;
        }
        .info-box { 
          background: #f3f4f6; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0;
          border-left: 4px solid #667eea;
        }
        .status-update {
          background: #fef3c7;
          border: 2px solid #f59e0b;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          text-align: center;
        }
        .button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer { 
          background: #1f2937; 
          color: #9ca3af; 
          padding: 20px; 
          text-align: center; 
          font-size: 12px; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 Update Status Pengaduan</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px;">SIPelan - Sistem Pengaduan Online Disnaker</p>
        </div>
        <div class="content">
          <p>Yth. Bapak/Ibu,</p>
          <p>Ada update terbaru untuk pengaduan Anda:</p>
          
          <div class="status-update">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #92400e;">Status Berubah Dari:</p>
            <span class="status-badge" style="background: ${statusColors[oldStatus] || '#6b7280'}">
              ${statusLabels[oldStatus] || oldStatus}
            </span>
            <p style="margin: 15px 0 10px 0; font-size: 18px;">⬇️</p>
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #92400e;">Menjadi:</p>
            <span class="status-badge" style="background: ${statusColors[newStatus] || '#6b7280'}">
              ${statusLabels[newStatus] || newStatus}
            </span>
          </div>

          <div class="info-box">
            <p><strong>Kode Pengaduan:</strong> ${pengaduan.kode_pengaduan}</p>
            <p><strong>Judul:</strong> ${pengaduan.judul_pengaduan}</p>
            <p><strong>Tanggal Update:</strong> ${new Date().toLocaleString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/tracking?kode=${pengaduan.kode_pengaduan}" class="button">
              🔍 Lihat Detail Pengaduan
            </a>
          </div>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 13px;">
            Terima kasih atas kesabaran Anda. Kami akan terus memberikan update melalui email ini.
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0 0 10px 0;"><strong>Dinas Ketenagakerjaan</strong></p>
          <p style="margin: 0;">Jl. Contoh No. 123, Kota, Provinsi</p>
          <p style="margin: 5px 0;">📞 (021) 1234-5678 | 📧 info@disnaker.go.id</p>
          <p style="margin: 15px 0 0 0;">&copy; 2024 Dinas Ketenagakerjaan. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
