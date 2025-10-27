# Dokumentasi Halaman Lacak Pengaduan

## ✅ Fitur yang Telah Diimplementasikan

### 1. Ticket Search System

#### Search Interface
- **Input Field**: Large, prominent search box
- **Auto-uppercase**: Ticket numbers automatically converted to uppercase
- **Enter key support**: Press Enter to search
- **Loading state**: Spinner animation during search
- **Error handling**: Clear error messages for invalid tickets

#### URL Parameter Support
- **Auto-search**: If `?ticket=ADU-202410-3847` in URL, automatically searches
- **Deep linking**: Share direct links to specific complaints
- **Integration**: Works seamlessly with "Lacak Pengaduan" button from form success page

### 2. Status Display System

#### Status Badges
Four distinct status types with color coding:
- **Menunggu** (Pending) - Yellow badge with Clock icon
- **Diproses** (In Progress) - Blue badge with AlertCircle icon
- **Selesai** (Completed) - Green badge with CheckCircle icon
- **Ditolak** (Rejected) - Red badge with XCircle icon

#### Visual Indicators
- Color-coded badges
- Icon representation
- Clear status labels in Indonesian

### 3. Timeline Component

#### Visual Timeline
- **Vertical timeline** with connecting lines
- **Icon indicators**:
  - Green checkmark for completed steps
  - Blue clock for current/latest step
- **Timestamp display**: Date and time in Indonesian format
- **Officer information**: Shows which staff member handled each step
- **Detailed descriptions**: Clear explanation of each status change

#### Timeline Features
- Chronological order (oldest to newest)
- Responsive design
- Clear visual hierarchy
- Professional appearance

### 4. Complaint Details Display

#### Overview Card
Shows key information at a glance:
- **Title**: Complaint title
- **Ticket Number**: Monospace font for easy reading
- **Status Badge**: Current status
- **Date**: Submission date
- **Location**: Incident location
- **Category**: Complaint category

#### Detailed Information
- **Full Description**: Complete complaint narrative
- **Incident Date**: When the issue occurred
- **Supporting Evidence**: List of uploaded files with download buttons
- **File Information**: Name and size display

### 5. Reporter Information

Protected display of reporter details:
- **Name**: Full name
- **Email**: Contact email
- **Phone**: Contact number

### 6. Mock Data for Testing

Two complete test cases included:

**Test Case 1: ADU-202410-3847**
- Status: In Progress (Diproses)
- 3 timeline entries
- 2 attached files
- Full complaint details

**Test Case 2: ADU-202410-1234**
- Status: Completed (Selesai)
- 4 timeline entries (full lifecycle)
- No attached files
- Resolution details

### 7. User Experience Features

#### Quick Test Buttons
- Demo ticket buttons for easy testing
- One-click to load sample data
- Helpful for development and demos

#### Error States
- **Not Found**: Clear message when ticket doesn't exist
- **Empty Input**: Validation for empty search
- **Network Error**: Graceful error handling

#### Loading States
- Search button shows spinner
- Disabled during loading
- "Mencari..." text feedback

#### Responsive Design
- Mobile-optimized layout
- Tablet-friendly grid
- Desktop full-width display
- Touch-friendly buttons

### 8. Components Created

```typescript
// New UI Components:
- Badge (src/components/ui/badge.tsx)
  - Multiple variants (success, warning, info, destructive)
  - Icon support
  
- Separator (src/components/ui/separator.tsx)
  - Horizontal/vertical dividers
  - Clean visual breaks
```

## 📊 Data Structure

### PengaduanData Interface

```typescript
interface PengaduanData {
  ticketNumber: string;
  status: "pending" | "diproses" | "selesai" | "ditolak";
  
  // Reporter Data
  nama: string;
  email: string;
  telepon: string;
  
  // Complaint Data
  kategori: string;
  judul: string;
  deskripsi: string;
  lokasi: string;
  tanggalKejadian: string;
  tanggalPengaduan: string;
  
  // Timeline
  timeline: {
    status: string;
    keterangan: string;
    tanggal: string;
    petugas?: string;
  }[];
  
  // Files (optional)
  files?: {
    name: string;
    size: number;
    url: string;
  }[];
}
```

## 🔄 Backend Integration Guide

### API Endpoint Required

```typescript
GET /api/pengaduan/:ticketNumber

Response (Success - 200):
{
  success: true,
  data: {
    ticketNumber: "ADU-202410-3847",
    status: "diproses",
    nama: "Budi Santoso",
    email: "budi.santoso@example.com",
    telepon: "081234567890",
    kategori: "Upah/Gaji Tidak Dibayar",
    judul: "Gaji Bulan September Belum Dibayar",
    deskripsi: "...",
    lokasi: "PT XYZ, Pati",
    tanggalKejadian: "2024-09-30",
    tanggalPengaduan: "2024-10-15",
    timeline: [
      {
        status: "Pengaduan Diterima",
        keterangan: "...",
        tanggal: "2024-10-15 10:30",
        petugas: "Ahmad Fauzi"
      }
    ],
    files: [
      {
        name: "slip_gaji.pdf",
        size: 245000,
        url: "/uploads/files/slip_gaji.pdf"
      }
    ]
  }
}

Response (Not Found - 404):
{
  success: false,
  message: "Nomor tiket tidak ditemukan"
}

Response (Error - 500):
{
  success: false,
  message: "Terjadi kesalahan server"
}
```

### Implementation Example

Replace lines 172-186 in `src/app/lacak-aduan/page.tsx`:

