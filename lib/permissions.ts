// ============================================
// ROLE-BASED PERMISSIONS SYSTEM
// ============================================

export type UserRole = 'admin' | 'editor' | 'artist' | 'customer'

export interface Permission {
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
  publish: boolean
  moderate: boolean
  manage_users: boolean
  view_analytics: boolean
}

export interface RolePermissions {
  [key: string]: Permission
}

// Define permissions for each role
export const rolePermissions: RolePermissions = {
  // ADMIN - Full access to everything
  admin: {
    create: true,
    read: true,
    update: true,
    delete: true,
    publish: true,
    moderate: true,
    manage_users: true,
    view_analytics: true
  },

  // EDITOR - Can create, edit, and publish content
  editor: {
    create: true,
    read: true,
    update: true,
    delete: false,
    publish: true,
    moderate: false,
    manage_users: false,
    view_analytics: true
  },

  // ARTIST - Can only manage their own content
  artist: {
    create: true,
    read: true,
    update: true,
    delete: false,
    publish: true,
    moderate: false,
    manage_users: false,
    view_analytics: true
  },

  // CUSTOMER - Limited read-only access
  customer: {
    create: false,
    read: true,
    update: false,
    delete: false,
    publish: false,
    moderate: false,
    manage_users: false,
    view_analytics: false
  }
}

// Check if user has permission
export function hasPermission(
  role: UserRole,
  permission: keyof Permission
): boolean {
  const permissions = rolePermissions[role]
  if (!permissions) return false
  return permissions[permission]
}

// Check if user can access resource
export function canAccessResource(
  role: UserRole,
  resourceType: 'songs' | 'news' | 'artists' | 'events' | 'users' | 'analytics'
): boolean {
  const accessControl = {
    songs: ['admin', 'artist', 'editor'],
    news: ['admin', 'editor'],
    artists: ['admin'],
    events: ['admin', 'artist'],
    users: ['admin'],
    analytics: ['admin', 'artist', 'editor']
  }

  const allowedRoles = accessControl[resourceType] || []
  return allowedRoles.includes(role)
}

// Get available actions for a role
export function getAvailableActions(
  role: UserRole
): string[] {
  const permissions = rolePermissions[role]
  if (!permissions) return []

  const actions = []
  if (permissions.create) actions.push('create')
  if (permissions.read) actions.push('read')
  if (permissions.update) actions.push('update')
  if (permissions.delete) actions.push('delete')
  if (permissions.publish) actions.push('publish')
  if (permissions.moderate) actions.push('moderate')
  if (permissions.manage_users) actions.push('manage_users')
  if (permissions.view_analytics) actions.push('view_analytics')

  return actions
}

// Redirect if user doesn't have permission
export function redirectIfUnauthorized(
  userRole: UserRole | null,
  requiredRole: UserRole | UserRole[]
): boolean {
  if (!userRole) return true

  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  return !requiredRoles.includes(userRole)
}
