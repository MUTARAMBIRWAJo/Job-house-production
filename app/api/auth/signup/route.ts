import { createClient } from '@/lib/supabase/server'
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

    const supabase = await createClient()

    // Step 1: Check if user already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Step 2: Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role: role || 'customer'
        },
        // Disable email confirmation for demo
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
      }
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

    // Step 3: Create profile - use server client for admin access
    const { error: profileError } = await supabase
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
      .single()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      
      // Try to clean up the auth user on error
      await supabase.auth.admin.deleteUser(userId).catch((err) => {
        console.error('Cleanup error:', err)
      })

      return NextResponse.json(
        { success: false, error: 'Failed to create user profile. Please try again.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please check your email or proceed to login.',
      user: {
        id: authData.user.id,
        email: authData.user.email
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
