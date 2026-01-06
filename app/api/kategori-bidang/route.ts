import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { rows } = await query('SELECT * FROM kategori_bidang ORDER BY nama_kategori ASC')

    return NextResponse.json({
      success: true,
      data: rows || []
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
