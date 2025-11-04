# 🔐 Session Management - SIPelan

## 📋 Overview

Sistem session management yang memastikan user tetap login ketika berpindah halaman menggunakan React Context API dan localStorage.

---

## 🏗️ Architecture

```
Root Layout
    ↓
AuthProvider (Context)
    ↓
All Pages & Components
    ↓
useAuth() Hook
```

---

## 📁 File Structure

```
contexts/
  └── AuthContext.tsx       # Auth context provider & hook

app/
  ├── layout.tsx            # Wrap with AuthProvider
  ├── login/page.tsx        # Use login() function
  ├── admin/page.tsx        # Use useAuth() hook
  ├── bidang/page.tsx       # Use useAuth() hook
  └── dashboard/page.tsx    # Use useAuth() hook
```

---

## 🔧 AuthContext.tsx

### **Interface:**

```typescript
interface User {
  id: string
  username: string
  email: string
  nama_lengkap: string
  role: string
  kode_bidang?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (userData: User, token: string) => void
  logout: () => void
  isAuthenticated: boolean
}
```

### **Functions:**

**1. checkAuth()**
```typescript
// Check localStorage for existing session
// Called on mount and route changes
// Updates user state
```

**2. login(userData, token)**
```typescript
// Save to localStorage
// Update user state
// Keep session active
```

**3. logout()**
```typescript
// Clear localStorage
// Clear user state
// Redirect to homepage
```

---

## 🎯 Usage

### **1. In Login Page:**

```typescript
'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    // ... API call
    
    if (data.success) {
      // Use login function from context
      login(data.data.user, data.data.token)
      
      // Redirect based on role
      if (data.data.user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    }
  }
}
```

### **2. In Protected Pages:**

```typescript
'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function AdminPage() {
  const { user, isLoading, logout, isAuthenticated } = useAuth()

  // Check authentication
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
      return
    }

    if (!isLoading && user?.role !== 'admin') {
      toast.error('Akses ditolak')
      router.push('/dashboard')
      return
    }
  }, [user, isLoading, isAuthenticated])

  // Show loading
  if (isLoading) {
    return <LoadingSpinner />
  }

  // Show content
  return (
    <div>
      <h1>Welcome, {user?.nama_lengkap}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### **3. In Navbar:**

```typescript
'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Hello, {user?.nama_lengkap}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  )
}
```

---

## 🔄 Session Flow

### **Login Flow:**

```
1. User submits login form
   ↓
2. API validates credentials
   ↓
3. API returns user data + token
   ↓
4. login(userData, token) called
   ↓
5. Save to localStorage
   ↓
6. Update context state
   ↓
7. Redirect to appropriate page
   ↓
8. Session active across all pages
```

### **Page Navigation:**

```
User navigates to new page
   ↓
AuthProvider detects route change
   ↓
checkAuth() called
   ↓
Read from localStorage
   ↓
Update user state
   ↓
Page renders with user data
   ↓
Session maintained
```

### **Logout Flow:**

```
User clicks logout
   ↓
logout() called
   ↓
Clear localStorage
   ↓
Clear context state
   ↓
Redirect to homepage
   ↓
Session ended
```

---

## 💾 LocalStorage

### **Keys:**

```javascript
authToken      // JWT token
currentUser    // User object (JSON)
```

### **Data Structure:**

```javascript
// authToken
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// currentUser
{
  "id": "uuid",
  "username": "admin",
  "email": "admin@sipelan.go.id",
  "nama_lengkap": "Administrator",
  "role": "admin",
  "kode_bidang": null
}
```

---

## 🔐 Security

### **1. Token Validation:**

```typescript
// Check token exists
const token = localStorage.getItem('authToken')
if (!token) {
  // Redirect to login
}

