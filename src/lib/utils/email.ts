import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}

export function pengaduanDiterimaEmail(nama: string, ticketNumber: string, kategori: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .ticket { background: #EFF6FF; border: 2px solid #3B82F6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .ticket-number { font-size: 24px; font-weight: bold; color: #2563EB; font-family: monospace; }
        .info-box { background: white; border-left: 4px solid #3B82F6; padding: 15px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6B7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SIPELAN</h1>
          <p>Sistem Pengaduan Layanan Disnaker Pati</p>
        </div>
        <div class="content">
          <h2>Pengaduan Anda Telah Diterima</h2>
          <p>Kepada Yth. <strong>${nama}</strong>,</p>
          <p>Terima kasih telah menggunakan layanan SIPELAN. Pengaduan Anda telah kami terima dan terdaftar dalam sistem kami.</p>
          
          <div class="ticket">
            <p style="margin: 0; color: #6B7280;">Nomor Tiket Anda</p>
            <div class="ticket-number">${ticketNumber}</div>
          </div>
          
          <div class="info-box">
            <strong>Detail Pengaduan:</strong><br>
            Kategori: ${kategori}<br>
            Tanggal: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          
          <h3>Informasi Penting:</h3>
          <ul>
            <li>Pengaduan akan ditindaklanjuti maksimal <strong>3x24 jam kerja</strong></li>
            <li>Anda akan menerima notifikasi email untuk setiap update status</li>
            <li>Gunakan nomor tiket di atas untuk melacak status pengaduan</li>
            <li>Identitas Anda akan dijaga kerahasiaannya</li>
          </ul>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/lacak-aduan?ticket=${ticketNumber}" 
               style="background: #2563EB; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Lacak Pengaduan Anda
            </a>
          </p>
          
          <div class="footer">
            <p>Email ini dikirim otomatis oleh sistem SIPELAN.<br>
            Jika ada pertanyaan, hubungi kami di (0295) 123456</p>
            <p>&copy; 2024 Dinas Tenaga Kerja Kabupaten Pati</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function statusUpdateEmail(nama: string, ticketNumber: string, status: string, keterangan: string) {
  const statusText = {
    PENDING: 'Menunggu Verifikasi',
    DIPROSES: 'Sedang Diproses',
    SELESAI: 'Selesai',
    DITOLAK: 'Ditolak',
  }[status] || status;
  
  const statusColor = {
    PENDING: '#F59E0B',
    DIPROSES: '#3B82F6',
    SELESAI: '#10B981',
    DITOLAK: '#EF4444',
  }[status] || '#6B7280';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .status-badge { background: ${statusColor}; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; }
        .info-box { background: white; border-left: 4px solid #3B82F6; padding: 15px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6B7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Update Status Pengaduan</h1>
          <p>SIPELAN - Disnaker Pati</p>
        </div>
        <div class="content">
          <p>Kepada Yth. <strong>${nama}</strong>,</p>
          <p>Status pengaduan Anda telah diperbarui.</p>
          
          <div class="info-box">
            <strong>Nomor Tiket:</strong> ${ticketNumber}<br>
            <strong>Status Baru:</strong> <span class="status-badge">${statusText}</span>
          </div>
          
          <div class="info-box">
            <strong>Keterangan:</strong><br>
            ${keterangan}
          </div>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/lacak-aduan?ticket=${ticketNumber}" 
               style="background: #2563EB; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Lihat Detail Pengaduan
            </a>
          </p>
          
          <div class="footer">
            <p>Email ini dikirim otomatis oleh sistem SIPELAN.<br>
            Jika ada pertanyaan, hubungi kami di (0295) 123456</p>
            <p>&copy; 2024 Dinas Tenaga Kerja Kabupaten Pati</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
