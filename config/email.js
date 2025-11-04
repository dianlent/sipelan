const nodemailer = require('nodemailer');

const emailConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};

const transporter = nodemailer.createTransport(emailConfig);

const sendEmail = async (to, subject, html, attachments = []) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to,
            subject,
            html,
            attachments
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const generatePengaduanEmailTemplate = (pengaduan, status) => {
    const statusColor = {
        'diterima': '#28a745',
        'di proses': '#ffc107',
        'selesai': '#17a2b8'
    };

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Status Pengaduan - ${pengaduan.kode_pengaduan}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .status-badge { 
                    background: ${statusColor[status] || '#6c757d'}; 
                    color: white; 
                    padding: 5px 15px; 
                    border-radius: 20px; 
                    display: inline-block;
                    font-weight: bold;
                }
                .footer { background: #333; color: white; padding: 10px; text-align: center; font-size: 12px; }
                .info-box { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>SIPelan - Sistem Pengaduan Layanan Online Naker</h1>
                </div>
                <div class="content">
                    <h2>Update Status Pengaduan</h2>
                    <div class="info-box">
                        <p><strong>Kode Pengaduan:</strong> ${pengaduan.kode_pengaduan}</p>
                        <p><strong>Judul:</strong> ${pengaduan.judul_pengaduan}</p>
                        <p><strong>Status:</strong> <span class="status-badge">${status.toUpperCase()}</span></p>
                        <p><strong>Tanggal Update:</strong> ${new Date().toLocaleString('id-ID')}</p>
                    </div>
                    <p>Pengaduan Anda telah diperbarui. Silakan login ke sistem untuk melihat detail lengkapnya.</p>
                    <p>Terima kasih telah menggunakan layanan kami.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Dinas Ketenagakerjaan. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

const generateDisposisiEmailTemplate = (pengaduan, dariBidang, keBidang) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Disposisi Pengaduan - ${pengaduan.kode_pengaduan}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .disposisi-box { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #ffc107; }
                .footer { background: #333; color: white; padding: 10px; text-align: center; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>SIPelan - Sistem Pengaduan Layanan Online Naker</h1>
                </div>
                <div class="content">
                    <h2>Pengaduan Baru Di disposisikan</h2>
                    <div class="disposisi-box">
                        <p><strong>Kode Pengaduan:</strong> ${pengaduan.kode_pengaduan}</p>
                        <p><strong>Judul:</strong> ${pengaduan.judul_pengaduan}</p>
                        <p><strong>Dari Bidang:</strong> ${dariBidang}</p>
                        <p><strong>Ke Bidang:</strong> ${keBidang}</p>
                        <p><strong>Tanggal Disposisi:</strong> ${new Date().toLocaleString('id-ID')}</p>
                    </div>
                    <p>Ada pengaduan baru yang di disposisikan ke bidang Anda. Silakan login ke sistem untuk menindaklanjuti.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Dinas Ketenagakerjaan. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

module.exports = {
    sendEmail,
    generatePengaduanEmailTemplate,
    generateDisposisiEmailTemplate
};
