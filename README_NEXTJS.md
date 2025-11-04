# SIPelan - Next.js + Tailwind CSS Version

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy `.env` to `.env.local`:
```bash
cp .env .env.local
```

Edit `.env.local` dan tambahkan prefix `NEXT_PUBLIC_` untuk client-side variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://pdsfruupgjezqzigncjv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=male.deeant@gmail.com
SMTP_PASS=DianDian1234@@
JWT_SECRET=sipelan_jwt_secret_key_2024_secure_token_for_authentication
```

### 3. Run Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5000`

### 4. Build for Production
```bash
npm run build
npm start
```

## 📁 Struktur Proyek

```
sipelan/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles dengan Tailwind
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   ├── pengaduan/
│   ├── tracking/
│   └── api/               # API Routes (Backend)
│       ├── auth/
│       ├── pengaduan/
│       └── disposisi/
├── components/            # React Components
├── lib/                   # Utilities & Helpers
├── public/               # Static files
├── tailwind.config.ts    # Tailwind configuration
├── next.config.js        # Next.js configuration
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **UI Library**: Lucide React (Icons)
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form + Zod
- **Notifications**: React Hot Toast
- **Database**: Supabase
- **Backend**: Next.js API Routes + Express (optional)

## 🔥 Features

### Modern UI/UX
- ✅ Gradient backgrounds
- ✅ Smooth animations dengan Framer Motion
- ✅ Responsive design (Mobile-first)
- ✅ Modern glassmorphism effects
- ✅ Custom Tailwind utilities
- ✅ Dark mode ready

### Performance
- ✅ Server-Side Rendering (SSR)
- ✅ Static Site Generation (SSG)
- ✅ Image optimization
- ✅ Code splitting
- ✅ Fast refresh

### Developer Experience
- ✅ TypeScript untuk type safety
- ✅ ESLint untuk code quality
- ✅ Hot reload
- ✅ Auto-import
- ✅ Tailwind IntelliSense

## 📝 Available Scripts

```bash
# Development
npm run dev              # Run Next.js dev server (port 5000)
npm run dev:express      # Run Express backend only

# Production
npm run build           # Build for production
npm start              # Start production server

# Linting
npm run lint           # Run ESLint

# Express Backend (Optional)
npm run start:express  # Run Express server only
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Import project di Vercel
3. Set environment variables
4. Deploy!

```bash
# Or using Vercel CLI
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload .next folder ke Netlify
```

## 🎨 Tailwind Customization

Edit `tailwind.config.ts` untuk customize:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#667eea',
        // Add more shades
      }
    },
    backgroundImage: {
      'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }
  }
}
```

## 🔧 Troubleshooting

### Error: Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port already in use
```bash
# Change port in package.json
"dev": "next dev -p 3000"
```

### Tailwind not working
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

---

**Dinas Ketenagakerjaan © 2024**
