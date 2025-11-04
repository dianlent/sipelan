# 📧 Email Notification System - SIPelan

## 🎯 Overview

Sistem notifikasi email otomatis yang dikirim ke pelapor ketika pengaduan mereka telah **selesai** diproses oleh bidang terkait.

---

## 🔄 Flow Notifikasi

```
Bidang Update Status → "Selesai"
         ↓
API Update Status Pengaduan
         ↓
Insert ke pengaduan_status (history)
         ↓
Trigger Email Notification
         ↓
Send Email ke Pelapor
         ↓
Success Toast: "Notifikasi email telah dikirim"
```

---

## 📨 Email Template

### **Subject:**
```
Pengaduan [KODE_PENGADUAN] Telah Selesai
```

### **Content:**
```html
✅ Pengaduan Selesai
SIPelan - Sistem Pengaduan Layanan Online Naker

Yth. [NAMA_PELAPOR],

Kami informasikan bahwa pengaduan Anda telah SELESAI 
diproses oleh [NAMA_BIDANG].

Detail Pengaduan:
- Kode Pengaduan: [KODE]
- Judul: [JUDUL]
- Status: SELESAI
- Ditangani oleh: [BIDANG]

[Lihat Detail Pengaduan] (Button)

Terima kasih telah menggunakan layanan SIPelan.

---
Kontak:
- Email: info@disnaker.go.id
- Telepon: (021) 1234-5678
```

---

## 🎨 Email Design

### **Header:**
- Gradient background (purple → violet)
- White text
- Logo/Title centered

### **Content:**
- White background
- Info box dengan border purple
- Status badge (green, "SELESAI")
- Table untuk detail

### **CTA Button:**
- Link ke tracking page
- Purple background
- Rounded corners

### **Footer:**
- Copyright notice
- Contact information
- Auto-send disclaimer

---

## 🔧 API Endpoint

### **PUT** `/api/pengaduan/[id]/status`

**Request Body:**
```json
{
  "status": "selesai",
  "kode_bidang": "HI"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Pengaduan selesai! Notifikasi email telah dikirim ke pelapor",
  "data": {
    "id": "uuid",
    "kode_pengaduan": "ADU-2024-0001",
    "status": "selesai",
    "email_pelapor": "john@example.com",
    ...
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Gagal mengupdate status"
}
```

---

## 📊 Database Updates

### **1. Update pengaduan table:**
```sql
UPDATE pengaduan 
SET status = 'selesai',
    updated_at = NOW()
WHERE id = 'pengaduan_id'
```

### **2. Insert to pengaduan_status:**
```sql
INSERT INTO pengaduan_status (
  pengaduan_id,
  status,
  keterangan,
  created_at
) VALUES (
  'pengaduan_id',
  'selesai',
  'Pengaduan telah diselesaikan oleh bidang terkait',
  NOW()
)
```

---

## 🚀 Setup Email Service

### **Option 1: SMTP (Recommended)**

**Environment Variables:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@sipelan.go.id
SMTP_PASS=your_password_here
```

**Using Nodemailer:**
```javascript
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
  to: email_pelapor,
  subject: `Pengaduan ${kode_pengaduan} Telah Selesai`,
  html: emailHtml
})
```

### **Option 2: SendGrid**

```bash
npm install @sendgrid/mail
```

```javascript
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

await sgMail.send({
  to: email_pelapor,
  from: 'noreply@sipelan.go.id',
  subject: `Pengaduan ${kode_pengaduan} Telah Selesai`,
  html: emailHtml
})
```

### **Option 3: AWS SES**

```bash
npm install @aws-sdk/client-ses
```

```javascript
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')

const client = new SESClient({ region: 'ap-southeast-1' })

await client.send(new SendEmailCommand({
  Source: 'noreply@sipelan.go.id',
  Destination: { ToAddresses: [email_pelapor] },
  Message: {
    Subject: { Data: subject },
    Body: { Html: { Data: emailHtml } }
  }
}))
```

---

## 🎯 User Experience

### **Bidang Side:**

**1. Update Status ke "Selesai":**
```
[Detail Modal]
  ↓
Select Status: "Selesai"
  ↓
Click "Simpan Status"
  ↓
Loading... (1.5s)
  ↓
✅ Toast: "Pengaduan selesai! Notifikasi email telah dikirim ke pelapor"
  ↓
Modal closes
  ↓
