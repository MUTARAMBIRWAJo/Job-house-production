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

    // Step 2: Get user role from database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profileError || !profile) {
      console.error("Profile fetch error:", profileError)
      return { 
        success: false, 
        error: 'User profile not found' 
      }
    }

    return {
      success: true,
      user: data.user,
      role: profile.role,
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
