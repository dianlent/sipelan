import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { authMiddleware } from '@/lib/middleware';

// GET /api/users - Get all users (Administrator only)
export async function GET(request: NextRequest) {
  try {
    // Authenticate and authorize (Administrator only)
    const authResult = authMiddleware(request, ['ADMINISTRATOR']);
    
    if (!authResult.authorized) {
      return authResult.response;
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    if (role) {
      where.role = role;
    }
    
    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { nip: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Get total count
    const total = await prisma.user.count({ where });
    
    // Get users
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        nama: true,
        nip: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server',
      },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user (Administrator only)
export async function POST(request: NextRequest) {
  try {
    // Authenticate and authorize (Administrator only)
    const authResult = authMiddleware(request, ['ADMINISTRATOR']);
    
    if (!authResult.authorized) {
      return authResult.response;
    }
    
    const body = await request.json();
    const { email, password, nama, nip, role } = body;
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email sudah terdaftar',
        },
        { status: 400 }
      );
    }
    
    // Check if NIP already exists
    if (nip) {
      const existingNip = await prisma.user.findUnique({
        where: { nip },
      });
      
      if (existingNip) {
        return NextResponse.json(
          {
            success: false,
            message: 'NIP sudah terdaftar',
          },
          { status: 400 }
        );
      }
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nama,
        nip,
        role: role || 'USER',
      },
      select: {
        id: true,
        email: true,
        nama: true,
        nip: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: user,
      message: 'User berhasil dibuat',
    });
    
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server',
      },
      { status: 500 }
    );
  }
}
