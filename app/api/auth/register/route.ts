import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, nama_lengkap, role = 'masyarakat' } = await request.json()

    // Validation
    if (!username || !email || !password || !nama_lengkap) {
      return NextResponse.json(
        { success: false, message: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password minimal 6 karakter' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await query('SELECT id FROM users WHERE email = $1 LIMIT 1', [email])
    if (existingEmail.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    // Check if username already exists
    const existingUsername = await query('SELECT id FROM users WHERE username = $1 LIMIT 1', [username])
    if (existingUsername.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Username sudah digunakan' },
        { status: 400 }
      )
    }

    // Hash password
    const saltRounds = 10
    const password_hash = await bcrypt.hash(password, saltRounds)

    // Create user
    const { rows } = await query(
      `
        INSERT INTO users (username, email, password_hash, nama_lengkap, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [username, email, password_hash, nama_lengkap, role]
    )

    const newUser = rows[0]

    if (!newUser) {
      return NextResponse.json(
        { success: false, message: 'Gagal membuat user' },
        { status: 500 }
      )
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'default-secret-key-change-in-production'
    const token = jwt.sign(
      { 
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role
      },
      jwtSecret,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const { password_hash: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      message: 'User berhasil terdaftar',
      data: {
        user: userWithoutPassword,
        token
      }
    })
  } catch (error) {
    console.error('Register API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
