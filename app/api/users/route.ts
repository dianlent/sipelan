import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, email, nama_lengkap, role, bidang_id, no_telepon, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: users
    })
  } catch (error: any) {
    console.error('Get users error:', error)
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password, nama_lengkap, role, bidang_id, no_telepon } = body

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        username,
        email,
        password, // Should be hashed in production
        nama_lengkap,
        role,
        bidang_id: role === 'bidang' ? bidang_id : null,
        no_telepon
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'User berhasil ditambahkan',
      data: newUser
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create user error:', error)
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 })
  }
}
