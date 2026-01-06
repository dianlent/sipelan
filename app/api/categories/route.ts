import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { rows } = await query('SELECT * FROM kategori_pengaduan ORDER BY nama_kategori ASC')

    return NextResponse.json({
      success: true,
      data: rows || []
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server: ' + error.message },
      { status: 500 }
    )
  }
}
