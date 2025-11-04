# Migration Guide: Express.js to Next.js with Tailwind CSS

## 🚀 Langkah-Langkah Migrasi

### 1. Install Dependencies Next.js
```bash
npm install next@latest react@latest react-dom@latest
npm install -D typescript @types/react @types/node
npm install -D tailwindcss postcss autoprefixer
npm install @supabase/supabase-js axios
npm install lucide-react # Modern icon library
npm install clsx tailwind-merge # Utility untuk Tailwind
```

### 2. Setup Tailwind CSS
```bash
npx tailwindcss init -p
```

### 3. Update package.json scripts
```json
{
  "scripts": {
    "dev": "next dev -p 5000",
    "build": "next build",
    "start": "next start -p 5000",
    "lint": "next lint"
  }
}
```

### 4. Struktur Folder Next.js
```
sipelan/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── pengaduan/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── tracking/
│   │   └── page.tsx
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   └── register/route.ts
│       ├── pengaduan/
│       │   └── route.ts
│       └── disposisi/
│           └── route.ts
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── FeatureCard.tsx
│   └── StatsSection.tsx
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── utils.ts           # Utility functions
│   └── api.ts             # API helpers
├── public/
│   └── uploads/
├── styles/
│   └── globals.css
├── types/
│   └── index.ts           # TypeScript types
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── .env.local
```

### 5. Keuntungan Migrasi ke Next.js + Tailwind

#### Next.js Benefits:
- ✅ **Server-Side Rendering (SSR)** - SEO friendly
- ✅ **API Routes** - Backend dan frontend dalam satu project
- ✅ **File-based Routing** - Automatic routing
- ✅ **Image Optimization** - Built-in image optimization
- ✅ **TypeScript Support** - Type safety
- ✅ **Fast Refresh** - Instant feedback saat development
- ✅ **Production Ready** - Optimized builds

#### Tailwind CSS Benefits:
- ✅ **Utility-First** - Faster development
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Customizable** - Easy theming
- ✅ **Small Bundle Size** - Purge unused CSS
- ✅ **No CSS Files** - Everything in JSX
- ✅ **Dark Mode** - Built-in support

### 6. Migration Checklist

- [ ] Install Next.js dan dependencies
- [ ] Setup Tailwind CSS
- [ ] Migrate Express routes ke Next.js API routes
- [ ] Convert HTML pages ke React components
- [ ] Replace vanilla CSS dengan Tailwind classes
- [ ] Setup Supabase client untuk Next.js
- [ ] Implement authentication dengan Next.js middleware
- [ ] Migrate file upload logic
- [ ] Setup environment variables (.env.local)
- [ ] Test all features
- [ ] Deploy to Vercel/Netlify

### 7. API Routes Migration Example

**Before (Express.js):**
```javascript
// routes/auth.js
router.post('/login', loginValidation, login);
```

**After (Next.js):**
```typescript
// app/api/auth/login/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  // Login logic
  return Response.json({ success: true, data: user });
}
```

### 8. Component Migration Example

**Before (HTML + Vanilla JS):**
```html
<div class="card">
  <h5 class="card-title">Buat Pengaduan</h5>
</div>
```

**After (Next.js + Tailwind):**
```tsx
<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
  <h5 className="text-xl font-semibold text-gray-800">Buat Pengaduan</h5>
</div>
```

### 9. Supabase Client Setup

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### 10. Environment Variables

Rename `.env` to `.env.local` dan tambahkan prefix `NEXT_PUBLIC_` untuk client-side variables:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
JWT_SECRET=...
```

## 🎨 Tailwind Design System

### Colors
```javascript
// tailwind.config.ts
colors: {
  primary: {
    50: '#f5f7ff',
    500: '#667eea',
    600: '#5a67d8',
    700: '#4c51bf',
  },
  secondary: {
    500: '#764ba2',
  }
}
```

### Common Tailwind Classes
- **Gradient**: `bg-gradient-to-r from-purple-500 to-pink-500`
- **Shadow**: `shadow-lg shadow-purple-500/50`
- **Rounded**: `rounded-2xl`
- **Hover**: `hover:scale-105 transition-transform`
- **Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`

## 📦 Recommended Libraries

```bash
npm install framer-motion        # Animations
npm install react-hot-toast      # Toast notifications
npm install react-hook-form      # Form handling
npm install zod                  # Schema validation
npm install @tanstack/react-query # Data fetching
npm install zustand              # State management
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Environment Variables di Vercel
- Add all `.env.local` variables di Vercel dashboard
- Set `NEXT_PUBLIC_` prefix untuk client-side variables

## 📝 Notes

1. **Keep Express Backend**: Anda bisa tetap menggunakan Express backend yang ada dan hanya migrate frontend ke Next.js
2. **Gradual Migration**: Migrate satu halaman dulu, test, lalu lanjut ke halaman berikutnya
3. **API Routes**: Next.js API routes bisa replace Express routes atau bisa juga tetap pakai Express sebagai separate backend

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Vercel Deployment](https://vercel.com/docs)
