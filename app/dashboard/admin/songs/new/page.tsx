'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function CreateSongPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [artists, setArtists] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    lyrics: '',
    artist_id: '',
    featured_artist: '',
    language: 'English',
    key_signature: '',
    tempo: '',
    time_signature: '',
    status: 'draft'
  })

  useEffect(() => {
    fetchArtists()
  }, [])

  const fetchArtists = async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('artists')
        .select('id, name')
        .order('name')

      setArtists(data || [])
    } catch (err: any) {
      console.error('Failed to fetch artists:', err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreate = async () => {
    if (!formData.title || !formData.artist_id || !formData.lyrics) {
      setError('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase
        .from('songs')
        .insert({
          ...formData,
          tempo: formData.tempo ? parseInt(formData.tempo) : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (err) throw err
      router.push('/dashboard/admin/songs')
    } catch (err: any) {
      setError(err.message || 'Failed to create song')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <Link href="/dashboard/admin/songs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Song</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error}
        </div>
      )}

      {/* Create Form */}
      <Card>
        <CardHeader>
          <CardTitle>Song Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Song title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Artist *</label>
              <select
                name="artist_id"
                value={formData.artist_id}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select an artist</option>
                {artists.map(artist => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lyrics */}
          <div>
            <label className="block text-sm font-medium mb-2">Lyrics *</label>
            <Textarea
              name="lyrics"
              value={formData.lyrics}
              onChange={handleChange}
              placeholder="Song lyrics..."
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          {/* Music Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option>English</option>
                <option>Kinyarwanda</option>
                <option>French</option>
                <option>Swahili</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Key Signature</label>
              <Input
                name="key_signature"
                value={formData.key_signature}
                onChange={handleChange}
                placeholder="C, G, D, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tempo (BPM)</label>
              <Input
                name="tempo"
                type="number"
                value={formData.tempo}
                onChange={handleChange}
                placeholder="120"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Time Signature</label>
              <Input
                name="time_signature"
                value={formData.time_signature}
                onChange={handleChange}
                placeholder="4/4"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleCreate}
              disabled={saving}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Creating...' : 'Create Song'}
            </Button>
            <Link href="/dashboard/admin/songs">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
