import { cookies } from 'next/headers'
import crypto from 'crypto'
import { query } from '@/lib/db'

const SESSION_COOKIE_NAME = 'session_token'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

export interface SessionUser {
  id: string
  username: string
  email: string
  nama_lengkap: string
  role: string
  kode_bidang?: string
  bidang_id?: number
}

/**
 * Generate a secure random session token
 */
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Create a new session in database
 */
export async function createSession(userId: string, userAgent?: string, ipAddress?: string): Promise<string> {
  const sessionToken = generateSessionToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  await query(
    `
      INSERT INTO sessions (user_id, session_token, expires_at, user_agent, ip_address)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [userId, sessionToken, expiresAt.toISOString(), userAgent || null, ipAddress || null]
  )

  return sessionToken
}

/**
 * Set session cookie (HTTP-only, Secure)
 */
export async function setSessionCookie(sessionToken: string) {
  const cookieStore = await cookies()
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
    path: '/'
  })
}

/**
 * Get session token from cookie
 */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(SESSION_COOKIE_NAME)
  return cookie?.value || null
}

/**
 * Get current user from session
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const sessionToken = await getSessionToken()
    
    if (!sessionToken) {
      return null
    }

    // Get session with user data
    const { rows } = await query(
      `
        SELECT
          s.expires_at,
          u.id,
          u.username,
          u.email,
          u.nama_lengkap,
          u.role,
          u.kode_bidang,
          u.bidang_id
        FROM sessions s
        JOIN users u ON u.id = s.user_id
        WHERE s.session_token = $1
        LIMIT 1
      `,
      [sessionToken]
    )

    const session = rows[0]

    if (!session) {
      return null
    }

    // Check if session expired
    if (new Date(session.expires_at) < new Date()) {
      await deleteSession(sessionToken)
      return null
    }

    return {
      id: session.id,
      username: session.username,
      email: session.email,
      nama_lengkap: session.nama_lengkap,
      role: session.role,
      kode_bidang: session.kode_bidang,
      bidang_id: session.bidang_id
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Delete session from database
 */
export async function deleteSession(sessionToken: string) {
  await query('DELETE FROM sessions WHERE session_token = $1', [sessionToken])
}

/**
 * Delete all sessions for a user
 */
export async function deleteUserSessions(userId: string) {
  await query('DELETE FROM sessions WHERE user_id = $1', [userId])
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Logout: Delete session and clear cookie
 */
export async function logout() {
  const sessionToken = await getSessionToken()
  
  if (sessionToken) {
    await deleteSession(sessionToken)
  }
  
  await clearSessionCookie()
}

/**
 * Cleanup expired sessions (can be called periodically)
 */
export async function cleanupExpiredSessions() {
  await query('DELETE FROM sessions WHERE expires_at < NOW()')
}
