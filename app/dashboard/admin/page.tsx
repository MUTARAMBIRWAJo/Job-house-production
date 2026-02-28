import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Music, Users, FileText, Calendar, ShoppingCart } from 'lucide-react'

async function getStats() {
  const supabase = await createClient()
  
  const [
    { count: songsCount },
    { count: artistsCount },
    { count: newsCount },
    { count: eventsCount },
    { count: ordersCount },
    { count: usersCount },
  ] = await Promise.all([
    supabase.from('songs').select('id', { count: 'exact', head: true }),
    supabase.from('artists').select('id', { count: 'exact', head: true }),
    supabase.from('news').select('id', { count: 'exact', head: true }),
    supabase.from('events').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
  ])

  return {
    songs: songsCount || 0,
    artists: artistsCount || 0,
    news: newsCount || 0,
    events: eventsCount || 0,
    orders: ordersCount || 0,
    users: usersCount || 0,
  }
}

export const metadata = {
  title: 'Admin Dashboard - Job House Production',
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    { label: 'Total Songs', value: stats.songs, icon: Music, href: '/dashboard/admin/songs' },
    { label: 'Artists', value: stats.artists, icon: Users, href: '/dashboard/admin/artists' },
    { label: 'News Posts', value: stats.news, icon: FileText, href: '/dashboard/admin/news' },
    { label: 'Events', value: stats.events, icon: Calendar, href: '/dashboard/admin/events' },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart, href: '/dashboard/admin/orders' },
    { label: 'Users', value: stats.users, icon: Users, href: '/dashboard/admin/users' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage all platform content and operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/dashboard/admin/songs">
              <Button variant="outline" className="w-full justify-start">
                <Music className="w-4 h-4 mr-2" />
                Manage Songs
              </Button>
            </Link>
            <Link href="/dashboard/admin/news">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Manage News
              </Button>
            </Link>
            <Link href="/dashboard/admin/events">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Manage Events
              </Button>
            </Link>
            <Link href="/dashboard/admin/artists">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Manage Artists
              </Button>
            </Link>
            <Link href="/dashboard/admin/orders">
              <Button variant="outline" className="w-full justify-start">
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Orders
              </Button>
            </Link>
            <Link href="/dashboard/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
