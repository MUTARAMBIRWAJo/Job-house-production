import { createClient } from '@/lib/supabase/client'

// Fallback authentication method when email OTP fails
export async function signInWithPasswordOnly(email: string, password: string) {
  const supabase = createClient()
  
  try {
    // Step 1: Validate credentials
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      console.error("Password sign-in error:", signInError)
      return { 
        success: false, 
        error: signInError.message || 'Invalid credentials' 
      }
    }

    if (!data.user) {
      return { 
        success: false, 
        error: 'Authentication failed' 
      }
    }

    // Step 2: Get user role from JWT metadata (no DB query needed)
    const userRole = data.user.app_metadata?.role as string

    if (!userRole) {
      console.error("User role not found in metadata")
      return { 
        success: false, 
        error: 'User role not found' 
      }
    }

    return {
      success: true,
      user: data.user,
      role: userRole,
      session: data.session
    }

  } catch (error) {
    console.error("Fallback auth error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Authentication failed' 
    }
  }
}

// Fallback registration method when email confirmation fails
export async function registerWithoutEmail(email: string, password: string, fullName: string, role: string) {
  const supabase = createClient()
  
  try {
    // Step 1: Create user in Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role
        }
      }
    })

    if (authError) {
      console.error("Registration error:", authError)
      return { 
        success: false, 
        error: authError.message || 'Registration failed' 
      }
    }

    if (!data.user) {
      return { 
        success: false, 
        error: 'Failed to create user account' 
      }
    }

    // Step 2: Explicitly create profile to ensure it exists
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: email,
        full_name: fullName,
        role: role,
        is_verified: true // Auto-verify since email confirmation failed
      })

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // Try to clean up auth user to prevent orphaned accounts
      await supabase.auth.admin.deleteUser(data.user.id).catch(console.error)
      return { 
        success: false, 
        error: 'Failed to create user profile' 
      }
    }

    return {
      success: true,
      user: data.user,
      message: 'Registration successful! You can now log in.'
    }

  } catch (error) {
    console.error("Fallback registration error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Registration failed' 
    }
  }
}

// Check if email provider is working
export async function testEmailProvider(email: string) {
  const supabase = createClient()
  
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`
      }
    })

    return {
      working: !error,
      error: error?.message
    }
  } catch (error) {
    return {
      working: false,
      error: error instanceof Error ? error.message : 'Email provider test failed'
    }
  }
}
