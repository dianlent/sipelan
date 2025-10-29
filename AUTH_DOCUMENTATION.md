# Authentication & Authorization Documentation - SIPELAN

## 🔐 Sistem Autentikasi

### User Roles

SIPELAN memiliki 3 role pengguna:

1. **USER** (Masyarakat)
   - Dapat membuat pengaduan
   - Dapat melacak pengaduan sendiri
   - Dapat melihat profil sendiri

2. **PEGAWAI** (Pegawai Disnaker)
   - Semua akses USER
   - Dapat melihat semua pengaduan
   - Dapat mengupdate status pengaduan
   - Dapat menambah komentar/history

3. **ADMINISTRATOR** (Administrator Sistem)
   - Semua akses PEGAWAI
   - Dapat mengelola user (CRUD)
   - Dapat melihat dashboard analytics
   - Dapat mengakses semua fitur sistem

## 📊 Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed with bcrypt
  nama      String
  nip       String?  @unique // Untuk Pegawai & Administrator
  role      Role     @default(USER)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  pengaduan        Pengaduan[]
  pengaduanHistory PengaduanHistory[]
}

enum Role {
  USER          // Masyarakat umum
  PEGAWAI       // Pegawai Disnaker
  ADMINISTRATOR // Administrator sistem
}
```

## 📡 API Endpoints

### 1. Register

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nama": "Nama Lengkap",
  "nip": "198501012010011001", // Optional, untuk Pegawai/Admin
  "role": "USER" // Optional, default USER
}
```

**Response Success (201)**:
```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "email": "user@example.com",
    "nama": "Nama Lengkap",
    "nip": null,
    "role": "USER",
    "createdAt": "2024-10-27T10:00:00Z"
  },
  "message": "Registrasi berhasil"
}
```

**Response Error (400)**:
```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```

### 2. Login

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "nama": "Nama Lengkap",
      "nip": null,
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login berhasil"
}
```

**Response Error (401)**:
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

**Response Error (403)**:
```json
{
  "success": false,
  "message": "Akun Anda telah dinonaktifkan. Hubungi administrator."
}
```

### 3. Get Current User

**Endpoint**: `GET /api/auth/me`

**Headers**:
```
Authorization: Bearer <token>
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "email": "user@example.com",
    "nama": "Nama Lengkap",
    "nip": null,
    "role": "USER",
    "isActive": true,
    "createdAt": "2024-10-27T10:00:00Z",
    "updatedAt": "2024-10-27T10:00:00Z"
  }
}
```

### 4. Get All Users (Administrator Only)

**Endpoint**: `GET /api/users?page=1&limit=10&role=PEGAWAI&search=ahmad`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `role`: Filter by role (USER, PEGAWAI, ADMINISTRATOR)
- `search`: Search by nama, email, or nip

**Response Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx...",
      "email": "pegawai@example.com",
      "nama": "Ahmad Fauzi",
      "nip": "198501012010011001",
      "role": "PEGAWAI",
      "isActive": true,
      "createdAt": "2024-10-27T10:00:00Z",
      "updatedAt": "2024-10-27T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### 5. Create User (Administrator Only)

**Endpoint**: `POST /api/users`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Request Body**:
```json
{
  "email": "pegawai@example.com",
  "password": "password123",
  "nama": "Ahmad Fauzi",
  "nip": "198501012010011001",
  "role": "PEGAWAI"
}
```

**Response Success (201)**:
```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "email": "pegawai@example.com",
    "nama": "Ahmad Fauzi",
    "nip": "198501012010011001",
    "role": "PEGAWAI",
    "isActive": true,
    "createdAt": "2024-10-27T10:00:00Z"
  },
  "message": "User berhasil dibuat"
}
```

### 6. Get User by ID

**Endpoint**: `GET /api/users/[id]`

**Headers**:
```
Authorization: Bearer <token>
```

**Note**: Users can only access their own profile, unless they're Administrator

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "email": "user@example.com",
    "nama": "Nama Lengkap",
    "nip": null,
    "role": "USER",
    "isActive": true,
    "createdAt": "2024-10-27T10:00:00Z",
    "updatedAt": "2024-10-27T10:00:00Z"
  }
}
```

### 7. Update User

