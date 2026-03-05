// ============================================
// ROLE-BASED API MIDDLEWARE
// ============================================

import { createClient } from '@/lib/supabase/server'
import { hasPermission, canAccessResource } from '@/lib/permissions'
import { UserRole } from '@/lib/types'

export interface AuthenticatedRequest {
  userId: string
  userRole: UserRole
  user: any
}

// Middleware to check authentication
export async function checkAuth(): Promise<AuthenticatedRequest | null> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) return null

    // Get user role from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) return null

    return {
      userId: user.id,
      userRole: profile.role as UserRole,
      user
    }
  } catch (error) {
    console.error('Auth check failed:', error)
    return null
  }
}

// Middleware to check if user has specific permission
export function requirePermission(permission: string) {
  return async (userId: string, userRole: UserRole): Promise<boolean> => {
    return hasPermission(userRole, permission as any)
  }
}

// Middleware to check if user can access resource
export function requireResourceAccess(resourceType: string) {
  return async (userRole: UserRole): Promise<boolean> => {
    return canAccessResource(userRole, resourceType as any)
  }
}

// Protected API route handler
export async function protectedRoute(
  requiredPermission?: string,
  requiredResource?: string
) {
  const auth = await checkAuth()

  if (!auth) {
    return {
      error: 'Unauthorized',
      status: 401
    }
  }

  if (requiredPermission) {
    const hasPerms = hasPermission(auth.userRole, requiredPermission as any)
    if (!hasPerms) {
      return {
        error: 'Forbidden',
        status: 403
      }
    }
  }

  if (requiredResource) {
    const canAccess = canAccessResource(auth.userRole, requiredResource as any)
    if (!canAccess) {
      return {
        error: 'Forbidden',
        status: 403
      }
    }
  }

  return auth
}
