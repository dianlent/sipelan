// Test Supabase Connection
// Run: node scripts/test-supabase-connection.js

require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

console.log('\n===========================================')
console.log('🔍 TESTING SUPABASE CONNECTION')
console.log('===========================================\n')

// Check environment variables
console.log('📋 Environment Variables:')
console.log('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
console.log('  SUPABASE_SERVICE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing')
console.log('')

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables!')
  console.log('\nPlease check your .env file.')
  process.exit(1)
}

// Create clients
const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testConnection() {
  try {
    console.log('🔌 Testing connection...\n')

    // Test 1: Check tables exist
    console.log('1️⃣ Checking tables...')
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1)

    if (tablesError) {
      console.log('   ❌ Error:', tablesError.message)
      console.log('   💡 Run database/schema.sql in Supabase SQL Editor')
    } else {
      console.log('   ✅ Tables exist')
    }

    // Test 2: Check users
    console.log('\n2️⃣ Checking users...')
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('username, email, role, is_active')
      .limit(10)

    if (usersError) {
      console.log('   ❌ Error:', usersError.message)
    } else {
      console.log(`   ✅ Found ${users.length} users:`)
      users.forEach(user => {
        console.log(`      - ${user.username} (${user.email}) - ${user.role} - ${user.is_active ? 'Active' : 'Inactive'}`)
      })
    }

    // Test 3: Check sessions table
    console.log('\n3️⃣ Checking sessions table...')
    const { data: sessions, error: sessionsError } = await supabaseAdmin
      .from('sessions')
      .select('count')
      .limit(1)

    if (sessionsError) {
      console.log('   ❌ Sessions table not found')
      console.log('   💡 Run database/add_sessions_table.sql in Supabase SQL Editor')
    } else {
      console.log('   ✅ Sessions table exists')
    }

    // Test 4: Check bidang
    console.log('\n4️⃣ Checking bidang...')
    const { data: bidang, error: bidangError } = await supabaseAdmin
      .from('bidang')
      .select('kode_bidang, nama_bidang')

    if (bidangError) {
      console.log('   ❌ Error:', bidangError.message)
    } else {
      console.log(`   ✅ Found ${bidang.length} bidang:`)
      bidang.forEach(b => {
        console.log(`      - ${b.kode_bidang}: ${b.nama_bidang}`)
      })
    }

    // Test 5: Check kategori
    console.log('\n5️⃣ Checking kategori pengaduan...')
    const { data: kategori, error: kategoriError } = await supabaseAdmin
      .from('kategori_pengaduan')
      .select('nama_kategori')

    if (kategoriError) {
      console.log('   ❌ Error:', kategoriError.message)
    } else {
      console.log(`   ✅ Found ${kategori.length} kategori:`)
      kategori.forEach(k => {
        console.log(`      - ${k.nama_kategori}`)
      })
    }

    console.log('\n===========================================')
    console.log('✅ CONNECTION TEST COMPLETE')
    console.log('===========================================\n')

  } catch (error) {
    console.error('\n❌ Connection test failed:', error.message)
    console.log('\nPlease check:')
    console.log('1. Supabase project is running')
    console.log('2. Environment variables are correct')
    console.log('3. Database schema is set up')
    process.exit(1)
  }
}

testConnection()
