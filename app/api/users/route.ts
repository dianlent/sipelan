import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('=== GET Users API Called ===')
    
    const { rows: users } = await query(
      `
        SELECT id, username, email, nama_lengkap, role, bidang_id, kode_bidang, is_active, created_at, updated_at
        FROM users
        ORDER BY created_at DESC
      `
    )

    console.log('Users fetched successfully:', users?.length || 0)

    return NextResponse.json({
      success: true,
      data: users || []
    })
  } catch (error: any) {
    console.error('Get users error:', error)
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Gagal mengambil data user'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password, nama_lengkap, role, bidang_id, kode_bidang } = body

    console.log('Creating new user:', { username, email, role })

    const { rows } = await query(
      `
        INSERT INTO users (
          username,
          email,
          password_hash,
          nama_lengkap,
          role,
          bidang_id,
          kode_bidang,
          is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, true)
        RETURNING *
      `,
      [
        username,
        email,
        password,
        nama_lengkap,
        role,
        role === 'bidang' ? bidang_id : null,
        role === 'bidang' ? kode_bidang : null
      ]
    )

    const newUser = rows[0]

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
