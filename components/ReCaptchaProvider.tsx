'use client'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { useEffect, useState } from 'react'

export function ReCaptchaProvider({ children }: { children: React.ReactNode }) {
  const [siteKey, setSiteKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRecaptchaSettings = async () => {
      try {
        // Try to load from database first
        const response = await fetch('/api/settings/public')
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            const enabled = data.data.recaptcha_enabled
            const key = data.data.recaptcha_site_key
            
            console.log(' ReCaptcha settings from database:')
            console.log('  Enabled:', enabled)
            console.log('  Site Key:', key ? ' Found' : ' Not found')
            
            if (enabled && key) {
              setSiteKey(key)
            } else {
              console.log('  reCAPTCHA disabled or no key configured')
            }
          }
        } else {
          // Fallback to environment variable
          const envKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
          console.log(' ReCaptcha fallback to env:')
          console.log('  Site Key:', envKey ? ' Found' : ' Not found')
          if (envKey) {
            setSiteKey(envKey)
          }
        }
      } catch (error) {
        console.error('Error loading reCAPTCHA settings:', error)
        // Fallback to environment variable
        const envKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
        if (envKey) {
          setSiteKey(envKey)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadRecaptchaSettings()
  }, [])

  if (isLoading) {
    return <>{children}</>
  }

  if (!siteKey) {
    console.warn(' reCAPTCHA not configured')
    return <>{children}</>
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  )
}
