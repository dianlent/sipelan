# Email Notification Setup Guide

## 📧 Overview

Sistem SIPelan mengirimkan email notifikasi otomatis ke pelapor saat pengaduan selesai diproses. Email menggunakan template HTML yang profesional dan informatif.

## ⚙️ Konfigurasi

### 1. Update File `.env.local`

Buat atau update file `.env.local` dengan konfigurasi SMTP:

```env
# Email Notification Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="SIPelan" <noreply@sipelan.go.id>
```

### 2. Restart Dev Server

Setelah update `.env.local`, restart development server:

```bash
npm run dev
```

## 📮 Email Providers

### Gmail

**Setup:**
1. Aktifkan 2-Factor Authentication di akun Gmail
2. Buat App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Generate password untuk "Mail" atau "Other"
   - Copy password (16 karakter tanpa spasi)

**Configuration:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_app_password
SMTP_FROM="SIPelan" <your_email@gmail.com>
```

**Notes:**
- Jangan gunakan password akun biasa
- Gunakan App Password khusus
- Gmail limit: 500 emails/day (free account)

### Microsoft Outlook / Office 365

**Configuration:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_account_password
SMTP_FROM="SIPelan" <your_email@outlook.com>
```

**Notes:**
- Gunakan password akun Outlook
- Support custom domain Office 365
- Limit: 300 emails/day

### SendGrid (Recommended for Production)

**Setup:**
1. Daftar di https://sendgrid.com (Free tier: 100 emails/day)
2. Buat API Key di Settings → API Keys
3. Verify sender identity

**Configuration:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.your_sendgrid_api_key
SMTP_FROM="SIPelan" <verified_sender@yourdomain.com>
```

**Notes:**
- `SMTP_USER` harus "apikey" (fixed value)
- Free tier: 100 emails/day
- Paid plans mulai dari $14.95/month
- Tracking & analytics included

### AWS SES (Recommended for Production)

**Setup:**
1. Setup AWS account
2. Verify email atau domain di SES
3. Generate SMTP credentials
4. Move out of sandbox (untuk production)

**Configuration:**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM="SIPelan" <verified@yourdomain.com>
```

**Notes:**
- Sangat murah: $0.10 per 1,000 emails
- High deliverability
- Requires AWS account
- Need domain verification

### Mailgun

**Configuration:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your_mailgun_domain
SMTP_PASS=your_mailgun_smtp_password
SMTP_FROM="SIPelan" <no-reply@your_mailgun_domain>
```

**Notes:**
- Free tier: 5,000 emails/month
- Good deliverability
- Easy setup

## 🔍 Testing Email

### Test di Development

1. **Submit Pengaduan** di http://localhost:5000/pengaduan
2. **Admin Disposisi** pengaduan ke bidang
3. **Bidang Set Status** ke "Selesai"
4. **Check Console** untuk log:
   ```
   === EMAIL NOTIFICATION ===
   To: pelapor@example.com
   Subject: Pengaduan ADU-2025-0001 Telah Selesai
   ✅ Email sent successfully to: pelapor@example.com
   ```

### Test SMTP Connection

Buat file test di `scripts/test-email.js`:

```javascript
const nodemailer = require('nodemailer')
require('dotenv').config({ path: '.env.local' })

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'test@example.com', // Ganti dengan email Anda
      subject: 'Test Email SIPelan',
      html: '<h1>Test Email Berhasil!</h1><p>SMTP configuration bekerja dengan baik.</p>'
    })

    console.log('✅ Email sent:', info.messageId)
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info))
  } catch (error) {
    console.error('❌ Email failed:', error.message)
  }
}

