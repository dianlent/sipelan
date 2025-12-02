import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

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

  const { error } = await supabaseAdmin
    .from('sessions')
    .insert({
      user_id: userId,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
      user_agent: userAgent,
      ip_address: ipAddress
    })

  if (error) {
    console.error('Error creating session:', error)
    throw new Error('Failed to create session')
  }

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
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .select(`
        user_id,
        expires_at,
        users (
          id,
          username,
          email,
          nama_lengkap,
          role,
          kode_bidang,
          bidang_id
        )
      `)
      .eq('session_token', sessionToken)
      .single()

    if (sessionError || !session) {
      return null
    }

    // Check if session expired
    if (new Date(session.expires_at) < new Date()) {
      await deleteSession(sessionToken)
      return null
    }

    const user = session.users as any

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      nama_lengkap: user.nama_lengkap,
      role: user.role,
      kode_bidang: user.kode_bidang,
      bidang_id: user.bidang_id
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
  await supabaseAdmin
    .from('sessions')
    .delete()
    .eq('session_token', sessionToken)
}

/**
 * Delete all sessions for a user
 */
export async function deleteUserSessions(userId: string) {
  await supabaseAdmin
    .from('sessions')
    .delete()
    .eq('user_id', userId)
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
  await supabaseAdmin
    .from('sessions')
    .delete()
    .lt('expires_at', new Date().toISOString())
}