Pengaduan list updated
```

**2. Visual Feedback:**
```javascript
toast.success('Pengaduan selesai! Notifikasi email telah dikirim ke pelapor', {
  duration: 5000,
  icon: '✅'
})
```

### **Pelapor Side:**

**1. Receive Email:**
```
📧 New Email Notification
Subject: "Pengaduan ADU-2024-0001 Telah Selesai"
From: SIPelan <noreply@sipelan.go.id>
```

**2. Email Content:**
- Clear status update
- Pengaduan details
- Link to tracking page
- Contact information

**3. Click "Lihat Detail":**
```
Redirect to: /tracking?kode=ADU-2024-0001
  ↓
See timeline with "Selesai" status
  ↓
View full resolution details
```

---

## 📋 Email Variables

```javascript
{
  to: pengaduan.email_pelapor,          // "john@example.com"
  subject: `Pengaduan ${kode} Telah Selesai`,
  pengaduan: {
    kode: "ADU-2024-0001",
    judul: "Upah tidak dibayar sesuai UMR",
    nama_pelapor: "John Doe",
    bidang: "Bidang Hubungan Industrial"
  }
}
```

---

## 🔐 Security

### **Email Validation:**
```javascript
// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email_pelapor)) {
  throw new Error('Invalid email format')
}
```

### **Rate Limiting:**
```javascript
// Prevent spam
const MAX_EMAILS_PER_HOUR = 10
// Implement rate limiting logic
```

### **Email Sanitization:**
```javascript
// Escape HTML in user input
const escapeHtml = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
```

---

## 📊 Monitoring

### **Log Email Sends:**
```javascript
console.log('=== EMAIL NOTIFICATION ===')
console.log('To:', to)
console.log('Subject:', subject)
console.log('Pengaduan:', kode)
console.log('Status:', 'Sent/Failed')
console.log('Timestamp:', new Date().toISOString())
console.log('=========================')
```

### **Track Email Status:**
```sql
CREATE TABLE email_logs (
  id SERIAL PRIMARY KEY,
  pengaduan_id UUID REFERENCES pengaduan(id),
  email_to VARCHAR(255),
  subject TEXT,
  status VARCHAR(20), -- 'sent', 'failed', 'bounced'
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT NOW()
)
```

---

## 🧪 Testing

### **Test Email Template:**
```bash
# Send test email
curl -X PUT http://localhost:5000/api/pengaduan/test-id/status \
  -H "Content-Type: application/json" \
  -d '{"status":"selesai","kode_bidang":"HI"}'
```

### **Mock Email Service:**
```javascript
// For development
if (process.env.NODE_ENV === 'development') {
  console.log('📧 Mock Email Sent:', {
    to: email_pelapor,
    subject,
    preview: emailHtml.substring(0, 100)
  })
  return true
}
```

---

## 📝 Email Content Checklist

- [x] Professional header with branding
- [x] Clear status update message
- [x] Pengaduan details (kode, judul, bidang)
- [x] Status badge (visual indicator)
- [x] CTA button to tracking page
- [x] Contact information
- [x] Footer with disclaimer
- [x] Mobile-responsive design
- [x] Proper HTML formatting

---

## 🎨 Customization

### **Add Logo:**
```html
<img src="https://yourdomain.com/logo.png" 
     alt="SIPelan Logo" 
     style="max-width: 150px; margin-bottom: 20px;">
```

### **Custom Colors:**
```css
--primary: #667eea;
--success: #10b981;
--text: #333333;
--background: #f9fafb;
```

### **Additional Info:**
```html
<div class="info-box">
  <h4>Hasil Penyelesaian:</h4>
  <p>${pengaduan.hasil_penyelesaian}</p>
</div>
```

---

## 🚀 Production Checklist

- [ ] Configure SMTP credentials
- [ ] Test email delivery
- [ ] Set up email monitoring
- [ ] Configure SPF/DKIM records
- [ ] Test on multiple email clients
- [ ] Set up bounce handling
- [ ] Implement rate limiting
- [ ] Add unsubscribe option (if needed)
- [ ] Monitor delivery rates
- [ ] Set up email logs

---

## 📞 Support

Jika ada masalah dengan email notification:

1. Check SMTP credentials
2. Verify email logs
3. Test with different email providers
4. Check spam folder
5. Verify DNS records (SPF, DKIM)

---

**Email notification system ready! 📧✅**
