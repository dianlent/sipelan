import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// POST - Create new disposisi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pengaduan_id, dari_bidang_id, ke_bidang_id, keterangan, user_id } = body

    if (!pengaduan_id || !ke_bidang_id || !keterangan) {
      return NextResponse.json(
        { success: false, message: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    console.log('=== CREATING DISPOSISI ===')
    console.log('Pengaduan ID:', pengaduan_id)
    console.log('Ke Bidang ID:', ke_bidang_id)
    console.log('Keterangan:', keterangan)

    const disposisiResult = await query(
      `
        INSERT INTO disposisi (
          pengaduan_id,
          dari_bidang_id,
          ke_bidang_id,
          keterangan,
          user_id,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *
      `,
      [
        pengaduan_id,
        dari_bidang_id || null,
        ke_bidang_id,
        keterangan,
        user_id || null
      ]
    )

    const disposisi = disposisiResult.rows[0]

    if (!disposisi) {
      return NextResponse.json(
        { success: false, message: 'Gagal menyimpan disposisi' },
        { status: 500 }
      )
    }

    await query(
      `
        UPDATE pengaduan
        SET bidang_id = $1,
            status = 'terdisposisi',
            updated_at = NOW()
        WHERE id = $2
      `,
      [ke_bidang_id, pengaduan_id]
    )

    const pengaduanResult = await query(
      `
        SELECT
          p.*,
          json_build_object('nama_kategori', k.nama_kategori) AS kategori_pengaduan,
          json_build_object('bidang_id', b.id, 'nama_bidang', b.nama_bidang, 'kode_bidang', b.kode_bidang) AS bidang
        FROM pengaduan p
        LEFT JOIN kategori_pengaduan k ON k.id = p.kategori_id
        LEFT JOIN bidang b ON b.id = p.bidang_id
        WHERE p.id = $1
        LIMIT 1
      `,
      [pengaduan_id]
    )

    const pengaduan = pengaduanResult.rows[0]

    if (!pengaduan) {
      return NextResponse.json(
        { success: false, message: 'Gagal update pengaduan' },
        { status: 500 }
      )
    }

    try {
      await query(
        `
          INSERT INTO pengaduan_status (pengaduan_id, status, keterangan, user_id, created_at)
          VALUES ($1, $2, $3, $4, NOW())
        `,
        [
          pengaduan_id,
          'terdisposisi',
          `Pengaduan didisposisikan ke ${pengaduan.bidang?.nama_bidang}. ${keterangan}`,
          user_id || null
        ]
      )
    } catch (statusError) {
      console.error('Status error:', statusError)
    }

    return NextResponse.json({
      success: true,
      message: `Pengaduan berhasil didisposisikan ke ${pengaduan.bidang?.nama_bidang}`,
      data: {
        disposisi,
        pengaduan
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server: ' + error.message },
      { status: 500 }
    )
  }
}

// GET - Get disposisi history for pengaduan
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pengaduan_id = searchParams.get('pengaduan_id')

    if (!pengaduan_id) {
      return NextResponse.json(
        { success: false, message: 'pengaduan_id diperlukan' },
        { status: 400 }
      )
    }

    const { rows } = await query(
      `
        SELECT
          d.*,
          json_build_object('bidang_id', db.id, 'nama_bidang', db.nama_bidang, 'kode_bidang', db.kode_bidang) AS dari_bidang,
          json_build_object('bidang_id', kb.id, 'nama_bidang', kb.nama_bidang, 'kode_bidang', kb.kode_bidang) AS ke_bidang,
          json_build_object('nama_lengkap', u.nama_lengkap, 'email', u.email) AS users
        FROM disposisi d
        LEFT JOIN bidang db ON db.id = d.dari_bidang_id
        LEFT JOIN bidang kb ON kb.id = d.ke_bidang_id
        LEFT JOIN users u ON u.id = d.user_id
        WHERE d.pengaduan_id = $1
        ORDER BY d.created_at DESC
      `,
      [pengaduan_id]
    )

    return NextResponse.json({
      success: true,
      data: rows
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
