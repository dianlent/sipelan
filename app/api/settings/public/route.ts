import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET - Get public settings (no auth required)
export async function GET(request: NextRequest) {
  try {
    const { rows } = await query(
      `
        SELECT setting_key, setting_value, setting_type
        FROM app_settings
        WHERE is_public = true
      `
    )

    // Convert to object format
    const settingsObject: Record<string, any> = {}
    rows.forEach(setting => {
      let value = setting.setting_value
      
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
