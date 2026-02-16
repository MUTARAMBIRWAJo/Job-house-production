import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UserRole } from '@/lib/types'
import AdminSidebar from '@/components/AdminSidebar'

export default async function AdminLayout({
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

  // Validate admin access only
  if (userRole !== 'admin') {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 'artist':
        redirect('/artist/dashboard')
      case 'editor':
        redirect('/editor')
      case 'customer':
        redirect('/dashboard')
      default:
        redirect('/login')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}