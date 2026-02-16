import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UserRole } from '@/lib/types'
import ArtistSidebar from '@/components/ArtistSidebar'

export default async function ArtistLayout({
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

  // Validate artist access only
  if (userRole !== 'artist') {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 'admin':
        redirect('/admin')
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
      <ArtistSidebar />
      <main className="lg:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}