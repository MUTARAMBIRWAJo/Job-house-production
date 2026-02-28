'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()
      
      try {
        // Get the session - this handles the code exchange automatically
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          setTimeout(() => {
            router.push('/login?error=authentication_failed')
          }, 2000)
          return
        }
        
        if (session?.user) {
          // Get user role from metadata
          const userRole = session.user.app_metadata?.role || 'customer'
          
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
          
          setStatus('success')
          
          // Small delay for better UX
          setTimeout(() => {
            router.push(redirectUrl)
            router.refresh()
          }, 500)
        } else {
          // No session, redirect to login
          setStatus('error')
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setStatus('error')
        setTimeout(() => {
          router.push('/login?error=unexpected_error')
        }, 2000)
      }
    }
    
    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold">Signing you in...</h2>
            <p className="text-muted-foreground mt-2">Please wait while we verify your session</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Successfully signed in!</h2>
            <p className="text-muted-foreground mt-2">Redirecting to your dashboard...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Authentication failed</h2>
            <p className="text-muted-foreground mt-2">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  )
}
