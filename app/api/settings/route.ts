import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { query } from '@/lib/db'

// GET - Get all settings (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { rows } = await query('SELECT * FROM app_settings ORDER BY setting_key ASC')

    // Convert to object format
    const settingsObject: Record<string, any> = {}
    rows.forEach(setting => {
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
    console.error('Settings API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Update settings (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { settings } = body

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid settings data' },
        { status: 400 }
      )
    }

    const updates = []
    for (const [key, value] of Object.entries(settings)) {
      const stringValue = String(value)
      
      let settingType = 'string'
      if (typeof value === 'boolean') {
        settingType = 'boolean'
      } else if (typeof value === 'number') {
        settingType = 'number'
      }

      try {
        await query(
          `
            INSERT INTO app_settings (setting_key, setting_value, setting_type, updated_by, updated_at)
            VALUES ($1, $2, $3, $4, NOW())
            ON CONFLICT (setting_key)
            DO UPDATE SET
              setting_value = EXCLUDED.setting_value,
              setting_type = EXCLUDED.setting_type,
              updated_by = EXCLUDED.updated_by,
              updated_at = EXCLUDED.updated_at
          `,
          [key, stringValue, settingType, user.id]
        )
        updates.push({ key, success: true })
      } catch (error: any) {
        console.error(`Error upserting ${key}:`, error)
        updates.push({ key, success: false, error: error.message })
      }
    }

    const allSuccess = updates.every(u => u.success)

    return NextResponse.json({
      success: allSuccess,
      message: allSuccess ? 'Settings updated successfully' : 'Some settings failed to update',
      data: updates
    })
  } catch (error) {
    console.error('Settings update API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
