import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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

    // Upload file if provided
    if (fileLampiran) {
      const fileExt = fileLampiran.name.split('.').pop()
      const fileName = `${pengaduanId}-${Date.now()}.${fileExt}`
      const filePath = `tanggapan/${fileName}`

      console.log('📤 Uploading file:', fileName)

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('pengaduan-files')
        .upload(filePath, fileLampiran, {
          contentType: fileLampiran.type,
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return NextResponse.json(
          { success: false, message: 'Gagal upload file: ' + uploadError.message },
          { status: 500 }
        )
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from('pengaduan-files')
        .getPublicUrl(filePath)

      fileUrl = urlData.publicUrl
      console.log('✅ File uploaded:', fileUrl)
    }

    // Insert new status with tanggapan and file
    const { data: newStatus, error: statusError } = await supabaseAdmin
      .from('pengaduan_status')
      .insert({
        pengaduan_id: pengaduanId,
        status: status,
        keterangan: `Tanggapan dari ${petugas}`,
        tanggapan: tanggapan,
        petugas: petugas,
        file_url: fileUrl
      })
      .select()
      .single()

    if (statusError) {
      console.error('Error inserting status:', statusError)
      return NextResponse.json(
        { success: false, message: 'Gagal menambahkan tanggapan' },
        { status: 500 }
      )
    }

    // Update pengaduan status if provided
    if (status) {
      const { error: updateError } = await supabaseAdmin
        .from('pengaduan')
        .update({ status: status })
        .eq('id', pengaduanId)

      if (updateError) {
        console.error('Error updating pengaduan status:', updateError)
      }
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
