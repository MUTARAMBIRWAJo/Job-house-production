import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UserRole } from '@/lib/types'

/**
 * Server-side role validation utility
 * Validates user authentication and role, redirects if invalid
 */
export async function validateRole(allowedRoles: UserRole[]): Promise<UserRole> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get role from JWT app_metadata
  const userRole = user.app_metadata?.role as UserRole
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on actual role
    const redirectPath = getRoleRedirect(userRole)
    redirect(redirectPath)
  }

  return userRole
}

/**
 * Get redirect URL based on user role
 */
function getRoleRedirect(role: string | null): string {
  switch (role) {
    case 'admin': return '/admin'
    case 'artist': return '/artist/dashboard'
    case 'editor': return '/editor'
    case 'customer': return '/dashboard'
    default: return '/login'
  }
}

/**
 * Validate admin access only
 */
export async function requireAdmin(): Promise<void> {
  await validateRole(['admin'])
}

/**
 * Validate artist access only
 */
export async function requireArtist(): Promise<void> {
  await validateRole(['artist'])
}

/**
 * Validate editor access (editor or admin)
 */
export async function requireEditor(): Promise<void> {
  await validateRole(['editor', 'admin'])
}

/**
 * Validate customer access only
 */
export async function requireCustomer(): Promise<void> {
  await validateRole(['customer'])
}

/**
 * Validate any authenticated user
 */
export async function requireAuth(): Promise<UserRole> {
  return await validateRole(['admin', 'artist', 'editor', 'customer'])
}