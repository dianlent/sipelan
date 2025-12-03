import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/session'

// Helper function to upsert setting
async function upsertSetting(key: string, value: string) {
  const { data: existing } = await supabaseAdmin
    .from('app_settings')
    .select('id')
    .eq('setting_key', key)
    .single()

  if (existing) {
    return supabaseAdmin
      .from('app_settings')
      .update({ 
        setting_value: value, 
        updated_at: new Date().toISOString() 
      })
      .eq('setting_key', key)
  } else {
    return supabaseAdmin
      .from('app_settings')
      .insert({ 
        setting_key: key, 
        setting_value: value,
        setting_type: 'string',
        is_public: true
      })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication using getCurrentUser
    const user = await getCurrentUser()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin only' },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const appName = formData.get('app_name') as string
    const logoFile = formData.get('logo') as File | null
    const facebookUrl = formData.get('facebook_url') as string || ''
    const twitterUrl = formData.get('twitter_url') as string || ''
    const instagramUrl = formData.get('instagram_url') as string || ''
    const youtubeUrl = formData.get('youtube_url') as string || ''

    let logoUrl = ''

    // Upload logo if provided
    if (logoFile) {
      const fileExt = logoFile.name.split('.').pop()
      const fileName = `logo-${Date.now()}.${fileExt}`
      const filePath = `app/${fileName}`

      // Convert File to ArrayBuffer then to Buffer
      const arrayBuffer = await logoFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin
        .storage
        .from('pengaduan-files')
        .upload(filePath, buffer, {
          contentType: logoFile.type,
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return NextResponse.json(
          { success: false, message: 'Gagal upload logo: ' + uploadError.message },
          { status: 500 }
        )
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin
        .storage
        .from('pengaduan-files')
        .getPublicUrl(filePath)

      logoUrl = urlData.publicUrl
    }

    // Save app_name to database using key-value structure
    if (appName) {
      const { error: nameError } = await upsertSetting('app_name', appName)
      if (nameError) {
        console.error('Error saving app_name:', nameError)
      }
    }

    // Save logo_url if uploaded
    if (logoUrl) {
      const { error: logoError } = await upsertSetting('app_logo_url', logoUrl)
      if (logoError) {
        console.error('Error saving app_logo_url:', logoError)
      }
    }

    // Save social media URLs
    await upsertSetting('facebook_url', facebookUrl)
    await upsertSetting('twitter_url', twitterUrl)
    await upsertSetting('instagram_url', instagramUrl)
    await upsertSetting('youtube_url', youtubeUrl)

    return NextResponse.json({
      success: true,
      message: 'Pengaturan aplikasi berhasil disimpan',
      logo_url: logoUrl || undefined
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server: ' + error.message },
      { status: 500 }
    )
  }
}
