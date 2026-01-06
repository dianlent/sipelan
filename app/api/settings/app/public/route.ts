import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET - Get app settings (public, no auth required)
export async function GET(request: NextRequest) {
  try {
    const { rows } = await query(
      `
        SELECT setting_key, setting_value
        FROM app_settings
        WHERE setting_key = ANY($1::text[])
      `,
      [['app_name', 'app_logo_url', 'facebook_url', 'twitter_url', 'instagram_url', 'youtube_url']]
    )

    const settingsObject: Record<string, string> = {}
    rows.forEach(setting => {
      settingsObject[setting.setting_key] = setting.setting_value
    })

    return NextResponse.json({
      success: true,
      data: {
        app_name: settingsObject['app_name'] || 'SIPelan',
        app_logo_url: settingsObject['app_logo_url'] || null,
        facebook_url: settingsObject['facebook_url'] || '',
        twitter_url: settingsObject['twitter_url'] || '',
        instagram_url: settingsObject['instagram_url'] || '',
        youtube_url: settingsObject['youtube_url'] || ''
      }
    })
  } catch (error) {
    console.error('Public app settings API error:', error)
    return NextResponse.json({
      success: true,
      data: {
        app_name: 'SIPelan',
        app_logo_url: null
      }
    })
  }
}
