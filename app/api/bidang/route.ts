import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { rows } = await query(
      `
        SELECT
          b.*,
          COALESCE(u.user_count, 0) AS user_count,
          COALESCE(p.pengaduan_count, 0) AS pengaduan_count
        FROM bidang b
        LEFT JOIN (
          SELECT bidang_id, COUNT(*)::int AS user_count
          FROM users
          GROUP BY bidang_id
        ) u ON u.bidang_id = b.id
        LEFT JOIN (
          SELECT bidang_id, COUNT(*)::int AS pengaduan_count
          FROM pengaduan
          GROUP BY bidang_id
        ) p ON p.bidang_id = b.id
        ORDER BY b.id ASC
      `
    )

    return NextResponse.json({
      success: true,
      data: rows
    })
  } catch (error: any) {
    console.error('Get bidang error:', error)
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nama_bidang, kode_bidang, deskripsi } = body

    if (!nama_bidang || !kode_bidang) {
      return NextResponse.json({
        success: false,
        message: 'Nama dan kode bidang harus diisi'
      }, { status: 400 })
    }

    const existing = await query('SELECT id FROM bidang WHERE kode_bidang = $1 LIMIT 1', [kode_bidang])
    if (existing.rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Kode bidang sudah digunakan'
      }, { status: 400 })
    }

    const { rows } = await query(
      `
        INSERT INTO bidang (nama_bidang, kode_bidang, deskripsi)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [nama_bidang, kode_bidang, deskripsi || null]
    )

    return NextResponse.json({
      success: true,
      message: 'Bidang berhasil ditambahkan',
      data: rows[0]
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create bidang error:', error)
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 })
  }
}
