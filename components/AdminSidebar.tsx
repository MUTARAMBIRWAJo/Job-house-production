'use client'

import Link from 'next/link'
import { useRouter, useState } from 'next/navigation'
import { Menu, X, LayoutDashboard, FileText, Users, ShoppingBag, Newspaper, Music, Calendar, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export default function AdminSidebar() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Studio Leads', href: '/admin/leads', icon: FileText },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Products', href: '/admin/products', icon: ShoppingBag },
    { label: 'News', href: '/admin/news', icon: Newspaper },
    { label: 'Songs', href: '/admin/songs', icon: Music },
    { label: 'Events', href: '/admin/events', icon: Calendar },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-primary text-white transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50`}
    >
      <div className="p-6 border-b border-primary/20">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-lg font-bold">Admin CRM</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-primary/20 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/80 transition-colors"
            >
              <Icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-primary/20">
        <Button
          variant="outline"
          className="w-full text-white border-white hover:bg-white/10"
          onClick={() => {
            const supabase = createClient()
            supabase.auth.signOut()
            router.push('/')
          }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {sidebarOpen && 'Logout'}
        </Button>
      </div>
    </aside>
  )
}