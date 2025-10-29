import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { authMiddleware } from '@/lib/middleware';

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate
    const authResult = authMiddleware(request);
    
    if (!authResult.authorized || !authResult.user) {
      return authResult.response;
    }
    
    const { id } = params;
    
    // Check if user can access this profile
    // Users can only access their own profile, unless they're Administrator
    if (authResult.user.userId !== id && authResult.user.role !== 'ADMINISTRATOR') {
      return NextResponse.json(
        {
          success: false,
          message: 'Akses ditolak',
        },
        { status: 403 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { id },
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
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User tidak ditemukan',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user,
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server',
      },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[id] - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate
    const authResult = authMiddleware(request);
    
    if (!authResult.authorized || !authResult.user) {
      return authResult.response;
    }
    
    const { id } = params;
    const body = await request.json();
    
    // Check if user can update this profile
    if (authResult.user.userId !== id && authResult.user.role !== 'ADMINISTRATOR') {
      return NextResponse.json(
        {
          success: false,
          message: 'Akses ditolak',
        },
        { status: 403 }
      );
    }
    
    const updateData: any = {};
    
    // Fields that can be updated
    if (body.nama) updateData.nama = body.nama;
    if (body.email) updateData.email = body.email;
    if (body.nip) updateData.nip = body.nip;
    
    // Only Administrator can update role and isActive
    if (authResult.user.role === 'ADMINISTRATOR') {
      if (body.role) updateData.role = body.role;
      if (typeof body.isActive === 'boolean') updateData.isActive = body.isActive;
    }
    
    // Update password if provided
    if (body.password) {
      updateData.password = await hashPassword(body.password);
    }
    
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        nama: true,
        nip: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: user,
      message: 'User berhasil diupdate',
    });
    
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user (Administrator only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate and authorize (Administrator only)
    const authResult = authMiddleware(request, ['ADMINISTRATOR']);
    
    if (!authResult.authorized) {
      return authResult.response;
    }
    
    const { id } = params;
    
    // Prevent deleting own account
    if (authResult.user?.userId === id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tidak dapat menghapus akun sendiri',
        },
        { status: 400 }
      );
    }
    
    await prisma.user.delete({
      where: { id },
    });
    
    return NextResponse.json({
      success: true,
      message: 'User berhasil dihapus',
    });
    
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server',
      },
      { status: 500 }
    );
  }
}