```typescript
const handleSearch = async (ticket?: string) => {
  const searchTicket = ticket || ticketNumber;
  
  if (!searchTicket.trim()) {
    setError("Masukkan nomor tiket pengaduan");
    return;
  }

  setIsLoading(true);
  setError("");
  setPengaduanData(null);
  setSearchedTicket(searchTicket);

  try {
    const response = await fetch(`/api/pengaduan/${searchTicket}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        setError("Nomor tiket tidak ditemukan. Periksa kembali nomor tiket Anda.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
      return;
    }
    
    const result = await response.json();
    
    if (result.success && result.data) {
      setPengaduanData(result.data);
    } else {
      setError("Data tidak valid.");
    }
  } catch (err) {
    setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
  } finally {
    setIsLoading(false);
  }
};
```

## 🗄️ Database Queries

### Get Complaint by Ticket Number

```sql
-- Main complaint data
SELECT 
  p.*,
  u.nama as nama_pelapor,
  u.email,
  u.telepon
FROM pengaduan p
LEFT JOIN users u ON p.user_id = u.id
WHERE p.ticket_number = ?;

-- Timeline/History
SELECT 
  ph.*,
  u.nama as petugas_nama
FROM pengaduan_history ph
LEFT JOIN users u ON ph.created_by = u.id
WHERE ph.pengaduan_id = ?
ORDER BY ph.created_at ASC;

-- Files
SELECT *
FROM pengaduan_files
WHERE pengaduan_id = ?;
```

## 🎨 Customization

### Adding New Status

Edit `getStatusBadge()` function (line 194-207):

```typescript
const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="warning">...</Badge>;
    case "diproses":
      return <Badge variant="info">...</Badge>;
    case "selesai":
      return <Badge variant="success">...</Badge>;
    case "ditolak":
      return <Badge variant="destructive">...</Badge>;
    case "ditunda": // NEW STATUS
      return <Badge variant="outline">
        <PauseCircle className="h-3 w-3 mr-1" />
        Ditunda
      </Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
```

### Customizing Timeline Icons

Edit timeline rendering (line 383-422):

```typescript
<div className={`w-10 h-10 rounded-full flex items-center justify-center ${
  index === pengaduanData.timeline.length - 1
    ? 'bg-blue-100 text-blue-600'
    : 'bg-green-100 text-green-600'
}`}>
  {/* Customize icons based on status */}
  {item.status === "Selesai" ? (
    <CheckCircle2 className="h-5 w-5" />
  ) : item.status === "Ditolak" ? (
    <XCircle className="h-5 w-5" />
  ) : (
    <Clock className="h-5 w-5" />
  )}
</div>
```

## 🔒 Security & Privacy

### Data Protection
- **Sensitive Data**: NIK not displayed (only in admin panel)
- **Email Masking**: Consider masking email (b***@example.com)
- **Phone Masking**: Consider masking phone (0812****7890)

### Access Control
```typescript
// Add authentication check
const handleSearch = async (ticket?: string) => {
  // Option 1: Public access (current)
  // Anyone can search with ticket number
  
  // Option 2: Authenticated access
  // Require login, only show user's own complaints
  
  // Option 3: Hybrid
  // Public search requires email verification
  const email = prompt("Masukkan email yang terdaftar:");
  // Verify email matches ticket owner
};
```

## 📱 Features by Device

### Mobile (< 768px)
- Single column layout
- Full-width search
- Stacked timeline
- Touch-optimized buttons

### Tablet (768px - 1024px)
- 2-column grid for info cards
- Optimized spacing
- Larger touch targets

### Desktop (> 1024px)
- 3-column grid for overview
- Full-width timeline
- Optimal reading width (max-w-4xl)

## 🧪 Testing Guide

### Manual Testing

1. **Search Functionality**
   - [ ] Empty search shows error
   - [ ] Valid ticket shows results
   - [ ] Invalid ticket shows not found
   - [ ] Enter key triggers search
   - [ ] Loading state displays correctly

2. **URL Parameters**
   - [ ] `?ticket=ADU-202410-3847` auto-searches
   - [ ] Invalid ticket in URL shows error
   - [ ] URL updates on search

3. **Display**
   - [ ] Timeline shows in correct order
   - [ ] Status badges display correctly
   - [ ] Files list shows with sizes
   - [ ] Dates format correctly (Indonesian)
   - [ ] Responsive on all devices

4. **Demo Buttons**
   - [ ] "ADU-202410-3847" loads in-progress case
   - [ ] "ADU-202410-1234" loads completed case

### Test Cases

```typescript
// Test Case 1: In Progress Complaint
Ticket: ADU-202410-3847
Expected: 
- Status badge: "Diproses" (blue)
- 3 timeline entries
- 2 files shown
- All details displayed

// Test Case 2: Completed Complaint
Ticket: ADU-202410-1234
Expected:
- Status badge: "Selesai" (green)
- 4 timeline entries
- No files
- Resolution shown in last timeline entry

// Test Case 3: Not Found
Ticket: ADU-999999-9999
Expected:
- Error alert shown
- "Nomor tiket tidak ditemukan" message
- No data displayed
```

## 📊 Analytics Recommendations

Track these metrics:
- Search attempts (total)
- Successful searches
- Failed searches (not found)
- Most searched tickets
- Average time on page
- File download clicks

## 🚀 Future Enhancements

### Phase 2 Features
1. **Email Notifications**
   - Subscribe to updates
   - Email on status change

2. **Print/Export**
   - Print ticket details
   - Export to PDF

3. **Comments/Messages**
   - Two-way communication
   - Attach additional files
   - Real-time chat

4. **Push Notifications**
   - Browser notifications
   - Mobile app notifications

5. **QR Code**
   - Generate QR for ticket
   - Scan to track

6. **Multi-language**
   - English translation
   - Javanese option

---

**Status**: ✅ **Fully Implemented and Ready for Testing**  
**Last Updated**: 27 Oktober 2024  
**Test Tickets**: ADU-202410-3847, ADU-202410-1234
