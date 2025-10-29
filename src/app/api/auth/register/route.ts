import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for registration
const registerSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  nip: z.string().optional(), // Untuk Pegawai & Administrator
  role: z.enum(['USER', 'PEGAWAI', 'ADMINISTRATOR']).optional(),
});

// POST /api/auth/register - Register new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
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
    
    // Check if NIP already exists (for Pegawai & Administrator)
    if (validatedData.nip) {
      const existingNip = await prisma.user.findUnique({
        where: { nip: validatedData.nip },
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
    const hashedPassword = await hashPassword(validatedData.password);
    
    // Determine role (default USER for public registration)
    const role = validatedData.role || 'USER';
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        nama: validatedData.nama,
        nip: validatedData.nip,
        role,
      },
      select: {
        id: true,
        email: true,
        nama: true,
        nip: true,
        role: true,
        createdAt: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: user,
      message: 'Registrasi berhasil',
    });
    
  } catch (error: any) {
    console.error('Register error:', error);
    
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
