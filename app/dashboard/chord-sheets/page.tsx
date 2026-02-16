'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Music, Edit, Trash2, FileText, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { ChordSheet, Profile, Song } from '@/lib/types'

export default function ChordSheetsPage() {
  const [user, setUser] = useState<Profile | null>(null)
  const [chordSheets, setChordSheets] = useState<ChordSheet[]>([])
  const [songs, setSongs] = useState<{id: string, title: string, slug: string}[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSheet, setSelectedSheet] = useState<ChordSheet | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [formData, setFormData] = useState<{
    title: string,
    song_id?: string,
    key_signature: string,
    tempo: number,
    time_signature: string,
    difficulty_level: 'beginner' | 'intermediate' | 'advanced',
    chord_progression: any[]
  }>({
    title: '',
    key_signature: 'C',
    tempo: 120,
    time_signature: '4/4',
    difficulty_level: 'beginner',
    chord_progression: []
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchUserAndChordSheets()
  }, [])

  const fetchUserAndChordSheets = async () => {
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
          await Promise.all([
            fetchChordSheets(profile.id, profile.role),
            fetchSongs()
          ])
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchChordSheets = async (userId: string, role: string) => {
    try {
      const supabase = createClient()
      let query = supabase
        .from('chord_sheets')
        .select(`
          *,
          songs: song_id (
            id, 
            title, 
            slug,
            artist: artists (
              name
            )
          )
        `)
      
      if (role === 'artist') {
        query = query.eq('created_by', userId)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching chord sheets:', error)
      } else {
        setChordSheets(data || [])
      }
    } catch (error) {
      console.error('Error fetching chord sheets:', error)
    }
  }

  const fetchSongs = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('songs')
        .select('id, title, slug')
        .order('title', { ascending: true })
      
      if (error) {
        console.error('Error fetching songs:', error)
      } else {
        setSongs(data || [])
      }
    } catch (error) {
      console.error('Error fetching songs:', error)
    }
  }

  const handleCreateChordSheet = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) return

      const { data, error } = await supabase
        .from('chord_sheets')
        .insert({
          ...formData,
          created_by: authUser.id,
          slug: formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating chord sheet:', error)
        alert('Failed to create chord sheet. Please try again.')
      } else {
        setChordSheets(prev => [data, ...prev])
        setShowCreateDialog(false)
        resetForm()
        alert('Chord sheet created successfully!')
      }
    } catch (error) {
      console.error('Error creating chord sheet:', error)
      alert('Failed to create chord sheet. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditChordSheet = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSheet) return

    setSubmitting(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('chord_sheets')
        .update({
          title: formData.title,
          key_signature: formData.key_signature,
          tempo: formData.tempo,
          time_signature: formData.time_signature,
          difficulty_level: formData.difficulty_level,
          chord_progression: formData.chord_progression
        })
        .eq('id', selectedSheet.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating chord sheet:', error)
        alert('Failed to update chord sheet. Please try again.')
      } else {
        setChordSheets(prev => prev.map(sheet => 
          sheet.id === selectedSheet.id ? { ...sheet, ...data } : sheet
        ))
        setShowEditDialog(false)
        setSelectedSheet(null)
        alert('Chord sheet updated successfully!')
      }
    } catch (error) {
      console.error('Error updating chord sheet:', error)
      alert('Failed to update chord sheet. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteChordSheet = async (sheetId: string) => {
    if (!confirm('Are you sure you want to delete this chord sheet?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('chord_sheets')
        .delete()
        .eq('id', sheetId)

      if (error) {
        console.error('Error deleting chord sheet:', error)
        alert('Failed to delete chord sheet. Please try again.')
      } else {
        setChordSheets(prev => prev.filter(sheet => sheet.id !== sheetId))
        alert('Chord sheet deleted successfully!')
      }
    } catch (error) {
      console.error('Error deleting chord sheet:', error)
      alert('Failed to delete chord sheet. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      song_id: undefined,
      key_signature: 'C',
      tempo: 120,
      time_signature: '4/4',
      difficulty_level: 'beginner',
      chord_progression: []
    })
  }

  const openEditDialog = (sheet: ChordSheet) => {
    setSelectedSheet(sheet)
    setFormData({
      title: sheet.title,
      key_signature: sheet.key_signature || 'C',
      tempo: sheet.tempo || 120,
      time_signature: sheet.time_signature || '4/4',
      difficulty_level: sheet.difficulty_level || 'beginner',
      chord_progression: sheet.chord_progression || []
    })
    setShowEditDialog(true)
  }

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      chord_progression: [...prev.chord_progression, {
        title: '',
        chords: [
          { chord: 'C', position: 0 },
          { chord: 'G', position: 4 }
        ]
      }]
    }))
  }

  const updateSection = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      chord_progression: prev.chord_progression.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }))
  }

  const removeSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      chord_progression: prev.chord_progression.filter((_, i) => i !== index)
    }))
  }

  const filteredSheets = chordSheets.filter(sheet =>
    sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sheet.song?.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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
          <p className="text-muted-foreground">You don't have permission to manage chord sheets.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Chord Sheets</h1>
          <p className="text-muted-foreground">Manage chord progressions for your songs</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Chord Sheet
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Chord Sheet</DialogTitle>
              <DialogDescription>
                Add chord progressions for a song
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateChordSheet} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter chord sheet title"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Song</label>
                  <Select value={formData.song_id} onValueChange={(value) => setFormData(prev => ({ ...prev, song_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a song" />
                    </SelectTrigger>
                    <SelectContent>
                      {songs.map((song) => (
                        <SelectItem key={song.id} value={song.id}>
                          {song.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Key Signature</label>
                  <Select value={formData.key_signature} onValueChange={(value) => setFormData(prev => ({ ...prev, key_signature: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((key) => (
                        <SelectItem key={key} value={key}>
                          {key} Major
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Tempo (BPM)</label>
                  <Input
                    type="number"
                    value={formData.tempo}
                    onChange={(e) => setFormData(prev => ({ ...prev, tempo: parseInt(e.target.value) || 120 }))}
                    placeholder="120"
                    min="40"
                    max="200"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Time Signature</label>
                  <Select value={formData.time_signature} onValueChange={(value) => setFormData(prev => ({ ...prev, time_signature: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4/4">4/4</SelectItem>
                      <SelectItem value="3/4">3/4</SelectItem>
                      <SelectItem value="6/8">6/8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Difficulty</label>
                <Select value={formData.difficulty_level} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty_level: value as 'beginner' | 'intermediate' | 'advanced' }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              
              {/* Sections */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Chord Sections</label>
                  <Button type="button" size="sm" onClick={addSection}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Section
                  </Button>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {formData.chord_progression.map((section: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <Input
                          placeholder="Section title (e.g., Verse, Chorus)"
                          value={section.title}
                          onChange={(e) => updateSection(index, 'title', e.target.value)}
                          className="flex-1 mr-2"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => removeSection(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <Textarea
                        placeholder="Chord progression (e.g., C - G - Am - F)"
                        value={section.chords.map((c: any, chordIndex: number) => c.chord).join(' - ')}
                        onChange={(e) => updateSection(index, 'chords', e.target.value.split(' - ').map((chord: string, position: number) => ({ chord, position })))}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Chord Sheet'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Chord Sheet</DialogTitle>
              <DialogDescription>
                Update chord progressions
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleEditChordSheet} className="space-y-4">
              {/* Same form fields as create dialog */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter chord sheet title"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Song</label>
                  <Select value={formData.song_id} onValueChange={(value) => setFormData(prev => ({ ...prev, song_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a song" />
                    </SelectTrigger>
                    <SelectContent>
                      {songs.map((song) => (
                        <SelectItem key={song.id} value={song.id}>
                          {song.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Key Signature</label>
                  <Select value={formData.key_signature} onValueChange={(value) => setFormData(prev => ({ ...prev, key_signature: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((key) => (
                        <SelectItem key={key} value={key}>
                          {key} Major
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Tempo (BPM)</label>
                  <Input
                    type="number"
                    value={formData.tempo}
                    onChange={(e) => setFormData(prev => ({ ...prev, tempo: parseInt(e.target.value) || 120 }))}
                    placeholder="120"
                    min="40"
                    max="200"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Time Signature</label>
                  <Select value={formData.time_signature} onValueChange={(value) => setFormData(prev => ({ ...prev, time_signature: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4/4">4/4</SelectItem>
                      <SelectItem value="3/4">3/4</SelectItem>
                      <SelectItem value="6/8">6/8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Difficulty</label>
                <Select value={formData.difficulty_level} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty_level: value as 'beginner' | 'intermediate' | 'advanced' }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update Chord Sheet'}
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
            placeholder="Search chord sheets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Badge variant="secondary" className="px-3 py-1">
          {filteredSheets.length} chord sheets
        </Badge>
      </div>

      {/* Chord Sheets Grid */}
      {filteredSheets.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-muted/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? 'No chord sheets found' : 'No chord sheets yet'}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? 'Try adjusting your search terms' 
              : 'Create your first chord sheet to get started'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSheets.map((sheet) => (
            <Card key={sheet.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2">{sheet.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      {sheet.song && (
                        <Badge variant="outline" className="text-xs">
                          {sheet.song.title}
                        </Badge>
                      )}
                      <Badge className={getDifficultyColor(sheet.difficulty_level || 'beginner')}>
                        {sheet.difficulty_level || 'Beginner'}
                      </Badge>
                    </CardDescription>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(sheet)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteChordSheet(sheet.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Music className="w-3 h-3" />
                      {sheet.key_signature} Major
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {sheet.tempo} BPM
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {sheet.chord_progression?.length || 0} sections
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Created {new Date(sheet.created_at).toLocaleDateString()}
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
