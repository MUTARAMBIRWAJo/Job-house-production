'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Music, Edit, Trash2, Eye, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { Song, Profile } from '@/lib/types'

export default function SongsPage() {
  const [user, setUser] = useState<Profile | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    lyrics: '',
    language: 'kinyarwanda',
    genre: 'gospel'
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchUserAndSongs()
  }, [])

  const fetchUserAndSongs = async () => {
    try {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()
        
        setUser(profile)
        
        if (profile?.role === 'artist' || profile?.role === 'admin') {
          await fetchSongs(profile.id, profile.role)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSongs = async (userId: string, role: string) => {
    try {
      const supabase = createClient()
      let query = supabase.from('songs').select('*')
      
      if (role === 'artist') {
        query = query.eq('created_by', userId)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching songs:', error)
      } else {
        setSongs(data || [])
      }
    } catch (error) {
      console.error('Error fetching songs:', error)
    }
  }

  const handleCreateSong = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) return

      const { data, error } = await supabase
        .from('songs')
        .insert({
          ...formData,
          created_by: authUser.id,
          slug: formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
          view_count: 0
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating song:', error)
        alert('Failed to create song. Please try again.')
      } else {
        setSongs(prev => [data, ...prev])
        setShowCreateDialog(false)
        setFormData({ title: '', lyrics: '', language: 'kinyarwanda', genre: 'gospel' })
        alert('Song created successfully!')
      }
    } catch (error) {
      console.error('Error creating song:', error)
      alert('Failed to create song. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditSong = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSong) return

    setSubmitting(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('songs')
        .update({
          title: formData.title,
          lyrics: formData.lyrics,
          language: formData.language,
          genre: formData.genre
        })
        .eq('id', selectedSong.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating song:', error)
        alert('Failed to update song. Please try again.')
      } else {
        setSongs(prev => prev.map(song => 
          song.id === selectedSong.id ? { ...song, ...data } : song
        ))
        setShowEditDialog(false)
        setSelectedSong(null)
        alert('Song updated successfully!')
      }
    } catch (error) {
      console.error('Error updating song:', error)
      alert('Failed to update song. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSong = async (songId: string) => {
    if (!confirm('Are you sure you want to delete this song?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', songId)

      if (error) {
        console.error('Error deleting song:', error)
        alert('Failed to delete song. Please try again.')
      } else {
        setSongs(prev => prev.filter(song => song.id !== songId))
        alert('Song deleted successfully!')
      }
    } catch (error) {
      console.error('Error deleting song:', error)
      alert('Failed to delete song. Please try again.')
    }
  }

  const openEditDialog = (song: Song) => {
    setSelectedSong(song)
    setFormData({
      title: song.title,
      lyrics: song.lyrics || '',
      language: song.language || 'kinyarwanda',
      genre: song.genre || 'gospel'
    })
    setShowEditDialog(true)
  }

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.lyrics?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || (user.role !== 'artist' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to manage songs.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Songs</h1>
          <p className="text-muted-foreground">Manage your gospel songs and lyrics</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Song
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Song</DialogTitle>
              <DialogDescription>
                Add a new gospel song to your collection
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateSong} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter song title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Lyrics *</label>
                <Textarea
                  required
                  value={formData.lyrics}
                  onChange={(e) => setFormData(prev => ({ ...prev, lyrics: e.target.value }))}
                  placeholder="Enter song lyrics"
                  rows={8}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Language</label>
                  <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kinyarwanda">Kinyarwanda</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="swahili">Swahili</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Genre</label>
                  <Select value={formData.genre} onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gospel">Gospel</SelectItem>
                      <SelectItem value="worship">Worship</SelectItem>
                      <SelectItem value="praise">Praise</SelectItem>
                      <SelectItem value="contemporary">Contemporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Song'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Song</DialogTitle>
              <DialogDescription>
                Update your song details
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleEditSong} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter song title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Lyrics *</label>
                <Textarea
                  required
                  value={formData.lyrics}
                  onChange={(e) => setFormData(prev => ({ ...prev, lyrics: e.target.value }))}
                  placeholder="Enter song lyrics"
                  rows={8}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Language</label>
                  <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kinyarwanda">Kinyarwanda</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="swahili">Swahili</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Genre</label>
                  <Select value={formData.genre} onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gospel">Gospel</SelectItem>
                      <SelectItem value="worship">Worship</SelectItem>
                      <SelectItem value="praise">Praise</SelectItem>
                      <SelectItem value="contemporary">Contemporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update Song'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Badge variant="secondary" className="px-3 py-1">
          {filteredSongs.length} songs
        </Badge>
      </div>

      {/* Songs Grid */}
      {filteredSongs.length === 0 ? (
        <div className="text-center py-12">
          <Music className="w-16 h-16 mx-auto text-muted/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? 'No songs found' : 'No songs yet'}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? 'Try adjusting your search terms' 
              : 'Create your first song to get started'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSongs.map((song) => (
            <Card key={song.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2">{song.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {song.language}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {song.genre}
                      </Badge>
                    </CardDescription>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(song)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteSong(song.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {song.lyrics?.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {song.view_count || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {new Date(song.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
