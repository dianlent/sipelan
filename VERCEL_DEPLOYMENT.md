# Vercel Deployment Guide - SIPELAN

## 🚀 Deploy SIPELAN ke Vercel

Vercel adalah platform hosting yang optimal untuk Next.js dengan deployment otomatis, serverless functions, dan global CDN.

---

## 📋 Prerequisites

### 1. Akun Vercel
- Daftar di [vercel.com](https://vercel.com)
- Connect dengan GitHub account
- Install Vercel CLI (optional): `npm i -g vercel`

### 2. Database External
Vercel memiliki filesystem read-only, jadi Anda perlu database external:

**Option A: Vercel Postgres** (Recommended)
- Integrated dengan Vercel
- Auto-scaling
- Built-in connection pooling
- Free tier: 256MB storage

**Option B: Supabase** (Recommended)
- PostgreSQL managed
- Free tier: 500MB storage
- Realtime features
- Built-in auth (optional)

**Option C: Railway/Render**
- PostgreSQL hosting
- Free tier available
- Easy setup

**Option D: AWS RDS/DigitalOcean**
- Full control
- Paid service
- Production-grade

### 3. File Storage (Optional)
Untuk file uploads, gunakan:
- **Vercel Blob Storage** (Recommended)
- **Cloudinary** (Images)
- **AWS S3**
- **DigitalOcean Spaces**

---

## 🔧 Step 1: Prepare Repository

### 1.1 Ensure Files Exist

```bash
# Check required files
ls -la vercel.json
ls -la .env.vercel
ls -la prisma/schema.prisma
ls -la package.json
```

### 1.2 Update .gitignore

Pastikan `.env*` files tidak ter-commit:

```gitignore
# Environment
.env
.env.local
.env.production
.env.vercel
.env*.local

# Vercel
.vercel
```

### 1.3 Commit & Push

```bash
git add .
git commit -m "feat: add Vercel deployment configuration"
git push origin main
```

---

## 🗄️ Step 2: Setup Database

### Option A: Vercel Postgres

1. **Create Database:**
   - Go to Vercel Dashboard
   - Select your project
   - Go to "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose region (Singapore for Indonesia)

2. **Get Connection String:**
   ```
   POSTGRES_URL="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb"
   POSTGRES_PRISMA_URL="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
   ```

3. **Environment Variables:**
   - Vercel auto-adds these to your project
   - Use `POSTGRES_PRISMA_URL` for Prisma

### Option B: Supabase

1. **Create Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Choose region (Singapore)
   - Set database password

2. **Get Connection String:**
   ```
   Settings > Database > Connection String > URI
   
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

3. **Connection Pooling:**
   ```
   Settings > Database > Connection Pooling
   
   postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

---

## 🌐 Step 3: Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Import Project:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Click "Import"

2. **Configure Project:**
   ```
   Project Name: sipelan
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build (auto-detected)
   Output Directory: .next (auto-detected)
   Install Command: npm install (auto-detected)
   ```

3. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add all variables from `.env.vercel`
   
   **Required Variables:**
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret-key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=noreply@sipelan.patikab.go.id
   SMTP_PASS=your-app-password
   SMTP_FROM=SIPELAN <noreply@sipelan.patikab.go.id>
   NEXT_PUBLIC_APP_URL=https://sipelan.vercel.app
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - Get deployment URL: `https://sipelan.vercel.app`

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? sipelan
# - Directory? ./
# - Override settings? No

# Production deployment
vercel --prod
```

---

## 🗄️ Step 4: Run Database Migrations

### 4.1 Local Migration (Recommended)

```bash
# Set DATABASE_URL to production
export DATABASE_URL="postgresql://..."

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Verify
npx prisma studio
```

### 4.2 Vercel Build Hook

Create `prisma/seed.ts` for initial data:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sipelan.patikab.go.id' },
    update: {},
    create: {
      email: 'admin@sipelan.patikab.go.id',
      password: hashedPassword,
      nama: 'Administrator SIPELAN',
      nip: '198501012010011001',
      role: 'ADMINISTRATOR',
      isActive: true,
    },
  });

  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  },
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

---

## 🔒 Step 5: Custom Domain (Optional)

### 5.1 Add Domain to Vercel

1. Go to Project Settings > Domains
2. Add domain: `sipelan.patikab.go.id`
3. Vercel provides DNS records

### 5.2 Configure DNS

Add these records to your domain registrar:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 5.3 SSL Certificate

- Vercel automatically provisions SSL
- Certificate renews automatically
- HTTPS enforced by default

---

## 📦 Step 6: File Upload Configuration

### Option A: Vercel Blob Storage

1. **Enable Blob Storage:**
   - Go to Storage tab
   - Create Blob Store
   - Get token

2. **Install Package:**
   ```bash
   npm install @vercel/blob
   ```

3. **Add Environment Variable:**
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx
   ```

4. **Update Upload Code:**
   ```typescript
   import { put } from '@vercel/blob';
   
   export async function POST(request: Request) {
     const file = await request.formData();
     const blob = await put('filename.jpg', file, {
       access: 'public',
     });
     
     return Response.json({ url: blob.url });
   }
   ```

### Option B: Cloudinary

1. **Create Account:** [cloudinary.com](https://cloudinary.com)

2. **Install Package:**
   ```bash
   npm install cloudinary
   ```

3. **Add Environment Variables:**
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Upload Code:**
   ```typescript
   import { v2 as cloudinary } from 'cloudinary';
   
   cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET,
   });
   
   const result = await cloudinary.uploader.upload(file);
   ```

---

## 🔄 Step 7: Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Builds application
# 3. Runs tests (if configured)
# 4. Deploys to production
# 5. Sends notification
```

### Preview Deployments

Every pull request gets a preview URL:

```bash
# Create branch
git checkout -b feature/new-feature

# Make changes and push
git push origin feature/new-feature

# Create PR on GitHub
# Vercel creates preview: https://sipelan-git-feature-new-feature.vercel.app
```

### Deployment Protection

Enable in Project Settings > Deployment Protection:
- Password protection
- Vercel Authentication
- Trusted IPs only

---

## 📊 Step 8: Monitoring & Analytics

### Vercel Analytics

1. **Enable Analytics:**
   - Go to Analytics tab
   - Enable Web Analytics
   - Add to your app:

   ```bash
   npm install @vercel/analytics
   ```

   ```typescript
   // app/layout.tsx
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

### Vercel Speed Insights

```bash
npm install @vercel/speed-insights
```

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Log Drains (Optional)

Forward logs to external services:
- Datadog
- Logtail
- Axiom
- Custom webhook

---

## ⚡ Step 9: Performance Optimization

### 9.1 Image Optimization

Next.js Image component automatically optimized on Vercel:

```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
  priority // For above-the-fold images
/>
```

### 9.2 Edge Functions

Move API routes to Edge for faster response:

```typescript
// app/api/hello/route.ts
export const runtime = 'edge';

export async function GET() {
  return Response.json({ message: 'Hello from Edge' });
}
```

### 9.3 Caching

Configure caching headers:

```typescript
export async function GET() {
  return Response.json(
    { data: 'cached data' },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    }
  );
}
```

---

## 🔧 Step 10: Environment Variables Management

### Production Variables

```bash
# Via Vercel CLI
vercel env add DATABASE_URL production

# Via Dashboard
# Settings > Environment Variables > Add
```

### Preview Variables

```bash
# For preview deployments
vercel env add DATABASE_URL preview
```

### Development Variables

```bash
# For local development
vercel env pull .env.local
```

---

## ✅ Post-Deployment Checklist

### Verification

- [ ] Application accessible at Vercel URL
- [ ] Custom domain working (if configured)
- [ ] SSL certificate valid
- [ ] Database connection working
- [ ] Admin login successful
- [ ] Email notifications working
- [ ] File uploads working (if configured)
- [ ] API endpoints responding
- [ ] Charts and dashboard loading
- [ ] Mobile responsive
- [ ] Performance metrics good

### Testing

```bash
# Test homepage
curl https://sipelan.vercel.app

# Test API
curl https://sipelan.vercel.app/api/health

# Performance test
lighthouse https://sipelan.vercel.app
```

---

## 🆘 Troubleshooting

### Build Failures

**Check build logs:**
- Go to Deployments tab
- Click failed deployment
- View build logs

**Common issues:**
```bash
# Missing dependencies
npm install --save-dev @types/node

# TypeScript errors
npm run build # Test locally first

# Environment variables
# Ensure all required vars are set in Vercel
```

### Database Connection Issues

```bash
# Test connection string
psql "postgresql://..."

# Check Prisma schema
npx prisma validate

# Regenerate client
npx prisma generate
```

### Function Timeout

Vercel has 10s timeout for Hobby plan:

```typescript
// Optimize long-running operations
// Use background jobs or webhooks
// Split into smaller functions
```

---

## 💰 Pricing & Limits

### Hobby Plan (Free)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions
- ✅ SSL certificates
- ⚠️ 10s function timeout
- ⚠️ No password protection

### Pro Plan ($20/month)
- ✅ Everything in Hobby
- ✅ 1TB bandwidth/month
- ✅ 60s function timeout
- ✅ Password protection
- ✅ Advanced analytics
- ✅ Team collaboration

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)

---

## 🔄 Update Workflow

### Deploy Updates

```bash
# 1. Make changes locally
git add .
git commit -m "feat: new feature"

# 2. Push to GitHub
git push origin main

# 3. Vercel auto-deploys
# Monitor at: https://vercel.com/dashboard

# 4. Verify deployment
curl https://sipelan.vercel.app
```

### Rollback

```bash
# Via Dashboard
# Deployments > Previous deployment > Promote to Production

# Via CLI
vercel rollback
```

---

**Deployment Guide Version**: 1.0  
**Platform**: Vercel  
**Last Updated**: 27 Oktober 2025  
**Contact**: male.deeant@gmail.com
