import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createSession, setSessionCookie } from '@/lib/session'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Get user agent and IP for session tracking
    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email dan password harus diisi' },
        { status: 400 }
      )
    }

    // Find user by email
    const { rows } = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email])
    const user = rows[0]

    // Debug logging
    console.log('dY"? Login attempt:', { email })
    console.log('dY"S Query result:', { 
      found: !!user, 
      error: user ? null : 'not_found',
      userId: user?.id,
      userEmail: user?.email,
      userRole: user?.role,
      isActive: user?.is_active
    })

    if (!user) {
      console.log('ƒ?O User not found')
      return NextResponse.json(
        { success: false, message: 'Email atau password salah' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json(
        { success: false, message: 'Akun tidak aktif' },
        { status: 401 }
      )
    }

    // Verify password
    console.log('dY"? Verifying password...')
    console.log('Password hash length:', user.password_hash?.length)
    console.log('Password hash prefix:', user.password_hash?.substring(0, 7))
    
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    console.log('ƒo. Password valid:', isValidPassword)
    
    if (!isValidPassword) {
      console.log('ƒ?O Invalid password for user:', email)
      return NextResponse.json(
        { success: false, message: 'Email atau password salah' },
        { status: 401 }
      )
    }

    // Create session in database
    const sessionToken = await createSession(user.id, userAgent, ipAddress)
    
    // Set HTTP-only cookie
    await setSessionCookie(sessionToken)

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: 'Login berhasil',
      data: {
        user: userWithoutPassword
      }
    })
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
