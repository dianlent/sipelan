import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/trend - Get monthly trend data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get('months') || '10');
    
    const trendData = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const [total, selesai, pending] = await Promise.all([
        prisma.pengaduan.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextMonth,
            },
          },
        }),
        prisma.pengaduan.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextMonth,
            },
            status: 'SELESAI',
          },
        }),
        prisma.pengaduan.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextMonth,
            },
            status: 'PENDING',
          },
        }),
      ]);
      
      trendData.push({
        bulan: date.toLocaleDateString('id-ID', { month: 'short' }),
        total,
        selesai,
        pending,
      });
    }
    
    return NextResponse.json({
      success: true,
      data: trendData,
    });
    
  } catch (error) {
    console.error('Get trend error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server',
      },
      { status: 500 }
    );
  }
}
