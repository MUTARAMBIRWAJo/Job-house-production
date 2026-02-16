import { UserRole } from '@/lib/types'

// ============================================
// ROLE TYPE EXPORTS
// ============================================
export type { UserRole } from '@/lib/types'

// ============================================
// ROLE CHECK FUNCTIONS
// ============================================

/**
 * Check if user is admin
 */
export function isAdmin(role: UserRole | string | null | undefined): boolean {
  return role === 'admin'
}

/**
 * Check if user is artist
 */
export function isArtist(role: UserRole | string | null | undefined): boolean {
  return role === 'artist'
}

/**
 * Check if user is customer
 */
export function isCustomer(role: UserRole | string | null | undefined): boolean {
  return role === 'customer'
}

/**
 * Check if user is editor
 */
export function isEditor(role: UserRole | string | null | undefined): boolean {
  return role === 'editor'
}

/**
 * Check if user has admin privileges
 */
export function isAdminOrEditor(role: UserRole | string | null | undefined): boolean {
  return role === 'admin' || role === 'editor'
}

/**
 * Get default role for new users
 */
export function getDefaultRole(): UserRole {
  return 'customer'
}

/**
 * Normalize role to valid UserRole
 */
export function normalizeRole(role: string | null | undefined): UserRole {
  const validRoles: UserRole[] = ['admin', 'artist', 'customer', 'editor']
  if (validRoles.includes(role as UserRole)) {
    return role as UserRole
  }
  return 'customer'
}

// ============================================
// PERMISSION MAP
// ============================================

export type Permission =
  | '*'
  // Admin permissions
  | 'manage_users'
  | 'manage_artists'
  | 'manage_orders'
  | 'manage_products'
  | 'manage_leads'
  | 'manage_news'
  | 'manage_lyrics'
  | 'view_stats'
  | 'view_financials'
  | 'assign_roles'
  // Editor permissions
  | 'approve_lyrics'
  | 'reject_lyrics'
  | 'create_news'
  | 'edit_news'
  | 'delete_news'
  | 'moderate_content'
  | 'view_pending_submissions'
  // Artist permissions
  | 'manage_own_songs'
  | 'create_song'
  | 'edit_song'
  | 'delete_song'
  | 'view_own_stats'
  | 'request_verification'
  // Customer permissions
  | 'view_orders'
  | 'download_content'
  | 'view_studio_requests'
  | 'edit_own_profile'

export const permissions: Record<UserRole, Permission[]> = {
  admin: [
    '*', // Super admin - all permissions
    'manage_users',
    'manage_artists',
    'manage_orders',
    'manage_products',
    'manage_leads',
    'manage_news',
    'manage_lyrics',
    'view_stats',
    'view_financials',
    'assign_roles',
    'approve_lyrics',
    'reject_lyrics',
    'create_news',
    'edit_news',
    'delete_news',
    'moderate_content',
    'view_pending_submissions',
    'manage_own_songs',
    'create_song',
    'edit_song',
    'delete_song',
    'view_own_stats',
    'request_verification',
    'view_orders',
    'download_content',
    'view_studio_requests',
    'edit_own_profile',
  ],
  editor: [
    'manage_news',
    'manage_lyrics',
    'approve_lyrics',
    'reject_lyrics',
    'create_news',
    'edit_news',
    'delete_news',
    'moderate_content',
    'view_pending_submissions',
    'view_stats',
    'edit_own_profile',
  ],
  artist: [
    'manage_own_songs',
    'create_song',
    'edit_song',
    'delete_song',
    'view_own_stats',
    'request_verification',
    'view_orders',
    'download_content',
    'view_studio_requests',
    'edit_own_profile',
  ],
  customer: [
    'view_orders',
    'download_content',
    'view_studio_requests',
    'edit_own_profile',
  ],
}

// ============================================
// PERMISSION CHECK FUNCTIONS
// ============================================

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole | string | null | undefined, permission: Permission): boolean {
  if (!role) return false
  
  const normalizedRole = normalizeRole(role)
  const rolePermissions = permissions[normalizedRole]
  
  if (!rolePermissions) return false
  
  // Admin with '*' has all permissions
  if (rolePermissions.includes('*')) return true
  
  return rolePermissions.includes(permission)
}

/**
 * Check if a role can access a specific route
 */
export function canAccessRoute(role: UserRole | string | null | undefined, path: string): boolean {
  if (!role) return false
  
  const normalizedRole = normalizeRole(role)
  
  // Check route patterns first
  if (path.startsWith('/admin')) {
    return normalizedRole === 'admin'
  }
  if (path.startsWith('/editor')) {
    return normalizedRole === 'admin' || normalizedRole === 'editor'
  }
  if (path.startsWith('/artist/dashboard')) {
    return normalizedRole === 'artist'
  }
  if (path.startsWith('/dashboard')) {
    return normalizedRole !== null
  }
  
  return true
}

// ============================================
// ROLE-BASED REDIRECT MAP
// ============================================

/**
 * Get redirect URL based on user role
 */
export function getRoleBasedRedirect(role: UserRole | string | null | undefined, redirectParam?: string): string {
  // If there's a redirect param, use it
  if (redirectParam) {
    return redirectParam
  }
  
  // Default redirects based on role
  const roleRedirects: Record<UserRole, string> = {
    admin: '/admin',
    editor: '/editor',
    artist: '/artist/dashboard',
    customer: '/dashboard',
  }
  
  const normalizedRole = normalizeRole(role ?? null)
  return roleRedirects[normalizedRole] || '/dashboard'
}

// ============================================
// DASHBOARD ROUTE CONFIG
// ============================================

export interface DashboardRoute {
  path: string
  requiredRoles: UserRole[]
  title: string
  description: string
}

export const dashboardRoutes: DashboardRoute[] = [
  {
    path: '/admin',
    requiredRoles: ['admin'],
    title: 'Admin Dashboard',
    description: 'Full system administration',
  },
  {
    path: '/editor',
    requiredRoles: ['admin', 'editor'],
    title: 'Editor Dashboard',
    description: 'Content management and moderation',
  },
  {
    path: '/artist/dashboard',
    requiredRoles: ['admin', 'artist'],
    title: 'Artist Dashboard',
    description: 'Manage your songs and stats',
  },
  {
    path: '/dashboard',
    requiredRoles: ['admin', 'artist', 'editor', 'customer'],
    title: 'My Dashboard',
    description: 'View orders and downloads',
  },
]

/**
 * Get accessible dashboards for a role
 */
export function getAccessibleDashboards(role: UserRole | string | null | undefined): DashboardRoute[] {
  if (!role) return []
  
  const normalizedRole = normalizeRole(role)
  
  return dashboardRoutes.filter(route => 
    route.requiredRoles.includes(normalizedRole)
  )
}
