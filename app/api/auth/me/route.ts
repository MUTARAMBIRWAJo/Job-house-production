import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
      try {
            const supabase = await createClient()

            const { data: { user }, error } = await supabase.auth.getUser()

            if (error || !user) {
                  return NextResponse.json({
                        authenticated: false,
                        user: null
                  })
            }

            // Get user profile
            const { data: profile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', user.id)
                  .single()

            return NextResponse.json({
                  authenticated: true,
                  user: {
                        id: user.id,
                        email: user.email,
                        profile
                  }
            })
      } catch (error) {
            console.error('[v0] Auth check error:', error)
            return NextResponse.json(
                  { authenticated: false, error: 'Failed to check authentication' },
                  { status: 500 }
            )
      }
}
