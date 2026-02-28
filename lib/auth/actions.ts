'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { getRoleBasedRedirect, normalizeRole } from './roles'
import { UserRole } from '@/lib/types'

// ============================================
// VALIDATION SCHEMAS
// ============================================

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(2, 'Full name is required'),
  role: z.enum(['customer', 'artist']).default('customer')
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get user role from profile
 */
async function getUserRole(userId: string): Promise<string | null> {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  return profile?.role || null
}

/**
 * Redirect user based on their role
 * Supports redirect parameter for post-login navigation
 */
function redirectByRole(role: string | null, redirectParam?: string): void {
  const url = getRoleBasedRedirect(role as UserRole, redirectParam)
  redirect(url)
}

// ============================================
// SERVER ACTIONS
// ============================================

/**
 * Register a new user with guaranteed profile creation
 */
export async function register(formData: FormData) {
  const supabase = await createClient()

  // Validate form data
  const validatedFields = registerSchema.parse({
    email: formData.get('email'),
    password: formData.get('password'),
    full_name: formData.get('full_name'),
    role: (formData.get('role') as string) || 'customer'
  })

  try {
    // Check if user already exists in profiles
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', validatedFields.email)
      .single()

    if (existingProfile) {
      throw new Error('An account with this email already exists')
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedFields.email,
      password: validatedFields.password,
      options: {
        data: {
          full_name: validatedFields.full_name,
          role: validatedFields.role
        }
      }
    })

    if (authError) {
      console.error('Auth signup error:', authError)
      throw authError
    }

    if (!authData.user) {
      throw new Error('Failed to create user account')
    }

    const userId = authData.user.id

    // Explicitly create profile to ensure it exists
    // This is a safety measure - the trigger should handle this
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: validatedFields.email,
        full_name: validatedFields.full_name,
        role: validatedFields.role,
        verified: false,
        status: 'active'
      })

    if (profileError) {
      // Profile creation failed - attempt to clean up auth user
      console.error('Profile creation error:', profileError)

      // Try to delete the auth user to prevent orphaned accounts
      await supabase.auth.admin.deleteUser(userId).catch(console.error)

      throw new Error('Failed to create user profile. Please try again.')
    }

    // Registration successful - redirect to login with success message
    // User needs to verify email before logging in (if email confirmation is enabled)
    redirect('/login?registered=true')

  } catch (error) {
    console.error('Registration error:', error)
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message)
    }
    throw error instanceof Error ? error : new Error('Registration failed. Please try again.')
  }
}

/**
 * Login user - simplified without OTP
 * Validates credentials and redirects based on role
 */
export async function login(formData: FormData) {
  const supabase = await createClient()

  // Validate form data
  const validatedFields = loginSchema.parse({
    email: formData.get('email'),
    password: formData.get('password')
  })

  try {
    // Verify credentials
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: validatedFields.email,
      password: validatedFields.password
    })

    if (authError) {
      console.error('Login error:', authError.message)
      throw new Error('Invalid email or password')
    }

    if (!authData.user) {
      throw new Error('Invalid email or password')
    }

    // Get user role from profile
    const userRole = await getUserRole(authData.user.id)

    // Get redirect parameter from form
    const redirectParam = formData.get('redirect') as string | null

    // Redirect based on role
    redirectByRole(userRole, redirectParam || undefined)

  } catch (error) {
    console.error('Login error:', error)
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message)
    }
    throw error instanceof Error ? error : new Error('Invalid email or password')
  }
}

/**
 * Logout user
 */
export async function signOut() {
  const supabase = await createClient()

  await supabase.auth.signOut()
  redirect('/')
}

/**
 * Get current user session
 */
export async function getSession() {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  return session
}

/**
 * Get current user with profile
 */
export async function getCurrentUser() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    ...user,
    profile
  }
}

/**
 * Check if current user is authenticated
 */
export async function requireAuth() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return user
}

/**
 * Check if current user is admin
 */
export async function requireAdmin() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return user
}
