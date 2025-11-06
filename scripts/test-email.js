const nodemailer = require('nodemailer')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

async function testEmail() {
  console.log('=== TESTING EMAIL CONFIGURATION ===\n')
  
  // Check environment variables
  console.log('📋 Configuration:')
  console.log('SMTP_HOST:', process.env.SMTP_HOST || '❌ NOT SET')
  console.log('SMTP_PORT:', process.env.SMTP_PORT || '❌ NOT SET')
  console.log('SMTP_USER:', process.env.SMTP_USER || '❌ NOT SET')
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✅ SET (hidden)' : '❌ NOT SET')
  console.log('SMTP_FROM:', process.env.SMTP_FROM || 'NOT SET (will use default)')
  console.log('')

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ ERROR: SMTP configuration not complete!')
    console.log('\nPlease configure SMTP settings in .env.local:')
    console.log('SMTP_HOST=smtp.gmail.com')
    console.log('SMTP_PORT=587')
    console.log('SMTP_USER=your_email@gmail.com')
    console.log('SMTP_PASS=your_app_password')
    process.exit(1)
  }

  // Create transporter
  console.log('🔧 Creating SMTP transporter...')
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    debug: true // Enable debug output
  })

  // Test connection
  console.log('🔌 Testing SMTP connection...')
  try {
    await transporter.verify()
    console.log('✅ SMTP connection successful!\n')
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message)
    console.log('\nCommon issues:')
    console.log('- Wrong host or port')
    console.log('- Invalid credentials')
    console.log('- Firewall blocking connection')
    console.log('- 2FA not enabled (for Gmail)')
    console.log('- Not using App Password (for Gmail)')
    process.exit(1)
  }

  // Send test email
  const testEmail = process.env.SMTP_USER // Send to self
  
  console.log('📤 Sending test email...')
  console.log('To:', testEmail)
  
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
        .success-box { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Test Email Berhasil!</h1>
          <p>SIPelan - Sistem Pengaduan Layanan Online</p>
        </div>
        <div class="content">
          <div class="success-box">
            <strong>🎉 Selamat!</strong> Email notification sudah berfungsi dengan baik.
          </div>
          
          <h3>Konfigurasi SMTP:</h3>
          <div class="info-box">
            <p><strong>Host:</strong> ${process.env.SMTP_HOST}</p>
            <p><strong>Port:</strong> ${process.env.SMTP_PORT}</p>
            <p><strong>User:</strong> ${process.env.SMTP_USER}</p>
            <p><strong>From:</strong> ${process.env.SMTP_FROM || 'Default'}</p>
          </div>

          <h3>Apa Selanjutnya?</h3>
          <ul>
            <li>✅ SMTP configuration sudah benar</li>
            <li>✅ Email dapat dikirim dengan sukses</li>
            <li>✅ Template HTML ter-render dengan baik</li>
            <li>📧 Email otomatis akan dikirim saat pengaduan selesai</li>
          </ul>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            Untuk testing lengkap, coba flow berikut:
          </p>
          <ol>
            <li>Submit pengaduan di /pengaduan</li>
            <li>Admin disposisi ke bidang</li>
            <li>Bidang update status ke "Selesai"</li>
            <li>Email otomatis terkirim ke pelapor</li>
          </ol>
        </div>
        <div class="footer">
          <p>&copy; 2025 SIPelan - Dinas Ketenagakerjaan</p>
          <p style="font-size: 12px; color: #9ca3af;">
            Email test dikirim pada: ${new Date().toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"SIPelan Test" <${process.env.SMTP_USER}>`,
      to: testEmail,
      subject: '✅ Test Email SIPelan - Email Notification Working!',
      html: emailHtml
    })

    console.log('✅ Email sent successfully!')
    console.log('Message ID:', info.messageId)
    console.log('Response:', info.response)
    
    // For Ethereal Email (development testing)
    if (nodemailer.getTestMessageUrl(info)) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info))
    }
    
    console.log('\n=== TEST COMPLETE ===')
    console.log('Check your inbox:', testEmail)
    console.log('If email not received, check spam folder.')
    
  } catch (error) {
    console.error('❌ Failed to send email:', error.message)
    console.log('\nError details:', error)
    process.exit(1)
  }
}

// Run test
testEmail()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Unexpected error:', error)
    process.exit(1)
  })
