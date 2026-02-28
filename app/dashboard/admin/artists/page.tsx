import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Trash2, Eye, Edit, CheckCircle } from 'lucide-react'

async function getArtists() {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('artists')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return data || []
}

export const metadata = {
  title: 'Manage Artists - Admin Dashboard',
}

export default async function AdminArtistsPage() {
  const artists = await getArtists()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Manage Artists</h1>
          </div>
          <p className="text-muted-foreground">View and manage all artists on the platform</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Artists ({artists.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {artists.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No artists found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Genres</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Verified</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {artists.map((artist: any) => (
                    <tr key={artist.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{artist.name}</td>
                      <td className="py-3 px-4">
                        {artist.genres && artist.genres.length > 0 
                          ? artist.genres.slice(0, 2).join(', ')
                          : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {artist.verified_status === 'verified' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <span className="text-xs text-muted-foreground">Pending</span>
                        )}
                      </td>
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
