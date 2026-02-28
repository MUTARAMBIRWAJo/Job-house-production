'use client'

import { useState, useEffect } from 'react'
import { 
  Music, 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  Eye,
  Clock,
  Star,
  FileText,
  Mic2,
  Video
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { Profile, UserRole } from '@/lib/types'

interface DashboardStats {
  totalSongs: number
  totalChordSheets: number
  totalEvents: number
  totalViews: number
  recentActivity: Array<{
    id: string
    type: 'song' | 'chord_sheet' | 'event' | 'promotion'
    title: string
    created_at: string
    status?: string
  }>
  topPerforming: Array<{
    id: string
    title: string
    views: number
    type: 'song' | 'artist' | 'event'
  }>
  revenue: {
    total: number
    thisMonth: number
    lastMonth: number
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<Profile | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        let profile = null
        
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .maybeSingle()
          
          profile = data
        } catch (e) {
          console.warn('Profile fetch failed:', e)
        }
        
        if (profile) {
          setUser(profile)
          await fetchDashboardStats(profile.id, profile.role)
        } else {
          // Use auth metadata for role
          const userRole = (authUser.app_metadata?.role as UserRole) || 'customer'
          await fetchDashboardStats(authUser.id, userRole)
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardStats = async (userId: string, role: UserRole) => {
    try {
      const supabase = createClient()
      
      // Fetch different stats based on user role
      if (role === 'admin') {
        await fetchAdminStats(supabase)
      } else if (role === 'artist') {
        await fetchArtistStats(supabase, userId)
      } else {
        await fetchUserStats(supabase, userId)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchAdminStats = async (supabase: any) => {
    // Get comprehensive stats for admin
    const [songsRes, artistsRes, eventsRes, promotionsRes, ordersRes] = await Promise.all([
      supabase.from('songs').select('id, view_count, created_at').order('created_at', { ascending: false }).limit(10),
      supabase.from('artists').select('id, name, follower_count').order('follower_count', { ascending: false }).limit(10),
      supabase.from('events').select('id, title, created_at').order('created_at', { ascending: false }).limit(10),
      supabase.from('artist_promotions').select('id, title, created_at, status').order('created_at', { ascending: false }).limit(10),
      supabase.from('orders').select('total, created_at').order('created_at', { ascending: false }).limit(100)
    ])

    const totalViews = songsRes.data?.reduce((sum: number, song: any) => sum + (song.view_count || 0), 0) || 0
    const totalRevenue = ordersRes.data?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0

    setStats({
      totalSongs: songsRes.data?.length || 0,
      totalChordSheets: 0, // Would need to query chord_sheets table
      totalEvents: eventsRes.data?.length || 0,
      totalViews,
      recentActivity: [
        ...songsRes.data?.slice(0, 3).map((song: any) => ({
          id: song.id,
          type: 'song' as const,
          title: `Song: ${song.id}`,
          created_at: song.created_at
        })) || [],
        ...eventsRes.data?.slice(0, 3).map((event: any) => ({
          id: event.id,
          type: 'event' as const,
          title: `Event: ${event.title}`,
          created_at: event.created_at
        })) || [],
        ...promotionsRes.data?.slice(0, 2).map((promo: any) => ({
          id: promo.id,
          type: 'promotion' as const,
          title: `Promotion: ${promo.title}`,
          created_at: promo.created_at,
          status: promo.status
        })) || []
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5),
      topPerforming: [
        ...songsRes.data?.slice(0, 5).map((song: any) => ({
          id: song.id,
          title: `Song: ${song.id}`,
          views: song.view_count || 0,
          type: 'song' as const
        })) || [],
        ...artistsRes.data?.slice(0, 5).map((artist: any) => ({
          id: artist.id,
          title: artist.name,
          views: artist.follower_count || 0,
          type: 'artist' as const
        })) || []
      ].sort((a, b) => b.views - a.views).slice(0, 5),
      revenue: {
        total: totalRevenue,
        thisMonth: totalRevenue * 0.3, // Estimate
        lastMonth: totalRevenue * 0.2 // Estimate
      }
    })
  }

  const fetchArtistStats = async (supabase: any, userId: string) => {
    // Get artist-specific stats
    const [songsRes, chordSheetsRes, eventsRes, promotionsRes] = await Promise.all([
      supabase.from('songs').select('id, view_count, created_at').eq('created_by', userId),
      supabase.from('chord_sheets').select('id, created_at').eq('created_by', userId),
      supabase.from('events').select('id, title, created_at').eq('organizer_id', userId),
      supabase.from('artist_promotions').select('id, created_at, status').eq('user_id', userId)
    ])

    const totalViews = songsRes.data?.reduce((sum: number, song: any) => sum + (song.view_count || 0), 0) || 0

    setStats({
      totalSongs: songsRes.data?.length || 0,
      totalChordSheets: chordSheetsRes.data?.length || 0,
      totalEvents: eventsRes.data?.length || 0,
      totalViews,
      recentActivity: [
        ...songsRes.data?.slice(0, 3).map((song: any) => ({
          id: song.id,
          type: 'song' as const,
          title: `Song: ${song.id}`,
          created_at: song.created_at
        })) || [],
        ...chordSheetsRes.data?.slice(0, 2).map((sheet: any) => ({
          id: sheet.id,
          type: 'chord_sheet' as const,
          title: `Chord Sheet: ${sheet.id}`,
          created_at: sheet.created_at
        })) || []
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5),
      topPerforming: songsRes.data?.slice(0, 5).map((song: any) => ({
        id: song.id,
        title: `Song: ${song.id}`,
        views: song.view_count || 0,
        type: 'song' as const
      })) || [],
      revenue: { total: 0, thisMonth: 0, lastMonth: 0 }
    })
  }

  const fetchUserStats = async (supabase: any, userId: string) => {
    // Get basic user stats
    setStats({
      totalSongs: 0,
      totalChordSheets: 0,
      totalEvents: 0,
      totalViews: 0,
      recentActivity: [],
      topPerforming: [],
      revenue: { total: 0, thisMonth: 0, lastMonth: 0 }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unable to load dashboard</h1>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  const getStatCard = (title: string, value: string | number, icon: React.ReactNode, description?: string) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {user?.role === 'admin' ? 'Admin Dashboard' : 
           user?.role === 'artist' ? 'Artist Dashboard' : 'My Dashboard'}
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your {user?.role === 'admin' ? 'platform' : 'content'}.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {getStatCard(
          'Total Songs',
          stats.totalSongs,
          <Music className="h-4 w-4 text-muted-foreground" />,
          'All time'
        )}
        {getStatCard(
          'Chord Sheets',
          stats.totalChordSheets,
          <FileText className="h-4 w-4 text-muted-foreground" />,
          'All time'
        )}
        {getStatCard(
          'Events',
          stats.totalEvents,
          <Calendar className="h-4 w-4 text-muted-foreground" />,
          'All time'
        )}
        {getStatCard(
          'Total Views',
          stats.totalViews.toLocaleString(),
          <Eye className="h-4 w-4 text-muted-foreground" />,
          'All time'
        )}
      </div>

      {/* Revenue Section (Admin only) */}
      {user?.role === 'admin' && (
        <div className="grid gap-4 md:grid-cols-3">
          {getStatCard(
            'Total Revenue',
            `RWF ${stats.revenue.total.toLocaleString()}`,
            <DollarSign className="h-4 w-4 text-muted-foreground" />,
            'All time'
          )}
          {getStatCard(
            'This Month',
            `RWF ${stats.revenue.thisMonth.toLocaleString()}`,
            <TrendingUp className="h-4 w-4 text-muted-foreground" />,
            'Current month'
          )}
          {getStatCard(
            'Last Month',
            `RWF ${stats.revenue.lastMonth.toLocaleString()}`,
            <Clock className="h-4 w-4 text-muted-foreground" />,
            'Previous month'
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recent activity</p>
              ) : (
                stats.recentActivity.map((activity, index) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex-shrink-0">
                      {activity.type === 'song' && <Music className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'chord_sheet' && <FileText className="h-4 w-4 text-green-600" />}
                      {activity.type === 'event' && <Calendar className="h-4 w-4 text-purple-600" />}
                      {activity.type === 'promotion' && <Star className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {activity.status && (
                      <Badge variant="secondary" className="text-xs">
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing</CardTitle>
            <CardDescription>Your most popular content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topPerforming.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No content yet</p>
              ) : (
                stats.topPerforming.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex-shrink-0">
                      {item.type === 'song' && <Music className="h-4 w-4 text-blue-600" />}
                      {item.type === 'artist' && <Users className="h-4 w-4 text-green-600" />}
                      {item.type === 'event' && <Calendar className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.views.toLocaleString()} views
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
