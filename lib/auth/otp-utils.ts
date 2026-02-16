import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

/**
 * Hash an OTP before storing in database
 */
export async function hashOTP(otp: string): Promise<string> {
  return await bcrypt.hash(otp, SALT_ROUNDS)
}

/**
 * Verify a plain OTP against a hashed OTP
 */
export async function verifyOTP(plainOTP: string, hashedOTP: string): Promise<boolean> {
  return await bcrypt.compare(plainOTP, hashedOTP)
}

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(): string {
  const array = new Uint8Array(32)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array)
  } else {
    // Fallback for server-side
    for (let i = 0; i < 32; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Check if OTP has expired
 */
export function isOTPExpired(expiresAt: string | Date): boolean {
  const expiry = new Date(expiresAt)
  return expiry < new Date()
}

/**
 * Calculate OTP expiry time (10 minutes from now)
 */
export function getOTPExpiry(): Date {
  const expiry = new Date()
  expiry.setMinutes(expiry.getMinutes() + 10)
  return expiry
}
