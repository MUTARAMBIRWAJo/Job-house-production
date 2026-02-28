/**
 * Validates if a string is a valid HTTP(S) URL
 */
export function isValidHttpUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Validates if an image URL is valid for Next.js Image component
 * Ensures it's an HTTP(S) URL with proper format
 */
export function isValidImageUrl(url: string | null | undefined): url is string {
  if (!isValidHttpUrl(url)) return false
  
  // Check for common invalid patterns
  const urlStr = url as string
  const urlLower = urlStr.toLowerCase()
  
  // Reject URLs with query parameters that might cause issues
  if (urlLower.includes('?') && urlLower.includes('undefined')) return false
  if (urlLower.includes('null')) return false
  if (urlLower.includes('undefined')) return false
  
  return true
}
