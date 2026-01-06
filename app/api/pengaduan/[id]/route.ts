import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET single pengaduan by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    const { rows } = await query(
      `
        SELECT
          p.*,
          json_build_object('id', k.id, 'nama_kategori', k.nama_kategori, 'deskripsi', k.deskripsi) AS kategori_pengaduan,
          json_build_object('bidang_id', b.id, 'nama_bidang', b.nama_bidang, 'kode_bidang', b.kode_bidang) AS bidang,
          json_build_object('nama_lengkap', u.nama_lengkap, 'email', u.email) AS users
        FROM pengaduan p
        LEFT JOIN kategori_pengaduan k ON k.id = p.kategori_id
        LEFT JOIN bidang b ON b.id = p.bidang_id
        LEFT JOIN users u ON u.id = p.user_id
        WHERE p.id = $1
        LIMIT 1
      `,
      [id]
    )

    const data = rows[0]

    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Pengaduan tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

// PATCH - Update pengaduan
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()

    const entries = Object.entries(body || {})
    if (entries.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada data untuk diupdate' },
        { status: 400 }
      )
    }

    const setClauses = entries.map(([key], index) => `${key} = $${index + 1}`)
    const values = entries.map(([, value]) => value)
    values.push(id)

    const { rows } = await query(
      `
        UPDATE pengaduan
        SET ${setClauses.join(', ')}, updated_at = NOW()
        WHERE id = $${values.length}
        RETURNING *
      `,
      values
    )

    const data = rows[0]

    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Pengaduan tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Pengaduan berhasil diupdate'
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

// DELETE pengaduan
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    await query('DELETE FROM pengaduan WHERE id = $1', [id])

    return NextResponse.json({
      success: true,
      message: 'Pengaduan berhasil dihapus'
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
