import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractToken, hasRole, JWTPayload } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Middleware to authenticate requests
 */
export function authenticate(request: NextRequest): {
  authorized: boolean;
  user?: JWTPayload;
  response?: NextResponse;
} {
  const authHeader = request.headers.get('authorization');
  const token = extractToken(authHeader);

  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: 'Token tidak ditemukan' },
        { status: 401 }
      ),
    };
  }

  const user = verifyToken(token);

  if (!user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: 'Token tidak valid atau expired' },
        { status: 401 }
      ),
    };
  }

  return {
    authorized: true,
    user,
  };
}

/**
 * Middleware to check user role
 */
export function authorize(
  user: JWTPayload,
  allowedRoles: string[]
): {
  authorized: boolean;
  response?: NextResponse;
} {
  if (!hasRole(user.role, allowedRoles)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: 'Akses ditolak. Anda tidak memiliki izin.' },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
  };
}

/**
 * Combined middleware for authentication and authorization
 */
export function authMiddleware(
  request: NextRequest,
  allowedRoles?: string[]
): {
  authorized: boolean;
  user?: JWTPayload;
  response?: NextResponse;
} {
  // Authenticate
  const authResult = authenticate(request);
  if (!authResult.authorized) {
    return authResult;
  }

  // Authorize if roles specified
  if (allowedRoles && authResult.user) {
    const authzResult = authorize(authResult.user, allowedRoles);
    if (!authzResult.authorized) {
      return authzResult;
    }
  }

  return {
    authorized: true,
    user: authResult.user,
  };
}
