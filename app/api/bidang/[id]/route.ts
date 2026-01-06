import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { nama_bidang, kode_bidang, deskripsi } = body
    const id = params.id

    if (!nama_bidang || !kode_bidang) {
      return NextResponse.json({
        success: false,
        message: 'Nama dan kode bidang harus diisi'
      }, { status: 400 })
    }

    const existing = await query(
      'SELECT id FROM bidang WHERE kode_bidang = $1 AND id <> $2 LIMIT 1',
      [kode_bidang, id]
    )

    if (existing.rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Kode bidang sudah digunakan'
      }, { status: 400 })
    }

    const { rows } = await query(
      `
        UPDATE bidang
        SET nama_bidang = $1,
            kode_bidang = $2,
            deskripsi = $3,
            updated_at = NOW()
        WHERE id = $4
        RETURNING *
      `,
      [nama_bidang, kode_bidang, deskripsi || null, id]
    )

    return NextResponse.json({
      success: true,
      message: 'Bidang berhasil diupdate',
      data: rows[0]
    })
  } catch (error: any) {
    console.error('Update bidang error:', error)
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    const users = await query('SELECT id FROM users WHERE bidang_id = $1 LIMIT 1', [id])
    if (users.rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Tidak dapat menghapus bidang yang masih memiliki user'
      }, { status: 400 })
    }

    const pengaduan = await query('SELECT id FROM pengaduan WHERE bidang_id = $1 LIMIT 1', [id])
    if (pengaduan.rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Tidak dapat menghapus bidang yang masih memiliki pengaduan'
      }, { status: 400 })
    }

    await query('DELETE FROM bidang WHERE id = $1', [id])

    return NextResponse.json({
      success: true,
      message: 'Bidang berhasil dihapus'
    })
  } catch (error: any) {
    console.error('Delete bidang error:', error)
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 })
  }
}