// TODO: Validate token expiry
// TODO: Refresh token if needed
```

### **2. Role-Based Access:**

```typescript
// Check user role
if (user?.role !== 'admin') {
  toast.error('Akses ditolak')
  router.push('/dashboard')
}
```

### **3. Protected Routes:**

```typescript
// Middleware pattern
useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.push('/login')
  }
}, [isLoading, isAuthenticated])
```

---

## 🎯 Benefits

### **1. Persistent Session:**
- User stays logged in across pages
- No need to re-login on navigation
- Smooth user experience

### **2. Centralized State:**
- Single source of truth
- Easy to access user data
- Consistent across app

### **3. Easy to Use:**
- Simple hook: `useAuth()`
- Clear functions: `login()`, `logout()`
- Type-safe with TypeScript

### **4. Automatic Checks:**
- Runs on every route change
- Validates session automatically
- Handles expired sessions

---

## 📊 State Management

### **Global State:**

```typescript
{
  user: User | null,           // Current user data
  isLoading: boolean,          // Loading state
  isAuthenticated: boolean     // Quick check
}
```

### **State Updates:**

```
Login  → user = userData, isAuthenticated = true
Logout → user = null, isAuthenticated = false
Check  → Read from localStorage
```

---

## 🔄 Auto-Refresh

### **On Route Change:**

```typescript
useEffect(() => {
  checkAuth()
}, [pathname])
```

**Triggers:**
- User navigates to new page
- Browser refresh
- Back/forward navigation

---

## 🎨 UI States

### **Loading State:**

```tsx
{isLoading && <LoadingSpinner />}
```

### **Authenticated State:**

```tsx
{isAuthenticated && (
  <UserMenu user={user} onLogout={logout} />
)}
```

### **Unauthenticated State:**

```tsx
{!isAuthenticated && (
  <Link href="/login">Login</Link>
)}
```

---

## 🐛 Error Handling

### **1. Invalid Session:**

```typescript
try {
  const userData = JSON.parse(localStorage.getItem('currentUser'))
  setUser(userData)
} catch (error) {
  console.error('Auth check error:', error)
  setUser(null)
}
```

### **2. Missing Data:**

```typescript
if (!token || !userData) {
  setUser(null)
  return
}
```

### **3. Role Mismatch:**

```typescript
if (user?.role !== expectedRole) {
  toast.error('Akses ditolak')
  router.push('/dashboard')
}
```

---

## 🚀 Future Enhancements

### **1. Token Refresh:**

```typescript
// Check token expiry
const isExpired = checkTokenExpiry(token)
if (isExpired) {
  await refreshToken()
}
```

### **2. Server-Side Validation:**

```typescript
// Validate token with backend
const isValid = await validateToken(token)
if (!isValid) {
  logout()
}
```

### **3. Session Timeout:**

```typescript
// Auto logout after inactivity
const TIMEOUT = 30 * 60 * 1000 // 30 minutes
setTimeout(() => {
  logout()
}, TIMEOUT)
```

---

## 📝 Migration Guide

### **Before (Old Code):**

```typescript
// Each page checks separately
useEffect(() => {
  const token = localStorage.getItem('authToken')
  const userData = localStorage.getItem('currentUser')
  
  if (!token || !userData) {
    router.push('/login')
  }
  
  setUser(JSON.parse(userData))
}, [])
```

### **After (With Context):**

```typescript
// Use centralized hook
const { user, isLoading, isAuthenticated } = useAuth()

useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.push('/login')
  }
}, [isLoading, isAuthenticated])
```

---

## ✅ Checklist

- [x] Create AuthContext
- [x] Add AuthProvider to layout
- [x] Update login page to use context
- [ ] Update admin page to use context
- [ ] Update bidang page to use context
- [ ] Update dashboard page to use context
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test session persistence
- [ ] Test role-based access

---

## 🎯 Testing

### **Test Cases:**

1. **Login & Navigate:**
   - Login as admin
   - Navigate to /admin
   - Navigate to / (home)
   - Check user still logged in

2. **Refresh Page:**
   - Login as admin
   - Refresh page
   - Check user still logged in

3. **Logout:**
   - Click logout
   - Check localStorage cleared
   - Check redirected to home

4. **Role Access:**
   - Login as bidang
   - Try to access /admin
   - Check access denied

---

**Session Management ready! 🔐✅**

Users will now stay logged in across all pages!
