'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function EditorDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    pending_news: 0,
    published_news: 0,
    pending_lyrics: 0,
    featured_content: 0
  })
  const [recentContent, setRecentContent] = useState<any[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const supabase = createClient()

      // Fetch stats
      const [newsRes, lyricsRes, featuredRes] = await Promise.all([
        supabase.from('news').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('songs').select('id', { count: 'exact', head: true }).eq('needs_review', true),
        supabase.from('news').select('id', { count: 'exact', head: true }).eq('is_featured', true)
      ])

      setStats({
        pending_news: newsRes.count || 0,
        published_news: 0,
        pending_lyrics: lyricsRes.count || 0,
        featured_content: featuredRes.count || 0
      })

      // Fetch recent content
      const { data } = await supabase
        .from('news')
        .select('*')
        .eq('status', 'draft')
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentContent(data || [])
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Editor Dashboard</h1>
        <p className="text-muted-foreground">Manage and publish platform content</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              Pending News
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pending_news}</div>
            <p className="text-xs text-muted-foreground mt-1">Waiting for review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Pending Lyrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pending_lyrics}</div>
            <p className="text-xs text-muted-foreground mt-1">For approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              Featured Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.featured_content}</div>
            <p className="text-xs text-muted-foreground mt-1">On homepage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/editor/news">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                Manage News
              </Button>
            </Link>
            <Link href="/dashboard/editor/lyrics">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                Review Lyrics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content for Review */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Content Pending Review</CardTitle>
        </CardHeader>
        <CardContent>
          {recentContent.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No pending content</p>
          ) : (
            <div className="space-y-4">
              {recentContent.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded hover:bg-accent transition">
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Link href={`/dashboard/editor/news/${item.id}/edit`}>
                    <Button size="sm">Review</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* News Section */}
        <Card>
          <CardHeader>
            <CardTitle>News Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create, edit, and publish news articles on the platform
            </p>
            <Link href="/dashboard/editor/news">
              <Button className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Manage News
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Lyrics Review Section */}
        <Card>
          <CardHeader>
            <CardTitle>Lyrics Approval</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Review and approve user-submitted song lyrics
            </p>
            <Link href="/dashboard/editor/lyrics">
              <Button className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Review Lyrics
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Content Featuring */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage featured content on homepage and category pages
            </p>
            <Link href="/dashboard/editor/featured">
              <Button className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Manage Featured
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              View engagement metrics and content performance
            </p>
            <Link href="/dashboard/editor/analytics">
              <Button className="w-full gap-2">
                <Plus className="w-4 h-4" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
