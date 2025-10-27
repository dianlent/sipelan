import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/categories - Get category distribution
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.pengaduan.groupBy({
      by: ['kategori'],
      _count: {
        kategori: true,
      },
      orderBy: {
        _count: {
          kategori: 'desc',
        },
      },
    });
    
    // Color mapping
    const colorMap: { [key: string]: string } = {
      'Upah/Gaji Tidak Dibayar': '#3B82F6',
      'PHK Sepihak': '#EF4444',
      'Tidak Ada BPJS Ketenagakerjaan': '#10B981',
      'Tidak Ada Kontrak Kerja': '#F59E0B',
      'Jam Kerja Berlebihan': '#8B5CF6',
      'Keselamatan Kerja': '#EC4899',
      'Diskriminasi di Tempat Kerja': '#14B8A6',
      'Pelecehan di Tempat Kerja': '#F97316',
      'Lainnya': '#6B7280',
    };
    
    const data = categories.map(cat => ({
      name: cat.kategori,
      value: cat._count.kategori,
      color: colorMap[cat.kategori] || '#6B7280',
    }));
    
    return NextResponse.json({
      success: true,
      data,
    });
    
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server',
      },
      { status: 500 }
    );
  }
}
