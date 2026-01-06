import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, generatePengaduanCreatedEmail } from '@/lib/email'
import { query } from '@/lib/db'
import { saveUploadedFile } from '@/lib/storage'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form data
    const kategori_id = formData.get('kategori_id') as string
    const judul_pengaduan = formData.get('judul_pengaduan') as string
    const isi_pengaduan = formData.get('isi_pengaduan') as string
    const lokasi_kejadian = formData.get('lokasi_kejadian') as string
    const tanggal_kejadian = formData.get('tanggal_kejadian') as string
    const nama_pelapor = formData.get('nama_pelapor') as string
    const email_pelapor = formData.get('email_pelapor') as string
    const no_telepon = formData.get('no_telepon') as string
    const anonim = formData.get('anonim') === 'true'
    const file_bukti = formData.get('file_bukti') as File | null
    const recaptchaToken = formData.get('recaptchaToken') as string

    // Validation
    if (!kategori_id || !judul_pengaduan || !isi_pengaduan || !nama_pelapor || !email_pelapor || !no_telepon) {
      return NextResponse.json(
        { success: false, message: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    // Verify reCAPTCHA token
    if (recaptchaToken) {
      try {
        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY
        if (recaptchaSecret) {
          const verifyResponse = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`,
            { method: 'POST' }
          )
          const verifyData = await verifyResponse.json()
          
          if (!verifyData.success || verifyData.score < 0.5) {
            console.error('reCAPTCHA verification failed:', verifyData)
            return NextResponse.json(
              { success: false, message: 'Verifikasi reCAPTCHA gagal. Silakan coba lagi.' },
              { status: 400 }
            )
          }
          console.log('バ. reCAPTCHA verified, score:', verifyData.score)
        }
      } catch (recaptchaError) {
        console.error('reCAPTCHA verification error:', recaptchaError)
      }
    }

    // Handle file upload if present
    let file_bukti_path = null
    if (file_bukti && file_bukti.size > 0) {
      const uploaded = await saveUploadedFile(file_bukti, 'bukti', 'bukti')
      file_bukti_path = uploaded.publicUrl
    }

    const pengaduanData = {
      kategori_id: parseInt(kategori_id, 10),
      judul_pengaduan,
      isi_pengaduan,
      lokasi_kejadian: lokasi_kejadian || null,
      tanggal_kejadian: tanggal_kejadian || null,
      nama_pelapor: nama_pelapor,
      email_pelapor: email_pelapor,
      no_telepon,
      anonim,
      file_bukti: file_bukti_path,
      status: 'masuk',
      user_id: null
    }

    const { rows } = await query(
      `
        INSERT INTO pengaduan (
          kategori_id,
          judul_pengaduan,
          isi_pengaduan,
          lokasi_kejadian,
          tanggal_kejadian,
          nama_pelapor,
          email_pelapor,
          no_telepon,
          anonim,
          file_bukti,
          status,
          user_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `,
      [
        pengaduanData.kategori_id,
        pengaduanData.judul_pengaduan,
        pengaduanData.isi_pengaduan,
        pengaduanData.lokasi_kejadian,
        pengaduanData.tanggal_kejadian,
        pengaduanData.nama_pelapor,
        pengaduanData.email_pelapor,
        pengaduanData.no_telepon,
        pengaduanData.anonim,
        pengaduanData.file_bukti,
        pengaduanData.status,
        pengaduanData.user_id
      ]
    )

    const pengaduan = rows[0]

    if (!pengaduan) {
      return NextResponse.json(
        { success: false, message: 'Gagal menyimpan pengaduan' },
        { status: 500 }
      )
    }

    try {
      await query(
        `
          INSERT INTO pengaduan_status (pengaduan_id, status, keterangan, user_id)
          VALUES ($1, $2, $3, $4)
        `,
        [
          pengaduan.id,
          'masuk',
          'Pengaduan telah diterima sistem dan menunggu verifikasi',
          null
        ]
      )
    } catch (statusError) {
      console.error('Status insert error:', statusError)
    }

    if (!anonim && email_pelapor) {
      try {
        const emailHtml = generatePengaduanCreatedEmail(pengaduan, email_pelapor)
        const emailResult = await sendEmail(
          email_pelapor,
          `Pengaduan Diterima - ${pengaduan.kode_pengaduan}`,
          emailHtml
        )
        
        if (emailResult.success) {
          console.log('Email notification sent to:', email_pelapor)
        } else {
          console.error('Failed to send email notification:', emailResult.error)
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Pengaduan berhasil disimpan',
      data: {
        kode_pengaduan: pengaduan.kode_pengaduan,
        id: pengaduan.id,
        judul_pengaduan: pengaduan.judul_pengaduan,
        created_at: pengaduan.created_at
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

// GET all pengaduan (optional, for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const status = searchParams.get('status')
    const bidang_id = searchParams.get('bidang_id')
    
    console.log('=== GET PENGADUAN API ===')
    console.log('Params:', { page, limit, status, bidang_id })

    const filters: string[] = []
    const params: Array<string | number | string[]> = []

    if (status) {
      params.push(status)
      filters.push(`p.status = $${params.length}`)
    }

    if (bidang_id) {
      params.push(parseInt(bidang_id, 10))
      filters.push(`p.bidang_id = $${params.length}`)
      params.push(['terdisposisi', 'tindak_lanjut', 'selesai'])
      filters.push(`p.status = ANY($${params.length}::text[])`)
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : ''

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM pengaduan p ${whereClause}`,
      params
    )
    const total = parseInt(countResult.rows[0]?.count || '0', 10)

    const listParams = [...params, limit, (page - 1) * limit]
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
        ${whereClause}
        ORDER BY p.created_at DESC
        LIMIT $${listParams.length - 1} OFFSET $${listParams.length}
      `,
      listParams
    )

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
