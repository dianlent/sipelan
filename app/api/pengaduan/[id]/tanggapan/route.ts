import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { saveUploadedFile } from '@/lib/storage'

export const runtime = 'nodejs'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData()
    const tanggapan = formData.get('tanggapan') as string
    const petugas = formData.get('petugas') as string
    const status = formData.get('status') as string
    const fileLampiran = formData.get('file_lampiran') as File | null
    const pengaduanId = params.id

    if (!tanggapan || !petugas) {
      return NextResponse.json(
        { success: false, message: 'Tanggapan dan nama petugas harus diisi' },
        { status: 400 }
      )
    }

    let fileUrl = null

    if (fileLampiran) {
      const uploaded = await saveUploadedFile(fileLampiran, 'tanggapan', `tanggapan-${pengaduanId}`)
      fileUrl = uploaded.publicUrl
      console.log('バ. File uploaded:', fileUrl)
    }

    const { rows } = await query(
      `
        INSERT INTO pengaduan_status (
          pengaduan_id,
          status,
          keterangan,
          tanggapan,
          petugas,
          file_url
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [
        pengaduanId,
        status,
        `Tanggapan dari ${petugas}`,
        tanggapan,
        petugas,
        fileUrl
      ]
    )

    const newStatus = rows[0]

    if (!newStatus) {
      return NextResponse.json(
        { success: false, message: 'Gagal menambahkan tanggapan' },
        { status: 500 }
      )
    }

    if (status) {
      await query(
        `
          UPDATE pengaduan
          SET status = $1,
              updated_at = NOW()
          WHERE id = $2
        `,
        [status, pengaduanId]
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Tanggapan berhasil ditambahkan',
      data: newStatus
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server: ' + error.message },
      { status: 500 }
    )
  }
}
