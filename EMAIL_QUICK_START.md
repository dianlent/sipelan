# Email Notification - Quick Start

## 🚀 Setup dalam 3 Langkah

### 1. Configure SMTP

Edit `.env.local` (create if not exist):

```env
# Untuk Gmail (Recommended untuk testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_app_password
SMTP_FROM="SIPelan" <your_email@gmail.com>
```

**Cara dapat Gmail App Password:**
1. Enable 2FA di Gmail: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Pilih "Mail" → Generate → Copy 16 karakter

### 2. Test Email

```bash
node scripts/test-email.js
```

Output jika berhasil:
```
✅ SMTP connection successful!
✅ Email sent successfully!
Check your inbox: your_email@gmail.com
```

### 3. Restart Server

```bash
npm run dev
```

## ✅ Done!

Email notifikasi akan otomatis terkirim saat:
- Bidang update status pengaduan ke **"Selesai"**
- Bidang submit tanggapan (auto set to selesai)

## 📧 Email Provider Alternatives

### SendGrid (Production)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```
Free: 100 emails/day

### AWS SES (Production)
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your_aws_smtp_username
SMTP_PASS=your_aws_smtp_password
```
Pay as you go: $0.10 per 1,000 emails

### Outlook
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_password
```
Free: 300 emails/day

## ⚠️ Important Notes

1. **Optional**: Email tetap bekerja tanpa SMTP config (logging only)
2. **Security**: Jangan commit `.env.local` ke git
3. **Gmail Limit**: 500 emails/day (free account)
4. **Production**: Gunakan SendGrid atau AWS SES

## 🐛 Troubleshooting

### Email tidak terkirim?

**Check console log:**
```
⚠️ SMTP not configured - Email not sent (logging only)
```
→ Add SMTP config ke `.env.local` dan restart server

**Authentication failed:**
```
❌ Invalid login
```
→ Check username/password. Untuk Gmail, pastikan gunakan App Password

**Connection timeout:**
```
❌ Connection timeout
```
→ Check SMTP_HOST dan SMTP_PORT

## 📚 Full Documentation

Lihat `EMAIL_NOTIFICATION_SETUP.md` untuk dokumentasi lengkap.
