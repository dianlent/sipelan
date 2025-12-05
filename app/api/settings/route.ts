import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/session'

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

    const { data: settings, error } = await supabaseAdmin
      .from('app_settings')
      .select('*')
      .order('setting_key')

    if (error) {
      console.error('Error fetching settings:', error)
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

    // Update or insert each setting (upsert)
    const updates = []
    for (const [key, value] of Object.entries(settings)) {
      const stringValue = String(value)
      
      // Determine setting type
      let settingType = 'string'
      if (typeof value === 'boolean') {
        settingType = 'boolean'
      } else if (typeof value === 'number') {
        settingType = 'number'
      }
      
      // Use upsert to insert if not exists, update if exists
      const { error } = await supabaseAdmin
        .from('app_settings')
        .upsert({
          setting_key: key,
          setting_value: stringValue,
          setting_type: settingType,
          updated_by: user.id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        })

      if (error) {
        console.error(`Error upserting ${key}:`, error)
        updates.push({ key, success: false, error: error.message })
      } else {
        updates.push({ key, success: true })
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
