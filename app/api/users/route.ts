import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    console.log('=== GET Users API Called ===')
    console.log('Supabase URL:', supabaseUrl)
    console.log('Service Key exists:', !!supabaseServiceKey)
    
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, email, nama_lengkap, role, bidang_id, kode_bidang, is_active, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('Users fetched successfully:', users?.length || 0)

    return NextResponse.json({
      success: true,
      data: users || []
    })
  } catch (error: any) {
    console.error('Get users error:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    })
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Gagal mengambil data user',
      error: {
        code: error.code,
        details: error.details,
        hint: error.hint
      }
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password, nama_lengkap, role, bidang_id, kode_bidang } = body

    console.log('Creating new user:', { username, email, role })

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        username,
        email,
        password_hash: password, // Should be hashed in production
        nama_lengkap,
        role,
        bidang_id: role === 'bidang' ? bidang_id : null,
        kode_bidang: role === 'bidang' ? kode_bidang : null,
        is_active: true
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      throw error
    }

    console.log('User created successfully:', newUser.id)

    return NextResponse.json({
      success: true,
      message: 'User berhasil ditambahkan',
      data: newUser
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create user error:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Gagal membuat user baru'
    }, { status: 500 })
  }
}
