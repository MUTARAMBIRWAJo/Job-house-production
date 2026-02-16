'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import { UserRole } from '@/lib/types'

interface DashboardSidebarProps {
  userRole: UserRole
}

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'artist', 'customer']
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
    roles: ['admin', 'artist', 'customer']
  }
]

export default function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const filteredItems = sidebarItems.filter(item => 
    item.roles.includes(userRole)
  )

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">
                {userRole.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{userRole}</h3>
              <Badge variant="secondary" className="text-xs">
                {userRole}
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
  )
}