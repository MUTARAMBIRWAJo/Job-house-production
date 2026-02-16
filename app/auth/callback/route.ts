import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error && data.user) {
        // Fetch user role after successful authentication
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        const userRole = profile?.role || 'customer'
        
        // Redirect to appropriate dashboard based on role
        let redirectUrl = next
        if (next === '/dashboard') {
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
        }

        return NextResponse.redirect(`${origin}${redirectUrl}`)
      }
    } catch (error) {
      console.error('Auth callback error:', error)
    }
  }

  // If there's an error or no code, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=authentication_failed`)
}
