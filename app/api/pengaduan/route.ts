import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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

    // Validation
    if (!kategori_id || !judul_pengaduan || !isi_pengaduan || !nama_pelapor || !email_pelapor || !no_telepon) {
      return NextResponse.json(
        { success: false, message: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    // Handle file upload if present
    let file_bukti_path = null
    if (file_bukti && file_bukti.size > 0) {
      const fileExt = file_bukti.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `bukti/${fileName}`

      const { error: uploadError } = await supabaseAdmin
        .storage
        .from('pengaduan-files')
        .upload(filePath, file_bukti, {
          contentType: file_bukti.type,
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return NextResponse.json(
          { success: false, message: 'Gagal mengunggah file: ' + uploadError.message },
          { status: 500 }
        )
      }

      file_bukti_path = filePath
    }

    // Prepare data for insertion
    const pengaduanData = {
      kategori_id: parseInt(kategori_id),
      judul_pengaduan,
      isi_pengaduan,
      lokasi_kejadian: lokasi_kejadian || null,
      tanggal_kejadian: tanggal_kejadian || null,
      nama_pelapor: anonim ? 'Anonim' : nama_pelapor,
      email_pelapor: anonim ? '' : email_pelapor,
      no_telepon,
      anonim,
      file_bukti: file_bukti_path,
      status: 'masuk',
      user_id: null // Anonymous submission
    }

    // Insert pengaduan
    const { data: pengaduan, error: insertError } = await supabaseAdmin
      .from('pengaduan')
      .insert([pengaduanData])
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json(
        { success: false, message: 'Gagal menyimpan pengaduan: ' + insertError.message },
        { status: 500 }
      )
    }

    // Insert initial status
    const { error: statusError } = await supabaseAdmin
      .from('pengaduan_status')
      .insert([{
        pengaduan_id: pengaduan.id,
        status: 'masuk',
        keterangan: 'Pengaduan telah diterima sistem dan menunggu verifikasi',
        user_id: null
      }])

    if (statusError) {
      console.error('Status insert error:', statusError)
      // Don't fail the whole request if status insert fails
    }

    // Return success response with kode_pengaduan
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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const bidang_id = searchParams.get('bidang_id')
    
    console.log('=== GET PENGADUAN API ===')
    console.log('Params:', { page, limit, status, bidang_id })

    let query = supabaseAdmin
      .from('pengaduan')
      .select(`
        *,
        kategori_pengaduan (
          id,
          nama_kategori,
          deskripsi
        ),
        bidang (
          bidang_id,
          nama_bidang,
          kode_bidang
        ),
        users (
          nama_lengkap,
          email
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (status) {
      console.log('Filtering by status:', status)
      query = query.eq('status', status)
    }

    if (bidang_id) {
      console.log('Filtering by bidang_id:', bidang_id)
      const bidangIdInt = parseInt(bidang_id)
      console.log('Parsed bidang_id:', bidangIdInt)
      
      // Filter by bidang_id and only show disposed pengaduan
      query = query
        .eq('bidang_id', bidangIdInt)
        .in('status', ['terdisposisi', 'tindak_lanjut', 'selesai'])
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Query error:', error)
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      )
    }

    console.log('Query result:', {
      total: count,
      returned: data?.length || 0,
      sample: data?.[0] ? {
        kode: data[0].kode_pengaduan,
        status: data[0].status,
        bidang_id: data[0].bidang_id
      } : null
    })

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit)
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
