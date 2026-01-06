import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'

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
    const existingUsers = await query(
      `
        SELECT id, username, email
        FROM users
        WHERE (username = $1 OR email = $2)
          AND id <> $3
      `,
      [username, email, userId]
    )

    if (existingUsers.rows.length > 0) {
      const duplicateUsername = existingUsers.rows.find(u => u.username === username)
      const duplicateEmail = existingUsers.rows.find(u => u.email === email)
      
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

    const updateFields = ['nama_lengkap', 'email', 'username', 'role']
    const updateValues: Array<string | number> = [nama_lengkap, email, username, role]
    const setClauses = updateFields.map((field, index) => `${field} = $${index + 1}`)

    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      updateValues.push(hashedPassword)
      setClauses.push(`password_hash = $${updateValues.length}`)
      console.log('Password will be updated')
    }

    updateValues.push(userId)

    const { rows } = await query(
      `
        UPDATE users
        SET ${setClauses.join(', ')}, updated_at = NOW()
        WHERE id = $${updateValues.length}
        RETURNING *
      `,
      updateValues
    )

    const updatedUser = rows[0]

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'Gagal update user' },
        { status: 500 }
      )
    }

    console.log('User updated successfully:', updatedUser.id)
    console.log('======================')

    return NextResponse.json({
      success: true,
      message: 'User berhasil diupdate',
      data: updatedUser
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

    await query('DELETE FROM users WHERE id = $1', [userId])

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
