import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { pengaduanSchema } from '@/lib/validators';
import { generateTicketNumber } from '@/lib/utils/ticket';
import { sendEmail, pengaduanDiterimaEmail } from '@/lib/utils/email';

// POST /api/pengaduan - Create new pengaduan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = pengaduanSchema.parse(body);
    
    // Generate unique ticket number
    let ticketNumber = generateTicketNumber();
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      const existing = await prisma.pengaduan.findUnique({
        where: { ticketNumber },
      });
      
      if (!existing) {
        isUnique = true;
      } else {
        ticketNumber = generateTicketNumber();
        attempts++;
      }
    }
    
    if (!isUnique) {
      return NextResponse.json(
        { success: false, message: 'Gagal generate nomor tiket' },
        { status: 500 }
      );
    }
    
    // Create pengaduan
    const pengaduan = await prisma.pengaduan.create({
      data: {
        ticketNumber,
        nama: validatedData.nama,
        nik: validatedData.nik,
        email: validatedData.email,
        telepon: validatedData.telepon,
        alamat: validatedData.alamat,
        kategori: validatedData.kategori,
        judul: validatedData.judul,
        deskripsi: validatedData.deskripsi,
        lokasi: validatedData.lokasi,
        tanggalKejadian: new Date(validatedData.tanggalKejadian),
        status: 'PENDING',
      },
    });
    
    // Create initial history entry
    await prisma.pengaduanHistory.create({
      data: {
        pengaduanId: pengaduan.id,
        status: 'Pengaduan Diterima',
        keterangan: 'Pengaduan Anda telah diterima dan terdaftar dalam sistem kami.',
      },
    });
    
    // Send email notification
    try {
      await sendEmail({
        to: pengaduan.email,
        subject: `Pengaduan Diterima - ${ticketNumber}`,
        html: pengaduanDiterimaEmail(pengaduan.nama, ticketNumber, pengaduan.kategori),
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the request if email fails
    }
    
    return NextResponse.json({
      success: true,
      data: {
        ticketNumber: pengaduan.ticketNumber,
        id: pengaduan.id,
      },
      message: 'Pengaduan berhasil dibuat',
    });
    
  } catch (error: any) {
    console.error('Create pengaduan error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Validasi gagal',
          errors: error.errors,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server',
      },
      { status: 500 }
    );
  }
}

// GET /api/pengaduan - Get all pengaduan (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const kategori = searchParams.get('kategori');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (kategori) {
      where.kategori = kategori;
    }
    
    if (search) {
      where.OR = [
        { ticketNumber: { contains: search, mode: 'insensitive' } },
        { nama: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { judul: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Get total count
    const total = await prisma.pengaduan.count({ where });
    
    // Get pengaduan
    const pengaduan = await prisma.pengaduan.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        files: true,
        history: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    
    return NextResponse.json({
      success: true,
      data: pengaduan,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Get pengaduan error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server',
      },
      { status: 500 }
    );
  }
}
