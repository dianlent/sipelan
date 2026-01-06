import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { query } from '@/lib/db'
import { saveUploadedFile } from '@/lib/storage'

export const runtime = 'nodejs'

// Helper function to upsert setting
async function upsertSetting(key: string, value: string) {
  return query(
    `
      INSERT INTO app_settings (setting_key, setting_value, setting_type, is_public, updated_at)
      VALUES ($1, $2, 'string', true, NOW())
      ON CONFLICT (setting_key)
      DO UPDATE SET
        setting_value = EXCLUDED.setting_value,
        updated_at = EXCLUDED.updated_at
    `,
    [key, value]
  )
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin only' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const appName = formData.get('app_name') as string
    const logoFile = formData.get('logo') as File | null
    const facebookUrl = (formData.get('facebook_url') as string) || ''
    const twitterUrl = (formData.get('twitter_url') as string) || ''
    const instagramUrl = (formData.get('instagram_url') as string) || ''
    const youtubeUrl = (formData.get('youtube_url') as string) || ''

    let logoUrl = ''

    if (logoFile) {
      const uploaded = await saveUploadedFile(logoFile, 'app', 'logo')
      logoUrl = uploaded.publicUrl
    }

    if (appName) {
      await upsertSetting('app_name', appName)
    }

    if (logoUrl) {
      await upsertSetting('app_logo_url', logoUrl)
    }

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
