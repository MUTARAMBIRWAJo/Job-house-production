import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { 
  Music, 
  FileText, 
  Users, 
  TrendingUp, 
  Eye,
  Settings,
  LogOut,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { signOut } from '@/lib/auth/actions'

export default async function EditorDashboardPage() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Get user profile to check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  // Only allow editor and admin roles
  if (profile?.role !== 'editor' && profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Get pending content counts
  const [
    { count: pendingLyrics },
    { count: pendingNews },
    { count: totalLyrics },
    { count: totalNews }
  ] = await Promise.all([
    supabase.from('songs').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('news').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('songs').select('id', { count: 'exact', head: true }),
    supabase.from('news').select('id', { count: 'exact', head: true })
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Editor Dashboard</h1>
              <p className="text-muted-foreground">Content management and moderation</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {profile.full_name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Lyrics</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingLyrics || 0}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending News</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingNews || 0}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lyrics</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLyrics || 0}</div>
              <p className="text-xs text-muted-foreground">In database</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total News</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalNews || 0}</div>
              <p className="text-xs text-muted-foreground">Published articles</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/lyrics">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Manage Lyrics
                </CardTitle>
                <CardDescription>Review and approve submitted lyrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  {pendingLyrics && pendingLyrics > 0 ? (
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      {pendingLyrics} pending
                    </Badge>
                  ) : (
                    <Badge variant="default">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      All caught up
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/news">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Manage News
                </CardTitle>
                <CardDescription>Create and manage news content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  {pendingNews && pendingNews > 0 ? (
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      {pendingNews} pending
                    </Badge>
                  ) : (
                    <Badge variant="default">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      All caught up
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/search">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  View Users
                </CardTitle>
                <CardDescription>Browse user accounts and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">
                    <Eye className="w-3 h-3 mr-1" />
                    View all
                  </Badge>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest content updates and moderation actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="w-8 h-8 mx-auto mb-4 opacity-50" />
              <p>Activity tracking coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
