'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BarChart3, Music, Users, Newspaper, TrendingUp, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CRMStats {
  total_leads: number
  new_leads: number
  in_progress: number
  completed_this_month: number
  total_songs: number
  total_artists: number
  total_news: number
}

interface StudioLead {
  id: string
  artist_name: string
  email: string
  service_type: string
  status: string
  priority: string
  created_at: string
}

export default function AdminPage() {
  const [stats, setStats] = useState<CRMStats | null>(null)
  const [recentLeads, setRecentLeads] = useState<StudioLead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
        setRecentLeads(data.recent_leads || [])
      }
    } catch (error) {
      console.error('[v0] Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-orange-600'
      case 'low': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-secondary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back to the CRM system
          </p>
        </div>
        <Link href="/admin/leads">
          <Button className="bg-secondary hover:bg-secondary/90 text-primary font-semibold">
            View All Leads
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Leads */}
          <Card className="border-secondary/20 hover:border-secondary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Leads
              </CardTitle>
              <BarChart3 className="w-5 h-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats.total_leads}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                All studio lead inquiries
              </p>
            </CardContent>
          </Card>

          {/* New Leads */}
          <Card className="border-blue-200 hover:border-blue-300 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                New Leads
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats.new_leads}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Awaiting initial contact
              </p>
            </CardContent>
          </Card>

          {/* In Progress */}
          <Card className="border-purple-200 hover:border-purple-300 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Progress
              </CardTitle>
              <Clock className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {stats.in_progress}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Active projects
              </p>
            </CardContent>
          </Card>

          {/* Completed This Month */}
          <Card className="border-green-200 hover:border-green-300 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <Music className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats.completed_this_month}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This month
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Platform Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Songs
              </CardTitle>
              <Music className="w-5 h-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.total_songs}
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Artists
              </CardTitle>
              <Users className="w-5 h-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.total_artists}
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                News Posts
              </CardTitle>
              <Newspaper className="w-5 h-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.total_news}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Recent Activity</h2>
        
        <Card className="border-secondary/20">
          <CardHeader>
            <CardTitle className="text-lg">Latest Studio Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No recent leads
              </p>
            ) : (
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <Link key={lead.id} href={`/admin/leads/${lead.id}`}>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-secondary/50 transition-colors cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <h3 className="font-semibold text-foreground truncate">
                            {lead.artist_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {lead.service_type}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {lead.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            lead.status
                          )}`}
                        >
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
