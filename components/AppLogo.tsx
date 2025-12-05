'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ClipboardCheck } from 'lucide-react'

interface AppLogoProps {
  showSubtitle?: boolean
  size?: 'sm' | 'md' | 'lg'
  linkTo?: string
  className?: string
}

export default function AppLogo({ 
  showSubtitle = true, 
  size = 'md',
  linkTo = '/',
  className = ''
}: AppLogoProps) {
  const [appName, setAppName] = useState('SIPelan')
  const [appLogo, setAppLogo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAppSettings = async () => {
      try {
        const response = await fetch('/api/settings/app/public')
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            setAppName(result.data.app_name || 'SIPelan')
            setAppLogo(result.data.app_logo_url || null)
          }
        }
      } catch (error) {
        console.error('Error fetching app settings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAppSettings()
  }, [])

  const sizeClasses = {
    sm: {
      container: 'w-8 h-8',
      icon: 'w-4 h-4',
      text: 'text-lg',
      subtitle: 'text-[10px]',
      dot: 'w-2 h-2'
    },
    md: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
      text: 'text-2xl',
      subtitle: 'text-xs',
      dot: 'w-3 h-3'
    },
    lg: {
      container: 'w-16 h-16',
      icon: 'w-8 h-8',
      text: 'text-3xl',
      subtitle: 'text-sm',
      dot: 'w-4 h-4'
    }
  }

  const sizes = sizeClasses[size]

  const LogoContent = () => (
    <div className={`flex items-center space-x-3 group ${className}`}>
      <motion.div 
        whileHover={{ scale: 1.05, rotate: 5 }}
        className="relative"
      >
        {appLogo ? (
          <div className={`${sizes.container} rounded-2xl overflow-hidden border-2 border-purple-400/50 bg-white shadow-lg group-hover:shadow-xl transition-all`}>
            <img 
              src={appLogo} 
              alt={appName}
              className="w-full h-full object-contain p-1"
            />
          </div>
        ) : (
          <div className={`${sizes.container} bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all`}>
            <ClipboardCheck className={`${sizes.icon} text-white`} />
          </div>
        )}
        <div className={`absolute -top-1 -right-1 ${sizes.dot} bg-green-500 rounded-full border-2 border-white`}></div>
      </motion.div>
      <div>
        <span className={`${sizes.text} font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}>
          {isLoading ? 'SIPelan' : appName}
        </span>
        {showSubtitle && (
          <p className={`${sizes.subtitle} text-gray-500 -mt-1`}>Pengaduan Online</p>
        )}
      </div>
    </div>
  )

  if (linkTo) {
    return (
      <Link href={linkTo} className="flex items-center">
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}
