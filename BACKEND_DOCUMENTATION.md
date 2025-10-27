# Backend Documentation - SIPELAN

## 🗄️ Database Schema

### Technology Stack
- **ORM**: Prisma 5.7.0
- **Database**: PostgreSQL (recommended)
- **Validation**: Zod
- **Email**: Nodemailer
- **Auth**: JWT + bcryptjs

### Models

#### 1. User (Admin/Petugas/Pimpinan)
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  nama      String
  role      Role     @default(PETUGAS)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  SUPER_ADMIN
  ADMIN
  PETUGAS
  PIMPINAN
}
```

#### 2. Pengaduan
```prisma
model Pengaduan {
  id              String   @id @default(cuid())
  ticketNumber    String   @unique
  
  // Data Pelapor
  nama            String
  nik             String
  email           String
  telepon         String
  alamat          String
  
  // Data Pengaduan
  kategori        String
  judul           String
  deskripsi       String
  lokasi          String
  tanggalKejadian DateTime
  
  // Status
  status          Status   @default(PENDING)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum Status {
  PENDING
  DIPROSES
  SELESAI
  DITOLAK
}
```

#### 3. PengaduanFile
```prisma
model PengaduanFile {
  id          String    @id @default(cuid())
  pengaduanId String
  fileName    String
  filePath    String
  fileSize    Int
  fileType    String
  uploadedAt  DateTime  @default(now())
}
```

#### 4. PengaduanHistory
```prisma
model PengaduanHistory {
  id          String    @id @default(cuid())
  pengaduanId String
  status      String
  keterangan  String
  createdBy   String?
  createdAt   DateTime  @default(now())
}
```

## 📡 API Endpoints

### Public Endpoints

#### 1. Create Pengaduan
```http
POST /api/pengaduan
Content-Type: application/json

{
  "nama": "Budi Santoso",
  "nik": "3319012345678901",
  "email": "budi@example.com",
  "telepon": "081234567890",
  "alamat": "Jl. Merdeka No. 123, Pati",
  "kategori": "Upah/Gaji Tidak Dibayar",
  "judul": "Gaji Belum Dibayar",
  "deskripsi": "Deskripsi lengkap minimal 20 karakter...",
  "lokasi": "PT XYZ, Pati",
  "tanggalKejadian": "2024-10-15"
}

Response 200:
{
  "success": true,
  "data": {
    "ticketNumber": "ADU-202410-3847",
    "id": "clxxx..."
  },
  "message": "Pengaduan berhasil dibuat"
}
```

#### 2. Get Pengaduan by Ticket
```http
GET /api/pengaduan/ADU-202410-3847

Response 200:
{
  "success": true,
  "data": {
    "ticketNumber": "ADU-202410-3847",
    "status": "diproses",
    "nama": "Budi Santoso",
    "email": "budi@example.com",
    "telepon": "081234567890",
    "kategori": "Upah/Gaji Tidak Dibayar",
    "judul": "Gaji Belum Dibayar",
    "deskripsi": "...",
    "lokasi": "PT XYZ, Pati",
    "tanggalKejadian": "2024-10-15",
    "tanggalPengaduan": "2024-10-20",
    "timeline": [
      {
        "status": "Pengaduan Diterima",
        "keterangan": "...",
        "tanggal": "2024-10-20T10:30:00Z",
        "petugas": "Ahmad Fauzi"
      }
    ],
    "files": [
      {
        "name": "bukti.pdf",
        "size": 245000,
        "url": "/uploads/..."
      }
    ]
  }
}
```

### Admin Endpoints

#### 3. Get All Pengaduan (with pagination & filters)
```http
GET /api/pengaduan?page=1&limit=10&status=DIPROSES&kategori=Upah&search=budi

Response 200:
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

#### 4. Update Pengaduan Status
```http
PATCH /api/pengaduan/ADU-202410-3847
Content-Type: application/json

{
  "status": "DIPROSES",
  "keterangan": "Pengaduan sedang dalam tahap investigasi",
  "userId": "user_id_here"
}

Response 200:
{
  "success": true,
  "data": {...},
  "message": "Status berhasil diupdate"
}
```

#### 5. Get Dashboard Stats
```http
GET /api/admin/stats

Response 200:
{
  "success": true,
  "data": {
    "totalPengaduan": 1247,
    "pending": 45,
    "diproses": 89,
    "selesai": 1058,
    "ditolak": 55,
    "pengaduanBulanIni": 127,
    "rataRataWaktuSelesai": "4.2 hari",
    "tingkatKepuasan": "87%"
  }
}
```

#### 6. Get Monthly Trend
```http
GET /api/admin/trend?months=10

Response 200:
{
  "success": true,
  "data": [
    {
      "bulan": "Jan",
      "total": 85,
      "selesai": 78,
      "pending": 7
    },
    ...
  ]
}
```

#### 7. Get Category Distribution
```http
GET /api/admin/categories

Response 200:
{
  "success": true,
  "data": [
    {
      "name": "Upah/Gaji Tidak Dibayar",
      "value": 385,
      "color": "#3B82F6"
    },
    ...
  ]
}
```

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/sipelan"
JWT_SECRET="your-secret-key"
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
```

### 3. Initialize Database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```

## 📧 Email Templates

### 1. Pengaduan Diterima
- Subject: `Pengaduan Diterima - [TICKET_NUMBER]`
- Template: Professional HTML email with ticket number
- Includes: Link to track complaint

### 2. Status Update
- Subject: `Update Status Pengaduan - [TICKET_NUMBER]`
- Template: Status badge with color coding
- Includes: New status and explanation

## 🔒 Security

### Input Validation
- All inputs validated with Zod schemas
- SQL injection prevention via Prisma
- XSS protection via Next.js

### Authentication (TODO)
```typescript
// JWT middleware
import jwt from 'jsonwebtoken';

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}
```

### Rate Limiting (TODO)
```typescript
// Implement rate limiting for public endpoints
// Max 10 requests per minute per IP
```

## 📊 Database Indexes

```prisma
@@index([ticketNumber])  // Fast ticket lookup
@@index([email])         // Search by email
@@index([status])        // Filter by status
@@index([createdAt])     // Sort by date
```

## 🚀 Performance Optimization

### 1. Caching
```typescript
// Cache dashboard stats for 5 minutes
export const revalidate = 300;
```

### 2. Database Connection Pooling
```typescript
// Prisma handles connection pooling automatically
// Configure in DATABASE_URL:
// ?connection_limit=10&pool_timeout=20
```

### 3. Query Optimization
```typescript
// Use select to fetch only needed fields
const pengaduan = await prisma.pengaduan.findMany({
  select: {
    id: true,
    ticketNumber: true,
    status: true,
  },
});
```

## 🧪 Testing

### API Testing with curl
```bash
# Create pengaduan
curl -X POST http://localhost:3000/api/pengaduan \
  -H "Content-Type: application/json" \
  -d '{"nama":"Test","nik":"1234567890123456",...}'

# Get pengaduan
curl http://localhost:3000/api/pengaduan/ADU-202410-3847

# Get stats
curl http://localhost:3000/api/admin/stats
```

## 📝 Migration Commands

```bash
# Create migration
npx prisma migrate dev --name add_new_field

# Reset database
npx prisma migrate reset

# Deploy to production
npx prisma migrate deploy

# View database
npx prisma studio
```

## 🔄 Backup & Restore

### Backup
```bash
pg_dump -U username -d sipelan > backup.sql
```

### Restore
```bash
psql -U username -d sipelan < backup.sql
```

## 📈 Monitoring

### Logs
```typescript
// Prisma query logs
log: ['query', 'error', 'warn']
```

### Error Tracking
```typescript
// Implement Sentry or similar
import * as Sentry from "@sentry/nextjs";
```

---

**Status**: ✅ Backend Ready for Development  
**Version**: 1.0  
**Last Updated**: 27 Oktober 2024
