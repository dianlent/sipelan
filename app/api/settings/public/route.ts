import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Get public settings (no auth required)
export async function GET(request: NextRequest) {
  try {
    const { data: settings, error } = await supabaseAdmin
      .from('app_settings')
      .select('setting_key, setting_value, setting_type')
      .eq('is_public', true)

    if (error) {
      console.error('Error fetching public settings:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch settings' },
        { status: 500 }
      )
    }

    // Convert to object format
    const settingsObject: Record<string, any> = {}
    settings.forEach(setting => {
      let value = setting.setting_value
      
      // Parse based on type
      if (setting.setting_type === 'boolean') {
        value = value === 'true'
      } else if (setting.setting_type === 'number') {
        value = parseFloat(value)
      }
      
      settingsObject[setting.setting_key] = value
    })

    return NextResponse.json({
      success: true,
      data: settingsObject
    })
  } catch (error) {
    console.error('Public settings API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
