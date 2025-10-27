# Contributing to SIPELAN

Terima kasih atas minat Anda untuk berkontribusi pada SIPELAN! 🎉

## 📋 Daftar Isi

- [Code of Conduct](#code-of-conduct)
- [Cara Berkontribusi](#cara-berkontribusi)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 🤝 Code of Conduct

Proyek ini mengikuti kode etik untuk memastikan lingkungan yang ramah dan inklusif:

- Gunakan bahasa yang sopan dan profesional
- Hormati pendapat dan pengalaman orang lain
- Terima kritik yang membangun dengan baik
- Fokus pada apa yang terbaik untuk komunitas

## 🚀 Cara Berkontribusi

### Melaporkan Bug

Jika Anda menemukan bug, silakan buat issue dengan informasi:

1. **Deskripsi bug** - Jelaskan apa yang terjadi
2. **Langkah reproduksi** - Cara untuk mereproduksi bug
3. **Expected behavior** - Apa yang seharusnya terjadi
4. **Screenshots** - Jika applicable
5. **Environment** - OS, browser, versi Node.js

### Mengusulkan Fitur Baru

Untuk fitur baru, buat issue dengan:

1. **Deskripsi fitur** - Apa yang ingin ditambahkan
2. **Motivasi** - Mengapa fitur ini penting
3. **Alternatif** - Solusi alternatif yang sudah dipertimbangkan
4. **Mockup/Design** - Jika ada

### Berkontribusi Code

1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 💻 Development Setup

### Prerequisites

- Node.js 18.x atau lebih tinggi
- PostgreSQL 14.x atau lebih tinggi
- Git
- npm atau yarn

### Installation

```bash
# Clone repository
git clone https://github.com/disnaker-pati/sipelan.git
cd sipelan

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env dengan konfigurasi Anda
# DATABASE_URL, EMAIL_*, JWT_SECRET, dll

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage
```

## 📝 Coding Standards

### TypeScript

- Gunakan TypeScript untuk semua file baru
- Hindari `any` type, gunakan proper typing
- Export types dan interfaces yang reusable

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ Bad
const user: any = { ... };
```

### React Components

- Gunakan functional components dengan hooks
- Pisahkan logic dan presentation
- Gunakan TypeScript untuk props

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Pages: `kebab-case` (e.g., `buat-aduan/page.tsx`)
- API routes: `route.ts`

### Code Organization

```
src/
├── app/              # Next.js app directory
├── components/       # Reusable components
│   ├── ui/          # UI components (shadcn)
│   └── ...
├── lib/             # Utilities and helpers
│   ├── utils/       # Helper functions
│   └── ...
└── types/           # TypeScript types
```

### Styling

- Gunakan TailwindCSS untuk styling
- Ikuti utility-first approach
- Gunakan custom classes di `globals.css` untuk reusable styles

```tsx
// ✅ Good
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">

// ❌ Bad (inline styles)
<div style={{ display: 'flex', padding: '16px' }}>
```

### API Routes

- Gunakan proper HTTP methods (GET, POST, PATCH, DELETE)
- Return consistent response format
- Handle errors properly

```typescript
// Response format
{
  success: boolean;
  data?: any;
  message?: string;
  errors?: any;
}
```

## 📦 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: Fitur baru
- `fix`: Bug fix
- `docs`: Dokumentasi
- `style`: Formatting, missing semi colons, dll
- `refactor`: Code refactoring
- `test`: Menambah tests
- `chore`: Maintenance

### Examples

```bash
feat(pengaduan): add file upload functionality

- Implement multer for file handling
- Add file size validation
- Create upload directory

Closes #123
```

```bash
fix(api): resolve ticket number generation issue

Fixed bug where duplicate ticket numbers could be generated
under high load conditions.

Fixes #456
```

### Scope

- `pengaduan`: Fitur pengaduan
- `admin`: Dashboard admin
- `api`: API endpoints
- `ui`: UI components
- `db`: Database/Prisma
- `auth`: Authentication
- `email`: Email system

## 🔄 Pull Request Process

### Before Submitting

1. ✅ Update documentation jika perlu
2. ✅ Add/update tests
3. ✅ Run linter: `npm run lint`
4. ✅ Run tests: `npm test`
5. ✅ Build succeeds: `npm run build`
6. ✅ Update CHANGELOG.md

### PR Title Format

```
[TYPE] Brief description of changes
```

Examples:
- `[FEAT] Add email notification system`
- `[FIX] Resolve pagination bug in admin dashboard`
- `[DOCS] Update API documentation`

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How has this been tested?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
```

### Review Process

1. Minimal 1 reviewer approval
2. All CI checks must pass
3. No merge conflicts
4. Branch up to date with main

## 🐛 Debugging

### Common Issues

**Prisma Client Error**
```bash
npx prisma generate
```

**Migration Error**
```bash
npx prisma migrate reset
npx prisma migrate dev
```

**Port Already in Use**
```bash
# Kill process on port 3000
npx kill-port 3000
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 💬 Questions?

Jika ada pertanyaan, silakan:
- Buat issue di GitHub
- Hubungi maintainer
- Email: dev@sipelan.patikab.go.id

---

**Terima kasih telah berkontribusi! 🙏**
