'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function EditSongPage() {
  const router = useRouter()
  const params = useParams()
  const songId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [song, setSong] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    lyrics: '',
    featured_artist: '',
    language: 'English',
    key_signature: '',
    tempo: '',
    time_signature: '',
    status: 'draft'
  })

  useEffect(() => {
    fetchSong()
  }, [songId])

  const fetchSong = async () => {
    try {
      const supabase = createClient()
      const { data, error: err } = await supabase
        .from('songs')
        .select('*')
        .eq('id', songId)
        .single()

      if (err) throw err
      
      setSong(data)
      setFormData({
        title: data.title || '',
        lyrics: data.lyrics || '',
        featured_artist: data.featured_artist || '',
        language: data.language || 'English',
        key_signature: data.key_signature || '',
        tempo: data.tempo?.toString() || '',
        time_signature: data.time_signature || '',
        status: data.status || 'draft'
      })
    } catch (err: any) {
      setError(err.message || 'Failed to load song')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase
        .from('songs')
        .update({
          ...formData,
          tempo: formData.tempo ? parseInt(formData.tempo) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', songId)

      if (err) throw err
      router.push('/dashboard/admin/songs')
    } catch (err: any) {
      setError(err.message || 'Failed to save song')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <Link href="/dashboard/admin/songs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Song</h1>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Song Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Song title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Featured Artist</label>
              <Input
                name="featured_artist"
                value={formData.featured_artist}
                onChange={handleChange}
                placeholder="Optional featured artist"
              />
            </div>
          </div>

          {/* Lyrics */}
          <div>
            <label className="block text-sm font-medium mb-2">Lyrics</label>
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
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
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
