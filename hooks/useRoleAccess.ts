// ============================================
// ROLE-BASED ACCESS HOOK
// ============================================

'use client'

import { useCallback } from 'react'
import { UserRole } from '@/lib/types'
import { hasPermission, canAccessResource, getAvailableActions } from '@/lib/permissions'

export function useRoleAccess(userRole: UserRole | null) {
  // Check if user has specific permission
  const can = useCallback((permission: string): boolean => {
    if (!userRole) return false
    return hasPermission(userRole, permission as any)
  }, [userRole])

  // Check if user can access resource
  const canAccess = useCallback((resource: string): boolean => {
    if (!userRole) return false
    return canAccessResource(userRole, resource as any)
  }, [userRole])

  // Get available actions
  const getActions = useCallback((): string[] => {
    if (!userRole) return []
    return getAvailableActions(userRole)
  }, [userRole])

  // Check if user is admin
  const isAdmin = useCallback((): boolean => {
    return userRole === 'admin'
  }, [userRole])

  // Check if user is editor
  const isEditor = useCallback((): boolean => {
    return userRole === 'editor'
  }, [userRole])

  // Check if user is artist
  const isArtist = useCallback((): boolean => {
    return userRole === 'artist'
  }, [userRole])

  // Check if user is customer
  const isCustomer = useCallback((): boolean => {
    return userRole === 'customer'
  }, [userRole])

  return {
    can,
    canAccess,
    getActions,
    isAdmin,
    isEditor,
    isArtist,
    isCustomer,
    role: userRole
  }
}

// Component to conditionally render based on role
export function RoleGate({
  roles,
  children,
  fallback = null
}: {
  roles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const userRole = null // This should come from context/provider
  const { role } = useRoleAccess(userRole)

  if (!role || !roles.includes(role)) {
    return fallback
  }

  return children
}

// Higher-order component for role protection
export function withRoleProtection(
  Component: React.ComponentType<any>,
  requiredRoles: UserRole[]
) {
  return function ProtectedComponent(props: any) {
    const { role } = useRoleAccess(null) // This should come from context
    const { isAdmin, isEditor, isArtist, isCustomer } = useRoleAccess(role)

    // Check if user has required role
    const hasAccess = requiredRoles.some(r => {
      switch (r) {
        case 'admin':
          return isAdmin()
        case 'editor':
          return isEditor()
        case 'artist':
          return isArtist()
        case 'customer':
          return isCustomer()
        default:
          return false
      }
    })

    if (!hasAccess) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access this page</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}
