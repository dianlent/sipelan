import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/pengaduan/[ticketNumber] - Get pengaduan by ticket number
export async function GET(
  request: NextRequest,
  { params }: { params: { ticketNumber: string } }
) {
  try {
    const { ticketNumber } = params;
    
    const pengaduan = await prisma.pengaduan.findUnique({
      where: { ticketNumber },
      include: {
        files: {
          select: {
            id: true,
            fileName: true,
            fileSize: true,
            filePath: true,
            uploadedAt: true,
          },
        },
        history: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: {
                nama: true,
              },
            },
          },
        },
      },
    });
    
    if (!pengaduan) {
      return NextResponse.json(
        {
          success: false,
          message: 'Pengaduan tidak ditemukan',
        },
        { status: 404 }
      );
    }
    
    // Format response
    const response = {
      ticketNumber: pengaduan.ticketNumber,
      status: pengaduan.status.toLowerCase(),
      nama: pengaduan.nama,
      email: pengaduan.email,
      telepon: pengaduan.telepon,
      kategori: pengaduan.kategori,
      judul: pengaduan.judul,
      deskripsi: pengaduan.deskripsi,
      lokasi: pengaduan.lokasi,
      tanggalKejadian: pengaduan.tanggalKejadian.toISOString().split('T')[0],
      tanggalPengaduan: pengaduan.createdAt.toISOString().split('T')[0],
      timeline: pengaduan.history.map(h => ({
        status: h.status,
        keterangan: h.keterangan,
        tanggal: h.createdAt.toISOString(),
        petugas: h.user?.nama,
      })),
      files: pengaduan.files.map(f => ({
        name: f.fileName,
        size: f.fileSize,
        url: f.filePath,
      })),
    };
    
    return NextResponse.json({
      success: true,
      data: response,
    });
    
  } catch (error) {
    console.error('Get pengaduan by ticket error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server',
      },
      { status: 500 }
    );
  }
}

// PATCH /api/pengaduan/[ticketNumber] - Update pengaduan status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { ticketNumber: string } }
) {
  try {
    const { ticketNumber } = params;
    const body = await request.json();
    const { status, keterangan, userId } = body;
    
    // Find pengaduan
    const pengaduan = await prisma.pengaduan.findUnique({
      where: { ticketNumber },
    });
    
    if (!pengaduan) {
      return NextResponse.json(
        {
          success: false,
          message: 'Pengaduan tidak ditemukan',
        },
        { status: 404 }
      );
    }
    
    // Update status
    const updated = await prisma.pengaduan.update({
      where: { ticketNumber },
      data: { status },
    });
    
    // Add history entry
    await prisma.pengaduanHistory.create({
      data: {
        pengaduanId: pengaduan.id,
        status,
        keterangan,
        createdBy: userId,
      },
    });
    
    // Send email notification
    // TODO: Implement status update email
    
    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Status berhasil diupdate',
    });
    
  } catch (error) {
    console.error('Update pengaduan error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server',
      },
      { status: 500 }
    );
  }
}
