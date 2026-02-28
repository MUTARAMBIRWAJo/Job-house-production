import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Trash2, Eye, Edit } from 'lucide-react'

async function getSongs() {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('songs')
    .select('*, artists:artist_id(name, slug)')
    .order('created_at', { ascending: false })
    .limit(50)

  return data || []
}

export const metadata = {
  title: 'Manage Songs - Admin Dashboard',
}

export default async function AdminSongsPage() {
  const songs = await getSongs()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Manage Songs</h1>
          </div>
          <p className="text-muted-foreground">View and manage all songs in the system</p>
        </div>
      </div>

      {/* Songs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Songs ({songs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {songs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No songs found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Title</th>
                    <th className="text-left py-3 px-4 font-semibold">Artist</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Views</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {songs.map((song: any) => (
                    <tr key={song.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{song.title}</td>
                      <td className="py-3 px-4">
                        {song.artists?.name || 'Unknown'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          song.status === 'published' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {song.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{song.view_count || 0}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