testEmail()
```

Run test:
```bash
node scripts/test-email.js
```

## 📝 Email Template

### Template Features
- ✅ Responsive design
- ✅ Professional gradient header
- ✅ Clear information box
- ✅ Status badge
- ✅ Call-to-action button
- ✅ Contact information
- ✅ Footer dengan branding

### Template Preview

Email berisi:
1. **Header**: Logo & judul dengan gradient
2. **Greeting**: Sapaan personal ke nama pelapor
3. **Info Box**: Detail pengaduan (kode, judul, status, bidang)
4. **CTA Button**: Link ke tracking page
5. **Contact Info**: Email & telepon Disnaker
6. **Footer**: Branding & disclaimer

### Customize Template

Edit di file: `app/api/pengaduan/[id]/status/route.ts`

```typescript
const emailHtml = `
  <!DOCTYPE html>
  <html>
    <!-- Your custom HTML here -->
  </html>
`
```

## 🚨 Troubleshooting

### Email tidak terkirim

**Check 1: SMTP Configuration**
```bash
# Pastikan semua var ada di .env.local
echo $SMTP_HOST
echo $SMTP_USER
echo $SMTP_PASS
```

**Check 2: Console Logs**
```
⚠️  SMTP not configured - Email not sent (logging only)
```
→ Environment variables tidak ter-load. Restart server.

**Check 3: Authentication Error**
```
❌ Failed to send email: Invalid login
```
→ Username/password salah. Check credentials.

**Check 4: Connection Timeout**
```
❌ Failed to send email: Connection timeout
```
→ SMTP host/port salah atau firewall blocking.

### Email masuk spam

**Solutions:**
1. **Verify Sender**: Setup SPF, DKIM, DMARC records
2. **Use Verified Domain**: Jangan pakai free email sebagai sender
3. **Professional Provider**: Gunakan SendGrid/AWS SES
4. **Warm Up**: Mulai dengan email sedikit, tingkatkan gradually

### Gmail App Password tidak bisa dibuat

**Causes:**
- 2FA belum aktif → Aktifkan 2FA dulu
- Less secure app access ON → Matikan, gunakan App Password
- Workspace account → Admin harus enable di Google Admin Console

## 📊 Email Status Tracking

### Check Email Sent

Di console log saat status update ke "selesai":
```
=== EMAIL NOTIFICATION ===
To: john@example.com
Subject: Pengaduan ADU-2025-0001 Telah Selesai
Pengaduan: ADU-2025-0001
✅ Email sent successfully to: john@example.com
=========================
```

### Database Record

Email send tidak ter-record di database. Hanya logged di console.

**Optional**: Add email_logs table untuk tracking:
```sql
CREATE TABLE email_logs (
  id SERIAL PRIMARY KEY,
  pengaduan_id UUID REFERENCES pengaduan(id),
  to_email VARCHAR(255),
  subject TEXT,
  status VARCHAR(20), -- sent, failed
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Security Best Practices

1. **Never commit `.env.local`** ke git
2. **Use environment-specific configs**
3. **Rotate SMTP passwords** regularly
4. **Use App Passwords** (jangan password utama)
5. **Limit email rate** untuk prevent spam
6. **Validate email addresses** sebelum send
7. **Use verified domains** di production

## 🚀 Production Recommendations

### Recommended Setup

```env
# Production - AWS SES or SendGrid
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<aws-ses-smtp-username>
SMTP_PASS=<aws-ses-smtp-password>
SMTP_FROM="SIPelan Disnaker" <noreply@sipelan.go.id>
```

### Email Rate Limiting

Implement rate limiting untuk prevent abuse:

```typescript
// Example with redis
const emailLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10 // max 10 emails per minute
})
```

### Monitoring

Setup monitoring untuk:
- Email delivery rate
- Bounce rate
- Complaint rate
- Queue size
- SMTP errors

Tools:
- SendGrid Dashboard
- AWS CloudWatch
- Custom logging service

## 📚 Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [SendGrid Setup Guide](https://docs.sendgrid.com/for-developers/sending-email/integrating-with-the-smtp-api)
- [AWS SES Setup](https://docs.aws.amazon.com/ses/latest/dg/send-email-smtp.html)

## 🎯 Summary

- ✅ Email notification aktif saat status = "selesai"
- ✅ Template HTML profesional
- ✅ Support multiple SMTP providers
- ✅ Graceful fallback jika SMTP tidak configured
- ✅ Easy testing & debugging
- ✅ Production-ready dengan proper configuration

**Default Behavior:**
- Jika SMTP configured → Send email
- Jika SMTP not configured → Log to console saja

Tidak perlu worry, aplikasi tetap berjalan normal tanpa email configuration!
