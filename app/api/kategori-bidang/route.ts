import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { data: kategoriBidang, error } = await supabase
      .from('kategori_bidang')
      .select('*')
      .order('nama_kategori', { ascending: true })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: kategoriBidang || []
    })
  } catch (error: any) {
    console.error('Get kategori bidang error:', error)
    return NextResponse.json({
      success: false,
      message: error.message,
      data: []
    }, { status: 500 })
  }
}
