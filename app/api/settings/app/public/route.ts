import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Get app settings (public, no auth required)
export async function GET(request: NextRequest) {
  try {
    // Fetch app settings using key-value structure
    const { data: settings, error } = await supabaseAdmin
      .from('app_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['app_name', 'app_logo_url', 'facebook_url', 'twitter_url', 'instagram_url', 'youtube_url'])

    if (error) {
      console.error('Error fetching app settings:', error)
      // Return default values if no settings found
      return NextResponse.json({
        success: true,
        data: {
          app_name: 'SIPelan',
          app_logo_url: null
        }
      })
    }

    // Convert to object
    const settingsObject: Record<string, string> = {}
    settings?.forEach(setting => {
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
