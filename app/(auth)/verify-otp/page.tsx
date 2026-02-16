'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
      Card,
      CardContent,
      CardHeader,
      CardTitle,
      CardDescription,
} from '@/components/ui/card'

function OTPVerificationContent() {
      const router = useRouter()
      const searchParams = useSearchParams()
      const email = searchParams.get('email') || ''
      const purpose = searchParams.get('purpose') || 'login'

      useEffect(() => {
            // OTP is no longer required - redirect to login
            // Users can now log in directly with email and password
            const timer = setTimeout(() => {
                  router.push('/login')
            }, 2000)

            return () => clearTimeout(timer)
      }, [router])

      return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-4">
                  <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                              <div className="mx-auto mb-4 w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                              </div>
                              <CardTitle className="text-2xl">Redirecting...</CardTitle>
                              <CardDescription>
                                    OTP verification is no longer required. You'll be redirected to login.
                              </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                              <p className="text-sm text-muted-foreground mb-4">
                                    You can now log in directly with your email and password.
                              </p>
                              <Button asChild className="w-full bg-secondary hover:bg-secondary/90 text-primary">
                                    <Link href="/login">Go to Login</Link>
                              </Button>
                        </CardContent>
                  </Card>
            </div>
      )
}

export default function VerifyOTPPage() {
      return (
            <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
            }>
                  <OTPVerificationContent />
            </Suspense>
      )
}
