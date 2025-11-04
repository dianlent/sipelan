'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  username: string
  email: string
  nama_lengkap: string
  role: string
  kode_bidang?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (userData: User, token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Check authentication only on initial mount
  useEffect(() => {
    if (!isInitialized) {
      checkAuth()
    }
  }, [])

  // Verify auth on route changes (without showing loading state)
  useEffect(() => {
    if (isInitialized) {
      verifyAuth()
    }
  }, [pathname])

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('authToken')
      const userData = localStorage.getItem('currentUser')

      if (token && userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
      setIsInitialized(true)
    }
  }

  const verifyAuth = () => {
    try {
      const token = localStorage.getItem('authToken')
      const userData = localStorage.getItem('currentUser')

      if (token && userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth verify error:', error)
      setUser(null)
    }
  }

  const login = (userData: User, token: string) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('currentUser', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    setUser(null)
    router.push('/')
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
