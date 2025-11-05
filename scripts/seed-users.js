/**
 * Seed Users to localStorage
 * Run this in browser console to create mock users for testing
 */

const mockUsers = [
  {
    id: 'user-admin-1',
    username: 'admin',
    email: 'admin@disnaker.go.id',
    nama_lengkap: 'Administrator',
    role: 'admin',
    is_active: true
  },
  {
    id: 'user-bidang-hi',
    username: 'bidang_hi',
    email: 'hi@disnaker.go.id',
    nama_lengkap: 'Petugas Bidang HI',
    role: 'bidang',
    kode_bidang: 'HI',  // IMPORTANT: Must match with bidangList kode
    is_active: true
  },
  {
    id: 'user-bidang-lattas',
    username: 'bidang_lattas',
    email: 'lattas@disnaker.go.id',
    nama_lengkap: 'Petugas Bidang LATTAS',
    role: 'bidang',
    kode_bidang: 'LATTAS',
    is_active: true
  },
  {
    id: 'user-bidang-ptpk',
    username: 'bidang_ptpk',
    email: 'ptpk@disnaker.go.id',
    nama_lengkap: 'Petugas Bidang PTPK',
    role: 'bidang',
    kode_bidang: 'PTPK',
    is_active: true
  },
  {
    id: 'user-bidang-blk',
    username: 'bidang_blk',
    email: 'blk@disnaker.go.id',
    nama_lengkap: 'Petugas UPTD BLK',
    role: 'bidang',
    kode_bidang: 'BLK',
    is_active: true
  },
  {
    id: 'user-bidang-sekretariat',
    username: 'sekretariat',
    email: 'sekretariat@disnaker.go.id',
    nama_lengkap: 'Petugas Sekretariat',
    role: 'bidang',
    kode_bidang: 'SEKRETARIAT',
    is_active: true
  }
]

// Function to seed users
function seedUsers() {
  console.log('=== SEEDING USERS ===')
  
  // Store users in localStorage (for mock authentication)
  localStorage.setItem('mockUsers', JSON.stringify(mockUsers))
  
  console.log('✅ Users seeded successfully!')
  console.log('Total users:', mockUsers.length)
  console.log('')
  console.log('Available accounts:')
  console.log('---------------------')
  
  mockUsers.forEach(user => {
    console.log(`📧 ${user.email}`)
    console.log(`   Role: ${user.role}`)
    if (user.kode_bidang) {
      console.log(`   Kode Bidang: ${user.kode_bidang}`)
    }
    console.log('')
  })
  
  console.log('Note: Default password for all users is "password123"')
  console.log('')
  console.log('=== SEEDING COMPLETE ===')
}

// Auto-run if loaded in browser
if (typeof window !== 'undefined') {
  seedUsers()
}

// Export for node environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { mockUsers, seedUsers }
}
