/**
 * Utility functions for the application
 */

/**
 * Mask a name for anonymous display
 * Example: "Citra" -> "C**r*", "John Doe" -> "J**n D*e"
 * @param name - The full name to mask
 * @returns Masked name string
 */
export function maskName(name: string): string {
  if (!name || name === 'Anonim') return 'Anonim'
  
  const words = name.trim().split(' ')
  
  return words.map(word => {
    if (word.length <= 1) return word
    if (word.length === 2) return word[0] + '*'
    if (word.length === 3) return word[0] + '*' + word[2]
    
    // For words with 4+ characters: show first char, mask middle, show last char
    const firstChar = word[0]
    const lastChar = word[word.length - 1]
    const middleLength = word.length - 2
    const masked = '*'.repeat(middleLength)
    
    return firstChar + masked + lastChar
  }).join(' ')
}

/**
 * Mask an email for anonymous display
 * Example: "user@example.com" -> "u***@e******.com"
 * @param email - The email to mask
 * @returns Masked email string
 */
export function maskEmail(email: string): string {
  if (!email) return ''
  
  const [localPart, domain] = email.split('@')
  if (!domain) return email
  
  const maskedLocal = localPart.length > 1 
    ? localPart[0] + '*'.repeat(Math.min(localPart.length - 1, 3))
    : localPart
  
  const [domainName, tld] = domain.split('.')
  const maskedDomain = domainName.length > 1
    ? domainName[0] + '*'.repeat(Math.min(domainName.length - 1, 6))
    : domainName
  
  return `${maskedLocal}@${maskedDomain}.${tld}`
}

/**
 * Format a date string to Indonesian locale
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

/**
 * Format a date string to short format
 * @param dateString - ISO date string
 * @returns Short formatted date string
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}
