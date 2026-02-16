import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UserRole } from '@/lib/types'
import DashboardSidebar from '@/components/DashboardSidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side authentication and role validation
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get role from JWT app_metadata
  const userRole = user.app_metadata?.role as UserRole
  
  if (!userRole) {
    redirect('/login')
  }

  // Validate customer access
  if (userRole !== 'customer') {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 'admin':
        redirect('/admin')
      case 'artist':
        redirect('/artist/dashboard')
      case 'editor':
        redirect('/editor')
      default:
        redirect('/login')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar userRole={userRole} />
      <main className="lg:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}