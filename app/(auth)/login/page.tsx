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
  const [step, setStep] = useState<'password' | 'otp'>('password')
  const [resendCooldown, setResendCooldown] = useState(0)
  
  const supabase = createClient()

  // Handle resend OTP cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  // Step 1: Handle password submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Validate user credentials
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError('Invalid email or password')
        return
      }

      if (!data.user) {
        setError('Authentication failed')
        return
      }

      // Step 3: Send OTP after successful password validation
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`
        }
      })

      if (otpError) {
        console.error("OTP ERROR:", otpError)
        setError(`Failed to send verification code: ${otpError.message}`)
        return
      }

      // Step 4: Show OTP input UI
      setStep('otp')
      setResendCooldown(60)
      setError('')
      
    } catch (err) {
      console.error("LOGIN ERROR:", err)
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(`Login failed: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Step 5: Handle OTP verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) {
      setError('Please enter a 6-digit verification code')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Verify OTP
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      })

      if (verifyError) {
        console.error("OTP VERIFICATION ERROR:", verifyError)
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
              ? 'Sign in to your Job House Production account'
              : 'Enter the 6-digit code sent to your email'
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
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  disabled={loading}
                  className="text-center tracking-widest text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Check your email for the verification code
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
