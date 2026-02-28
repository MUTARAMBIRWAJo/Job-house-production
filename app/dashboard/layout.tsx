'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Music, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  TrendingUp,
  DollarSign,
  Mic2,
  Video,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { Profile, UserRole } from '@/lib/types'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'artist', 'user']
  },
  {
    title: 'My Songs',
    href: '/dashboard/songs',
    icon: Music,
    roles: ['artist', 'admin']
  },
  {
    title: 'My Chord Sheets',
    href: '/dashboard/chord-sheets',
    icon: FileText,
    roles: ['artist', 'admin']
  },
  {
    title: 'My Events',
    href: '/dashboard/events',
    icon: Calendar,
    roles: ['artist', 'admin']
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: TrendingUp,
    roles: ['admin', 'artist']
  },
  {
    title: 'Promotions',
    href: '/dashboard/promotions',
    icon: Star,
    roles: ['admin', 'artist']
  },
  {
    title: 'Studio Bookings',
    href: '/dashboard/studio',
    icon: Mic2,
    roles: ['admin']
  },
  {
    title: 'Event Coverage',
    href: '/dashboard/coverage',
    icon: Video,
    roles: ['admin']
  },
  {
    title: 'Revenue',
    href: '/dashboard/revenue',
    icon: DollarSign,
    roles: ['admin']
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: Users,
    roles: ['admin']
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['admin', 'artist', 'user']
  }
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        // Try to get profile first
        let profile = null
        
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .maybeSingle()
          
          profile = data
        } catch (e) {
          // Profile query failed - will use auth metadata
          console.warn('Profile fetch failed, using auth metadata:', e)
        }
        
        if (profile) {
          setUser(profile)
        } else {
          // Fallback: use role from auth metadata
          const userRole = (authUser.app_metadata?.role as string) || 'customer'
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
            role: userRole,
            avatar_url: authUser.user_metadata?.avatar_url || null,
            phone: null,
            bio: null,
            is_verified: false,
            artist_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            two_factor_secret: null,
            two_factor_enabled: false,
            editor_permissions: {
              can_edit_news: false,
              can_publish_news: false,
              can_approve_lyrics: false,
              can_view_analytics: false,
              can_feature_content: false,
            },
          } as unknown as Profile)
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const filteredItems = sidebarItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">Please log in to access the dashboard</p>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">
                  {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{user.full_name || 'User'}</h3>
                <Badge variant="secondary" className="text-xs">
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <LayoutDashboard className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{user.role}</Badge>
              <span className="text-sm text-muted-foreground">{user.full_name}</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
