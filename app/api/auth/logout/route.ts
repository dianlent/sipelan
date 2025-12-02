import { NextRequest, NextResponse } from 'next/server'
import { logout } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    // Delete session and clear cookie
    await logout()

    return NextResponse.json({
      success: true,
      message: 'Logout berhasil'
    })
  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
