'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  TrendingUp, 
  Eye,
  Settings, 
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

// Editor sidebar component for role-based navigation

export default function EditorSidebar() {
  const router = useRouter()

  const menuItems = [
    { title: 'Dashboard', href: '/editor', icon: LayoutDashboard },
    { title: 'Manage Lyrics', href: '/editor/lyrics', icon: FileText },
    { title: 'Manage News', href: '/editor/news', icon: FileText },
    { title: 'Content Review', href: '/editor/review', icon: Eye },
    { title: 'User Management', href: '/editor/users', icon: Users },
    { title: 'Analytics', href: '/editor/analytics', icon: TrendingUp },
    { title: 'Settings', href: '/editor/settings', icon: Settings },
  ]

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">E</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Editor</h3>
              <Badge variant="secondary" className="text-xs">
                Editor
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
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