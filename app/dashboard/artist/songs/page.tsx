'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Trash2, Edit, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

export default function ArtistSongsPage() {
  const [loading, setLoading] = useState(true)
  const [songs, setSongs] = useState<any[]>([])
  const [artist, setArtist] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      // Fetch artist
      const { data: artistData } = await supabase
        .from('artists')
        .select('*')
        .eq('email', user.email)
        .single()

      if (artistData) {
        setArtist(artistData)

        // Fetch songs
        const { data: songsData } = await supabase
          .from('songs')
          .select('*')
          .eq('artist_id', artistData.id)
          .order('created_at', { ascending: false })

        setSongs(songsData || [])
      }
    } catch (err: any) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this song?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSongs(songs.filter(s => s.id !== id))
    } catch (err: any) {
      console.error('Failed to delete song:', err)
    }
  }

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/artist">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">My Songs</h1>
          </div>
          <p className="text-muted-foreground">Manage your music library</p>
        </div>
        <Link href="/dashboard/artist/songs/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Song
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search your songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Songs Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Songs ({filteredSongs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSongs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No songs found. Create your first song!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Views</th>
                    <th className="text-left p-2">Downloads</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-right p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSongs.map((song: any) => (
                    <tr key={song.id} className="border-b hover:bg-accent">
                      <td className="p-2">
                        <p className="font-medium">{song.title}</p>
                      </td>
                      <td className="p-2">
                        <Badge variant={song.status === 'published' ? 'default' : 'secondary'}>
                          {song.status}
                        </Badge>
                      </td>
                      <td className="p-2">{song.view_count || 0}</td>
                      <td className="p-2">{song.download_count || 0}</td>
                      <td className="p-2 text-sm text-muted-foreground">
                        {new Date(song.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/artist/songs/${song.id}/edit`}>
                            <Button size="sm" variant="outline" className="gap-1">
                              <Edit className="w-3 h-3" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1"
                            onClick={() => handleDelete(song.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
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
