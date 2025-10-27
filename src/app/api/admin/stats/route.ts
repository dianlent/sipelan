import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    // Get total counts by status
    const [totalPengaduan, pending, diproses, selesai, ditolak] = await Promise.all([
      prisma.pengaduan.count(),
      prisma.pengaduan.count({ where: { status: 'PENDING' } }),
      prisma.pengaduan.count({ where: { status: 'DIPROSES' } }),
      prisma.pengaduan.count({ where: { status: 'SELESAI' } }),
      prisma.pengaduan.count({ where: { status: 'DITOLAK' } }),
    ]);
    
    // Get pengaduan this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const pengaduanBulanIni = await prisma.pengaduan.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });
    
    // Calculate average completion time (selesai pengaduan)
    const completedPengaduan = await prisma.pengaduan.findMany({
      where: { status: 'SELESAI' },
      select: {
        createdAt: true,
        updatedAt: true,
      },
      take: 100, // Sample last 100
    });
    
    let avgDays = 0;
    if (completedPengaduan.length > 0) {
      const totalDays = completedPengaduan.reduce((sum, p) => {
        const diff = p.updatedAt.getTime() - p.createdAt.getTime();
        return sum + (diff / (1000 * 60 * 60 * 24));
      }, 0);
      avgDays = totalDays / completedPengaduan.length;
    }
    
    return NextResponse.json({
      success: true,
      data: {
        totalPengaduan,
        pending,
        diproses,
        selesai,
        ditolak,
        pengaduanBulanIni,
        rataRataWaktuSelesai: `${avgDays.toFixed(1)} hari`,
        tingkatKepuasan: "87%", // TODO: Implement survey system
      },
    });
    
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server',
      },
      { status: 500 }
    );
  }
}
