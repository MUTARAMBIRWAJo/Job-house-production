import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name, role } = await request.json()

    // Validate input
    if (!email || !password || !full_name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Use admin client for all operations (has unrestricted access)
    const supabase = await createAdminClient()

    // Step 1: Check if user already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Step 2: Create auth user using admin client
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name,
        role: role || 'customer'
      },
      email_confirm: true  // Auto-confirm email for new signups
    })

    if (authError) {
      console.error('Auth signup error:', authError)
      return NextResponse.json(
        { success: false, error: authError.message || 'Failed to create account' },
        { status: 400 }
      )
    }

    if (!authData.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Failed to create user account' },
        { status: 400 }
      )
    }

    const userId = authData.user.id

    // Step 3: Create profile - use admin client (has full access, bypasses RLS)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: email,
        full_name: full_name,
        role: role || 'customer',
        verified: false,
        status: 'active'
      })
      .select()
      .maybeSingle()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      
      // Try to clean up the auth user on error
      await supabase.auth.admin.deleteUser(userId).catch((err) => {
        console.error('Cleanup error:', err)
      })

      return NextResponse.json(
        { success: false, error: `Failed to create user profile: ${profileError.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful! You can now login.',
      user: {
        id: authData.user.id,
        email: authData.user.email
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
