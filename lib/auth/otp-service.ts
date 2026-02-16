// lib/auth/otp-service.ts
// This is a utility module that will be imported BY server actions
// NO "use server" directive here

import { createClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'

// ============================================
// HELPER FUNCTIONS - PURE UTILITIES
// ============================================

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function hashOTP(otp: string): Promise<string> {
  const saltRounds = 10
  return await bcrypt.hash(otp, saltRounds)
}

export async function verifyOTP(plainOTP: string, hashedOTP: string): Promise<boolean> {
  return await bcrypt.compare(plainOTP, hashedOTP)
}

export function getOTPExpiry(): Date {
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 10) // 10 minutes
  return expiresAt
}

export function isOTPExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date()
}

export interface OTPResult {
  success: boolean
  message: string
  expiresAt?: Date
  userId?: string
}

/**
 * Generate and store OTP for a user
 */
export async function createOTP(
  userId: string,
  email: string,
  purpose: 'login' | 'registration' | 'password_reset'
): Promise<OTPResult> {
  const supabase = await createClient()

  try {
    // Generate OTP
    const otp = generateOTP()
    const hashedOTP = await hashOTP(otp)
    const expiresAt = getOTPExpiry()

    // Delete any existing unverified OTPs for this email and purpose
    await supabase
      .from('otp_verifications')
      .delete()
      .eq('email', email)
      .eq('purpose', purpose)
      .is('verified_at', null)

    // Store new OTP
    const { error: insertError } = await supabase
      .from('otp_verifications')
      .insert({
        user_id: userId,
        email,
        otp_code: hashedOTP,
        purpose,
        expires_at: expiresAt.toISOString(),
        attempts: 0
      })

    if (insertError) {
      console.error('Error storing OTP:', insertError)
      return { success: false, message: 'Failed to create OTP' }
    }

    // Log OTP for development - in production, configure SMTP in Supabase Dashboard
    console.log('\n=================================')
    console.log(`🔐 OTP for ${email}`)
    console.log(`📧 Purpose: ${purpose}`)
    console.log(`🔑 Code: ${otp}`)
    console.log(`⏰ Expires: ${expiresAt.toLocaleString()}`)
    console.log('=================================\n')

    return {
      success: true,
      message: 'OTP created successfully',
      expiresAt
    }
  } catch (error) {
    console.error('OTP creation error:', error)
    return { success: false, message: 'Failed to create OTP' }
  }
}

/**
 * Verify an OTP
 */
export async function verifyOTPCode(
  email: string,
  otp: string,
  purpose: 'login' | 'registration' | 'password_reset'
): Promise<{ success: boolean; message: string; userId?: string }> {
  const supabase = await createClient()

  try {
    // Get latest unverified OTP
    const { data: otpRecord, error: fetchError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('email', email)
      .eq('purpose', purpose)
      .is('verified_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError || !otpRecord) {
      return { success: false, message: 'Invalid or expired OTP' }
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      await supabase
        .from('otp_verifications')
        .delete()
        .eq('id', otpRecord.id)
      return { success: false, message: 'Too many failed attempts. Please request a new OTP.' }
    }

    // Check if expired
    if (isOTPExpired(otpRecord.expires_at)) {
      return { success: false, message: 'OTP has expired. Please request a new one.' }
    }

    // Verify OTP
    const isValid = await verifyOTP(otp, otpRecord.otp_code)

    if (isValid) {
      // Mark as verified
      await supabase
        .from('otp_verifications')
        .update({
          verified_at: new Date().toISOString(),
          attempts: otpRecord.attempts + 1
        })
        .eq('id', otpRecord.id)

      return {
        success: true,
        message: 'OTP verified successfully',
        userId: otpRecord.user_id
      }
    } else {
      // Increment attempts
      await supabase
        .from('otp_verifications')
        .update({ attempts: otpRecord.attempts + 1 })
        .eq('id', otpRecord.id)

      return { success: false, message: 'Invalid OTP' }
    }
  } catch (error) {
    console.error('OTP verification error:', error)
    return { success: false, message: 'Failed to verify OTP' }
  }
}

/**
 * Resend OTP
 */
export async function resendOTP(
  email: string,
  purpose: 'login' | 'registration' | 'password_reset'
): Promise<OTPResult> {
  const supabase = await createClient()

  try {
    // Get user by email
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return { success: false, message: 'User not found' }
    }

    // Check if there's a recent OTP (rate limiting)
    const { data: recentOTP } = await supabase
      .from('otp_verifications')
      .select('created_at')
      .eq('email', email)
      .eq('purpose', purpose)
      .is('verified_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (recentOTP) {
      const timeSinceLastOTP = Date.now() - new Date(recentOTP.created_at).getTime()
      const cooldownPeriod = 60 * 1000 // 1 minute cooldown

      if (timeSinceLastOTP < cooldownPeriod) {
        const waitTime = Math.ceil((cooldownPeriod - timeSinceLastOTP) / 1000)
        return {
          success: false,
          message: `Please wait ${waitTime} seconds before requesting a new OTP`
        }
      }
    }

    // Create new OTP
    return await createOTP(user.id, email, purpose)
  } catch (error) {
    console.error('Resend OTP error:', error)
    return { success: false, message: 'Failed to resend OTP' }
  }
}

/**
 * Check if OTP verification is pending
 */
export async function isOTPPending(email: string): Promise<boolean> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('otp_verifications')
    .select('id')
    .eq('email', email)
    .is('verified_at', null)
    .gt('expires_at', new Date().toISOString())
    .limit(1)
    .single()

  return !!data
}
