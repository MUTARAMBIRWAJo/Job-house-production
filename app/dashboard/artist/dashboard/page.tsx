'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Music, TrendingUp, Users, BarChart3, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

export default function ArtistDashboard() {
  const [loading, setLoading] = useState(true)
  const [artist, setArtist] = useState<any>(null)
  const [stats, setStats] = useState({
    total_songs: 0,
    total_views: 0,
    total_downloads: 0,
    featured_songs: 0
  })
  const [recentSongs, setRecentSongs] = useState<any[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      // Fetch artist profile
      const { data: artistData } = await supabase
        .from('artists')
        .select('*')
        .eq('email', user.email)
        .single()

      if (artistData) {
        setArtist(artistData)

        // Fetch songs statistics
        const { data: songs } = await supabase
          .from('songs')
          .select('*')
          .eq('artist_id', artistData.id)

        if (songs) {
          const totalViews = songs.reduce((sum, song) => sum + (song.view_count || 0), 0)
          const totalDownloads = songs.reduce((sum, song) => sum + (song.download_count || 0), 0)
          const featuredSongs = songs.filter(s => s.is_featured).length

          setStats({
            total_songs: songs.length,
            total_views: totalViews,
            total_downloads: totalDownloads,
            featured_songs: featuredSongs
          })

          // Get recent songs
          setRecentSongs(songs.slice(0, 5))
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-8">
      {/* Header with Artist Info */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {artist?.name || 'Artist Dashboard'}
        </h1>
        <p className="text-muted-foreground">Manage your music and profile</p>
        {artist?.is_verified && (
          <Badge className="mt-2">✓ Verified Artist</Badge>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Music className="w-4 h-4" />
              Total Songs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total_songs}</div>
            <p className="text-xs text-muted-foreground mt-1">Published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total_views.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total_downloads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total downloads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Music className="w-4 h-4" />
              Featured
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.featured_songs}</div>
            <p className="text-xs text-muted-foreground mt-1">Featured songs</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Songs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage your song library and publish new music
            </p>
            <Link href="/dashboard/artist/songs">
              <Button className="w-full gap-2">
                <Music className="w-4 h-4" />
                Manage Songs
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Update your artist profile and social links
            </p>
            <Link href="/dashboard/artist/profile">
              <Button className="w-full gap-2">
                <Users className="w-4 h-4" />
                Edit Profile
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              View detailed stats about your music
            </p>
            <Link href="/dashboard/artist/analytics">
              <Button className="w-full gap-2">
                <BarChart3 className="w-4 h-4" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Songs */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Recent Songs</CardTitle>
          <Link href="/dashboard/artist/songs/new">
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Song
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentSongs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No songs yet. Create your first song to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {recentSongs.map((song: any) => (
                <div key={song.id} className="flex items-center justify-between p-3 border rounded hover:bg-accent transition">
                  <div>
                    <h4 className="font-medium">{song.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {song.view_count || 0} views • {song.download_count || 0} downloads
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={song.status === 'published' ? 'default' : 'secondary'}>
                      {song.status}
                    </Badge>
                    <Link href={`/dashboard/artist/songs/${song.id}/edit`}>
                      <Button size="sm" variant="outline">Edit</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