**Endpoint**: `PATCH /api/users/[id]`

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "nama": "Nama Baru",
  "email": "newemail@example.com",
  "password": "newpassword123",
  "role": "PEGAWAI", // Only Administrator can update
  "isActive": false // Only Administrator can update
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "email": "newemail@example.com",
    "nama": "Nama Baru",
    "nip": null,
    "role": "USER",
    "isActive": true,
    "updatedAt": "2024-10-27T11:00:00Z"
  },
  "message": "User berhasil diupdate"
}
```

### 8. Delete User (Administrator Only)

**Endpoint**: `DELETE /api/users/[id]`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Note**: Cannot delete own account

**Response Success (200)**:
```json
{
  "success": true,
  "message": "User berhasil dihapus"
}
```

## 🔒 Security Features

### Password Hashing
- Menggunakan **bcryptjs** dengan salt rounds 10
- Password tidak pernah disimpan dalam plain text

### JWT Token
- Token expires dalam 7 hari
- Payload berisi: userId, email, nama, role
- Secret key dari environment variable

### Middleware Protection
- **authenticate()**: Verifikasi token
- **authorize()**: Verifikasi role
- **authMiddleware()**: Kombinasi keduanya

## 🛡️ Authorization Matrix

| Endpoint | USER | PEGAWAI | ADMINISTRATOR |
|----------|------|---------|---------------|
| POST /api/auth/register | ✅ | ✅ | ✅ |
| POST /api/auth/login | ✅ | ✅ | ✅ |
| GET /api/auth/me | ✅ | ✅ | ✅ |
| GET /api/users | ❌ | ❌ | ✅ |
| POST /api/users | ❌ | ❌ | ✅ |
| GET /api/users/[id] | Own only | Own only | ✅ All |
| PATCH /api/users/[id] | Own only | Own only | ✅ All |
| DELETE /api/users/[id] | ❌ | ❌ | ✅ |
| GET /api/pengaduan | ❌ | ✅ | ✅ |
| PATCH /api/pengaduan/[ticket] | ❌ | ✅ | ✅ |
| GET /api/admin/* | ❌ | ❌ | ✅ |

## 💻 Frontend Integration

### 1. Login Flow

```typescript
// Login function
async function login(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Save token to localStorage
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    
    // Redirect based on role
    if (data.data.user.role === 'ADMINISTRATOR') {
      window.location.href = '/admin/dashboard';
    } else if (data.data.user.role === 'PEGAWAI') {
      window.location.href = '/pegawai/dashboard';
    } else {
      window.location.href = '/user/dashboard';
    }
  }
}
```

### 2. Protected API Calls

```typescript
// Make authenticated request
async function fetchProtectedData() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/protected-endpoint', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  return response.json();
}
```

### 3. Check Authentication

```typescript
// Check if user is logged in
function isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  return !!token;
}

// Get current user
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Check user role
function hasRole(role: string): boolean {
  const user = getCurrentUser();
  return user?.role === role;
}
```

### 4. Logout

```typescript
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

## 🧪 Testing

### Test Users

```sql
-- Create test users
INSERT INTO users (id, email, password, nama, nip, role, is_active) VALUES
('user1', 'user@test.com', '$2a$10$...', 'Test User', NULL, 'USER', true),
('pegawai1', 'pegawai@test.com', '$2a$10$...', 'Test Pegawai', '198501012010011001', 'PEGAWAI', true),
('admin1', 'admin@test.com', '$2a$10$...', 'Test Admin', '198501012010011002', 'ADMINISTRATOR', true);

-- Password for all: password123
```

### API Testing with curl

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","nama":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"

# Get all users (admin)
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer <admin_token>"
```

## 🔄 Migration

### Run Migration

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name add_user_authentication

# Apply migration
npx prisma migrate deploy
```

## 📝 Environment Variables

```env
# JWT Secret (REQUIRED)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sipelan"
```

## 🚀 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Setup environment variables
3. ✅ Run migrations: `npx prisma migrate dev`
4. ✅ Create admin user
5. ✅ Test authentication flow
6. ✅ Build login/register pages
7. ✅ Implement role-based dashboards

---

**Status**: ✅ Authentication System Complete  
**Version**: 1.0  
**Last Updated**: 27 Oktober 2024
