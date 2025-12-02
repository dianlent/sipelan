# 🏢 Nama Bidang di Timeline

## ✅ Update Timeline

Timeline pengaduan sekarang menampilkan **nama bidang** pada status "Pengaduan Terdisposisi"!

---

## 🎯 Yang Ditambahkan

### **Sebelum:**
```
● Pengaduan Terdisposisi
  Pengaduan telah didisposisi ke bidang terkait untuk ditindaklanjuti
```

### **Sesudah:**
```
● Pengaduan Terdisposisi
  Pengaduan telah didisposisi ke Bidang Hubungan Industrial
```

**Nama bidang ditampilkan secara dinamis!**

---

## 💻 Implementation

### **1. Interface Update**

```typescript
// TimelineStep
interface TimelineStep {
  ...
  bidang_nama?: string  // ✅ NEW
}

// PengaduanTimelineProps
interface PengaduanTimelineProps {
  ...
  bidangNama?: string  // ✅ NEW - from parent
  timeline?: Array<{
    ...
    bidang_nama?: string  // ✅ NEW - from timeline item
  }>
}
```

### **2. Component Logic**

```typescript
export default function PengaduanTimeline({ 
  currentStatus, 
  timeline = [], 
  bidangNama  // ✅ Receive from parent
}: PengaduanTimelineProps) {
  
  const steps = statusOrder.map((statusKey, index) => {
    const timelineItem = timeline.find(item => item.status === statusKey)
    
    // Custom description for terdisposisi with bidang name
    let description = timelineItem?.keterangan || info.description
    if (statusKey === 'terdisposisi' && bidangNama) {
      description = `Pengaduan telah didisposisi ke Bidang ${bidangNama}`
    }
    
    return {
      ...
      description: description,
      bidang_nama: timelineItem?.bidang_nama || bidangNama
    }
  })
}
```

### **3. Parent Component**

```typescript
// app/tracking/page.tsx
<PengaduanTimeline 
  currentStatus={currentStatus}
  timeline={pengaduan.timeline}
  bidangNama={pengaduan.bidang?.nama_bidang}  // ✅ Pass bidang name
/>
```

---

## 🔄 Data Flow

```
API Response:
{
  bidang: {
    bidang_id: 1,
    nama_bidang: "Hubungan Industrial",
    kode_bidang: "HI"
  },
  timeline: [
    { status: 'terdisposisi', keterangan: '...' }
  ]
}
    ↓
Tracking Page:
<PengaduanTimeline bidangNama="Hubungan Industrial" />
    ↓
Timeline Component:
if (status === 'terdisposisi' && bidangNama) {
  description = `Pengaduan telah didisposisi ke Bidang ${bidangNama}`
}
    ↓
Display:
"Pengaduan telah didisposisi ke Bidang Hubungan Industrial"
```

---

## 📊 Example Display

### **Bidang HI (Hubungan Industrial)**

```
✅ Pengaduan Masuk
   Pengaduan telah diterima dan dicatat dalam sistem
   📅 1 Des 2025, 10:00

✅ Pengaduan Terverifikasi
   Pengaduan telah diverifikasi oleh admin
   📅 1 Des 2025, 14:00

⏳ Pengaduan Terdisposisi
   Pengaduan telah didisposisi ke Bidang Hubungan Industrial
   📅 2 Des 2025, 09:00

⏸️ Tanggapan
   Bidang terkait memberikan tanggapan

⏸️ Selesai
   Pengaduan telah selesai diproses
```

### **Bidang HK (Hubungan Ketenagakerjaan)**

```
⏳ Pengaduan Terdisposisi
   Pengaduan telah didisposisi ke Bidang Hubungan Ketenagakerjaan
   📅 2 Des 2025, 09:00
```

### **Bidang LATTAS (Pelatihan dan Penempatan Tenaga Kerja)**

