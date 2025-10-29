#!/bin/bash
set -e

echo "🚀 Starting SIPELAN deployment..."
echo "=================================="

cd /var/www/sipelan

# Backup database
echo ""
echo "📦 Step 1: Creating database backup..."
./scripts/backup.sh

# Pull latest code
echo ""
echo "📥 Step 2: Pulling latest code from repository..."
git pull origin main

# Install dependencies
echo ""
echo "📦 Step 3: Installing dependencies..."
npm ci --only=production

# Run migrations
echo ""
echo "🗄️ Step 4: Running database migrations..."
npx prisma migrate deploy

# Generate Prisma Client
echo ""
echo "⚙️ Step 5: Generating Prisma Client..."
npx prisma generate

# Build application
echo ""
echo "🔨 Step 6: Building Next.js application..."
npm run build

# Reload PM2 (zero-downtime deployment)
echo ""
echo "🔄 Step 7: Reloading application with PM2..."
pm2 reload sipelan

echo ""
echo "=================================="
echo "✅ Deployment completed successfully!"
echo "🌐 Application: https://sipelan.patikab.go.id"
echo "📊 Monitor: pm2 monit"
echo "📝 Logs: pm2 logs sipelan"
echo "=================================="
