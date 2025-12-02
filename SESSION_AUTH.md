# 🔐 Session-Based Authentication

## Overview

Sistem autentikasi telah diubah dari **localStorage (client-side)** menjadi **session database (server-side)** dengan HTTP-only cookies untuk keamanan yang lebih baik.

## 🎯 Keuntungan

### Sebelum (localStorage):
- ❌ Token tersimpan di client (bisa diakses JavaScript)
- ❌ Rentan terhadap XSS attacks
- ❌ Tidak bisa di-revoke dari server
- ❌ Sulit tracking session aktif

### Sesudah (Session Database):
- ✅ Session tersimpan di database
- ✅ HTTP-only cookies (tidak bisa diakses JavaScript)
- ✅ Secure flag untuk HTTPS
- ✅ Bisa di-revoke kapan saja dari server
- ✅ Tracking session aktif (user agent, IP, expiry)
- ✅ Auto-cleanup expired sessions

## 📊 Arsitektur

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Client    │         │  Next.js API │         │   Database   │
│  (Browser)  │         │   (Server)   │         │  (Supabase)  │
└──────┬──────┘         └──────┬───────┘         └──────┬───────┘
       │                       │                        │
       │  1. POST /api/auth/login                      │
       │  { email, password }  │                        │
       ├──────────────────────>│                        │
       │                       │  2. Verify credentials │
       │                       ├───────────────────────>│
       │                       │                        │
       │                       │  3. Create session     │
       │                       ├───────────────────────>│
       │                       │  INSERT INTO sessions  │
       │                       │<───────────────────────┤
       │  4. Set HTTP-only     │                        │
       │     cookie            │                        │
       │<──────────────────────┤                        │
       │                       │                        │
       │  5. GET /api/auth/me  │                        │
       │  Cookie: session_token│                        │
       ├──────────────────────>│                        │
       │                       │  6. Validate session   │
       │                       ├───────────────────────>│
       │                       │  SELECT FROM sessions  │
       │                       │<───────────────────────┤
       │  7. Return user data  │                        │
       │<──────────────────────┤                        │
```

## 🗄️ Database Schema

### Table: `sessions`

```sql
CREATE TABLE sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    ip_address VARCHAR(45)
);

-- Indexes
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
```

## 📁 File Structure

```
lib/
├── session.ts              # Session management utilities
└── supabase.ts            # Supabase client

app/api/auth/
├── login/route.ts         # Login endpoint (create session)
├── logout/route.ts        # Logout endpoint (delete session)
└── me/route.ts            # Get current user endpoint

contexts/
└── AuthContext.tsx        # React context (updated)

database/
└── add_sessions_table.sql # SQL untuk create table
```

## 🔧 Setup

### 1. Run SQL Migration

```bash
# Copy & paste ke Supabase SQL Editor
database/add_sessions_table.sql
```

### 2. Environment Variables

Sudah ada di `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...  # Required untuk session management
```

### 3. No Code Changes Needed!

Semua komponen existing tetap bekerja karena `AuthContext` interface tidak berubah.

## 🚀 Usage

### Login

```typescript
// Client-side (app/login/page.tsx)
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})

const data = await response.json()
if (data.success) {
  login(data.data.user) // No token needed!
  router.push('/dashboard')
}
```

### Get Current User

```typescript
// Client-side (any component)
const { user, isLoading, isAuthenticated } = useAuth()

// Server-side (API routes)
import { getCurrentUser } from '@/lib/session'

const user = await getCurrentUser()
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### Logout

```typescript
// Client-side
const { logout } = useAuth()
await logout() // Deletes session & clears cookie
```

## 🔒 Security Features

### 1. HTTP-Only Cookies
```typescript
cookieStore.set('session_token', token, {
  httpOnly: true,        // Cannot be accessed by JavaScript
  secure: true,          // HTTPS only (production)
  sameSite: 'lax',       // CSRF protection
  maxAge: 7 * 24 * 60 * 60 // 7 days
})
```

### 2. Session Expiry
- Default: 7 days
- Checked on every request
- Auto-deleted if expired

### 3. Session Tracking
- User agent (browser info)
- IP address
- Created/updated timestamps

### 4. Revocation
```typescript
// Logout single session
await deleteSession(sessionToken)

// Logout all user sessions
await deleteUserSessions(userId)
```

## 🧹 Maintenance

### Cleanup Expired Sessions

```typescript
// Manual cleanup
import { cleanupExpiredSessions } from '@/lib/session'
await cleanupExpiredSessions()
```

### Scheduled Cleanup (Supabase)

```sql
-- Create cron job (Supabase Dashboard → Database → Cron Jobs)
SELECT cron.schedule(
  'cleanup-expired-sessions',
  '0 * * * *', -- Every hour
  $$SELECT cleanup_expired_sessions()$$
);
```

## 📊 Monitoring

### Active Sessions

```sql
-- Count active sessions
SELECT COUNT(*) FROM sessions WHERE expires_at > NOW();

-- Sessions per user
SELECT u.username, COUNT(s.id) as session_count
FROM users u
LEFT JOIN sessions s ON s.user_id = u.id AND s.expires_at > NOW()
GROUP BY u.id, u.username
ORDER BY session_count DESC;

-- Recent sessions
SELECT 
  u.username,
  s.created_at,
  s.expires_at,
  s.user_agent,
  s.ip_address
FROM sessions s
JOIN users u ON u.id = s.user_id
WHERE s.expires_at > NOW()
ORDER BY s.created_at DESC
LIMIT 10;
```

## 🔄 Migration from localStorage

### What Changed:

1. **AuthContext**
   - ❌ `login(user, token)` → ✅ `login(user)`
   - ❌ `localStorage.setItem()` → ✅ HTTP-only cookie
   - ✅ Added `refreshUser()` method

2. **Login API**
   - ❌ Returns JWT token → ✅ Sets HTTP-only cookie
   - ✅ Creates session in database

3. **Authentication Check**
   - ❌ Read from localStorage → ✅ Fetch from `/api/auth/me`

### What Stayed the Same:

- ✅ `useAuth()` hook interface
- ✅ All components using `useAuth()`
- ✅ Protected routes logic
- ✅ Role-based access control

## 🐛 Troubleshooting

### Session not persisting

```typescript
// Ensure credentials: 'include' in fetch
fetch('/api/auth/me', {
  credentials: 'include' // Required for cookies!
})
```

### Cookie not set in development

```typescript
// Check cookie settings
// In development, secure: false is OK
cookieStore.set('session_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // false in dev
  sameSite: 'lax'
})
```

### Session expired immediately

```sql
-- Check session expiry
SELECT session_token, expires_at, expires_at > NOW() as is_valid
FROM sessions
WHERE session_token = 'your_token_here';
```

## ✅ Testing

### 1. Login Test
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@disnaker.go.id","password":"admin123"}' \
  -c cookies.txt
```

### 2. Get Current User
```bash
curl http://localhost:5000/api/auth/me \
  -b cookies.txt
```

### 3. Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

## 📚 References

- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [HTTP-only Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)
- [Next.js Cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)

---

**✅ Migration Complete!**

Sistem autentikasi sekarang menggunakan session database yang lebih aman dan scalable! 🎉
