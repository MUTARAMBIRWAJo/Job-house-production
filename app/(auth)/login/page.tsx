'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, LogIn, Loader2, Shield, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { signInWithPasswordOnly, testEmailProvider } from '@/lib/auth/fallback-auth'

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get('redirect')
  const registered = searchParams.get('registered') === 'true'
  
  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // UI states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'password' | 'otp' | 'fallback'>('password')
  const [resendCooldown, setResendCooldown] = useState(0)
  const [useFallback, setUseFallback] = useState(false)
  
  const supabase = createClient()

  // Handle resend OTP cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  // Step 1: Handle password submission - direct login without mandatory OTP
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Direct sign in with password - this is the primary login method
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        // Handle specific error cases
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password')
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please confirm your email address first')
        } else {
          setError(`Login failed: ${signInError.message}`)
        }
        return
      }

      if (!data.user) {
        setError('Authentication failed')
        return
      }

      // Get user role from app_metadata or fall back to customer
      const userRole = data.user.app_metadata?.role || 'customer'
      
      // Determine redirect based on role
      let redirectUrl = '/dashboard'
      
      switch (userRole) {
        case 'admin':
          redirectUrl = '/admin'
          break
        case 'artist':
          redirectUrl = '/artist/dashboard'
          break
        case 'editor':
          redirectUrl = '/editor'
          break
        default:
          redirectUrl = '/dashboard'
      }

      // Apply redirect parameter if provided
      if (redirectParam) {
        redirectUrl = redirectParam
      }

      // Success - redirect to dashboard
      router.push(redirectUrl)
      router.refresh()
      
    } catch (err) {
      console.error("LOGIN ERROR:", err)
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(`Login failed: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Handle sending OTP for 2FA login
  const handleSendOtp = async () => {
    if (!email || !password) {
      setError('Please enter email and password first')
      return
    }

    setLoading(true)
    setError('')

    try {
      // First validate the user exists with password
      const { data: passwordData, error: passwordError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (passwordError || !passwordData.user) {
        setError('Invalid email or password')
        setLoading(false)
        return
      }

      // Now send OTP
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`
        }
      })

      if (otpError) {
        console.error("OTP ERROR:", otpError)
        
        // Check for rate limiting
        if (otpError.status === 429) {
          setError('Too many requests. Please wait a few minutes before trying again.')
        } else if (otpError.status === 500) {
          setError('Email service temporarily unavailable. Please use password-only login.')
        } else {
          setError(`Failed to send OTP: ${otpError.message}`)
        }
        setLoading(false)
        return
      }

      // OTP sent successfully
      setStep('otp')
      setResendCooldown(60)
      setError('')
      
    } catch (err) {
      console.error("OTP SEND ERROR:", err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Step 5: Handle OTP verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Accept 6 or 8 digit OTP codes (Supabase can send either)
    if (!otp || (otp.length !== 6 && otp.length !== 8)) {
      setError('Please enter a 6 or 8-digit verification code')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Determine OTP type - try 'email' first, then 'recovery'
      let verifyResult = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      })

      // If email type fails, try recovery type
      if (verifyResult.error) {
        console.log("Email OTP failed, trying recovery type...")
        verifyResult = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'recovery'
        })
      }

      // If recovery also fails, try signup type
      if (verifyResult.error) {
        console.log("Recovery OTP failed, trying signup type...")
        verifyResult = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'signup'
        })
      }

      const { data, error: verifyError } = verifyResult

      if (verifyError) {
        console.error("OTP VERIFICATION ERROR:", verifyError)
        
        // Handle 403 Forbidden - token already used or expired
        if (verifyError.status === 403 || verifyError.message.includes('expired') || verifyError.message.includes('invalid')) {
          setError('Verification code expired or already used. Please try logging in again to get a new code.')
          // Reset to password form after a delay
          setTimeout(() => {
            setStep('password')
            setOtp('')
            setError('')
          }, 5000)
          return
        }
        
        // Handle other errors
        setError(`Invalid verification code: ${verifyError.message}`)
        return
      }

      if (!data.user) {
        setError('Verification failed')
        return
      }

      // Get role from JWT app_metadata (no DB query needed)
      const userRole = data.user.app_metadata?.role as string

      if (!userRole) {
        setError('User role not found')
        return
      }

      // Role-based redirect
      let redirectUrl = '/dashboard' // default

      switch (userRole) {
        case 'admin':
          redirectUrl = '/admin'
          break
        case 'artist':
          redirectUrl = '/artist/dashboard'
          break
        case 'editor':
          redirectUrl = '/editor'
          break
        case 'customer':
          redirectUrl = '/dashboard'
          break
        default:
          redirectUrl = '/dashboard'
      }

      // Apply redirect parameter if provided
      if (redirectParam) {
        redirectUrl = redirectParam
      }

      router.push(redirectUrl)
      router.refresh()
      
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP resend
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error("RESEND OTP ERROR:", error)
        setError(`Failed to resend verification code: ${error.message}`)
        return
      }

      setResendCooldown(60)
      setError('Verification code resent successfully')
      
    } catch (err) {
      console.error("RESEND OTP ERROR:", err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend verification code'
      setError(`Resend failed: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Handle back to password form
  const handleBackToPassword = () => {
    setStep('password')
    setOtp('')
    setError('')
    setResendCooldown(0)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img
              src="/Logo_for_JOB_HOUSE_PRODUCTION.png"
              alt="Job House Production"
              className="h-24 w-auto"
            />
          </div>
          <CardTitle className="text-2xl">
            {step === 'password' ? 'Welcome Back' : 'Verify Your Identity'}
          </CardTitle>
          <CardDescription>
            {step === 'password' 
              ? 'Sign in with your email and password'
              : 'Enter the 6-8 digit code sent to your email'
            }
          </CardDescription>
          {registered && step === 'password' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">
                ✓ Registration successful! Please sign in to continue.
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {step === 'password' ? (
            // Password Form
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <Link
                  href="/reset-password"
                  className="text-sm text-secondary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleSendOtp}
                  disabled={loading || !email || !password}
                  className="text-sm"
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Sign in with OTP (2FA)
                </Button>
              </div>

            </form>
          ) : (
            // OTP Form
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6 or 8-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  maxLength={8}
                  required
                  disabled={loading}
                  className="text-center tracking-widest text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Check your email for the verification code (6-8 digits)
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToPassword}
                  disabled={loading}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify'
                  )}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn't receive the code or it expired?
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOtp}
                  disabled={loading || resendCooldown > 0}
                  className="text-sm"
                >
                  {resendCooldown > 0 
                    ? `Resend code in ${resendCooldown}s`
                    : 'Resend verification code'
                  }
                </Button>
                
                <div className="mt-3 pt-3 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      setLoading(true)
                      setError('')
                      
                      // Skip OTP and use direct password authentication
                      const fallbackResult = await signInWithPasswordOnly(email, password)
                      
                      if (fallbackResult.success) {
                        const userRole = fallbackResult.role
                        
                        let redirectUrl = '/dashboard'
                        
                        switch (userRole) {
                          case 'admin':
                            redirectUrl = '/admin'
                            break
                          case 'artist':
                            redirectUrl = '/artist/dashboard'
                            break
                          case 'editor':
                            redirectUrl = '/editor'
                            break
                          default:
                            redirectUrl = '/dashboard'
                        }

                        if (redirectParam) {
                          redirectUrl = redirectParam
                        }

                        router.push(redirectUrl)
                        router.refresh()
                      } else {
                        setError(`Login failed: ${fallbackResult.error}`)
                      }
                      
                      setLoading(false)
                    }}
                    disabled={loading}
                    className="text-xs"
                  >
                    Skip OTP - Login with Password Only
                  </Button>
                </div>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-muted/50 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
            <CardTitle className="text-2xl">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