```
⏳ Pengaduan Terdisposisi
   Pengaduan telah didisposisi ke Bidang Pelatihan dan Penempatan Tenaga Kerja
   📅 2 Des 2025, 09:00
```

---

## 🎨 UI Preview

**Timeline Card:**
```
┌─────────────────────────────────────────────────────┐
│ 📊 Timeline Pengaduan                               │
│ Lacak progress pengaduan Anda                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 1 Des 2025    ●─── Pengaduan Masuk                 │
│ 10:00              Pengaduan telah diterima        │
│                                                     │
│ 1 Des 2025    ●─── Pengaduan Terverifikasi         │
│ 14:00              Pengaduan telah diverifikasi    │
│                                                     │
│ 2 Des 2025    ◐─── Pengaduan Terdisposisi          │
│ 09:00              Pengaduan telah didisposisi ke  │
│                    Bidang Hubungan Industrial      │
│                                                     │
│               ○─── Tanggapan                        │
│                    Bidang terkait memberikan       │
│                    tanggapan                       │
│                                                     │
│               ○─── Selesai                          │
│                    Pengaduan telah selesai         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Files Updated

### **1. components/PengaduanTimeline.tsx**
- ✅ Added `bidang_nama` to TimelineStep interface
- ✅ Added `bidangNama` prop to component
- ✅ Added logic to customize description for terdisposisi
- ✅ Pass bidang_nama to step object

### **2. app/tracking/page.tsx**
- ✅ Pass `bidangNama={pengaduan.bidang?.nama_bidang}` to PengaduanTimeline

---

## 🧪 Testing

### Test 1: Disposisi ke Bidang HI

```
1. Admin disposisi pengaduan ke Bidang HI
2. Pelapor buka tracking
3. Expected:
   ✅ Status "Pengaduan Terdisposisi" tampil
   ✅ Description: "...ke Bidang Hubungan Industrial"
```

### Test 2: Disposisi ke Bidang HK

```
1. Admin disposisi ke Bidang HK
2. Check timeline
3. Expected:
   ✅ Description: "...ke Bidang Hubungan Ketenagakerjaan"
```

### Test 3: Belum Disposisi

```
1. Pengaduan masih status "terverifikasi"
2. Check timeline
3. Expected:
   ⏸️ Status "Terdisposisi" pending (abu-abu)
   ✅ Description: Default text (tanpa nama bidang)
```

---

## 🐛 Troubleshooting

### Nama bidang tidak tampil

**Check:**
```typescript
// 1. API mengirim data bidang?
console.log(pengaduan.bidang)
// Expected: { nama_bidang: "...", kode_bidang: "..." }

// 2. Prop dikirim ke component?
console.log(bidangNama)
// Expected: "Hubungan Industrial"
```

**Solution:**
- Pastikan API include bidang relation
- Pastikan prop bidangNama di-pass ke component

### Tampil "undefined" atau "null"

**Check:**
```typescript
// Conditional rendering
if (statusKey === 'terdisposisi' && bidangNama) {
  // ✅ Only if bidangNama exists
}
```

---

## 📊 Benefits

| Feature | Before | After |
|---------|--------|-------|
| **Bidang Info** | ❌ Generic text | ✅ Specific bidang |
| **Clarity** | ❌ "bidang terkait" | ✅ "Bidang HI" |
| **Transparency** | ❌ Hidden | ✅ Visible |
| **User Experience** | ❌ Unclear | ✅ Clear |

---

## ✅ Summary

**Timeline sekarang menampilkan:**

1. ✅ **Nama bidang** pada status terdisposisi
2. ✅ **Dinamis** sesuai disposisi admin
3. ✅ **Jelas** untuk pelapor
4. ✅ **Transparan** tentang penanganan

**Contoh:**
- "Pengaduan telah didisposisi ke **Bidang Hubungan Industrial**"
- "Pengaduan telah didisposisi ke **Bidang Hubungan Ketenagakerjaan**"

**Pelapor tahu pengaduan ditangani oleh bidang mana!** 🏢✅
