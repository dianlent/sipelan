import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id
    const body = await request.json()
    const { nama_lengkap, email, username, role, password } = body

    console.log('=== UPDATE USER API ===')
    console.log('User ID:', userId)
    console.log('Update data:', { nama_lengkap, email, username, role, hasPassword: !!password })

    // Validate required fields
    if (!nama_lengkap || !email || !username || !role) {
      return NextResponse.json(
        { success: false, message: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    // Check if username or email already exists (excluding current user)
    const { data: existingUsers } = await supabaseAdmin
      .from('users')
      .select('id, username, email')
      .or(`username.eq.${username},email.eq.${email}`)
      .neq('id', userId)

    if (existingUsers && existingUsers.length > 0) {
      const duplicateUsername = existingUsers.find(u => u.username === username)
      const duplicateEmail = existingUsers.find(u => u.email === email)
      
      if (duplicateUsername) {
        return NextResponse.json(
          { success: false, message: 'Username sudah digunakan' },
          { status: 400 }
        )
      }
      if (duplicateEmail) {
        return NextResponse.json(
          { success: false, message: 'Email sudah digunakan' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {
      nama_lengkap,
      email,
      username,
      role,
      updated_at: new Date().toISOString()
    }

    // Hash password if provided
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      updateData.password_hash = hashedPassword
      console.log('Password will be updated')
    }

    // Update user
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, message: 'Gagal update user: ' + error.message },
        { status: 500 }
      )
    }

    console.log('User updated successfully:', data.id)
    console.log('======================')

    return NextResponse.json({
      success: true,
      message: 'User berhasil diupdate',
      data
    })

  } catch (error: any) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server: ' + error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    console.log('=== DELETE USER API ===')
    console.log('User ID:', userId)

    // Delete user
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, message: 'Gagal hapus user: ' + error.message },
        { status: 500 }
      )
    }

    console.log('User deleted successfully')
    console.log('======================')

    return NextResponse.json({
      success: true,
      message: 'User berhasil dihapus'
    })

  } catch (error: any) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server: ' + error.message },
      { status: 500 }
    )
  }
}
