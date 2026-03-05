'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ArtistProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [artist, setArtist] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    genre: '',
    social_links: {
      instagram: '',
      facebook: '',
      youtube: '',
      twitter: ''
    }
  })

  useEffect(() => {
    fetchArtistProfile()
  }, [])

  const fetchArtistProfile = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      const { data: artistData } = await supabase
        .from('artists')
        .select('*')
        .eq('email', user.email)
        .single()

      if (artistData) {
        setArtist(artistData)
        setFormData({
          name: artistData.name || '',
          email: artistData.email || '',
          phone: artistData.phone || '',
          bio: artistData.bio || '',
          location: artistData.location || '',
          website: artistData.website || '',
          genre: artistData.genre || '',
          social_links: artistData.social_links || {
            instagram: '',
            facebook: '',
            youtube: '',
            twitter: ''
          }
        })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith('social_')) {
      const socialKey = name.replace('social_', '')
      setFormData(prev => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [socialKey]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase
        .from('artists')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', artist.id)

      if (err) throw err
      setError('')
      alert('Profile updated successfully!')
    } catch (err: any) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <Link href="/dashboard/artist">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Artist Profile</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error}
        </div>
      )}

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Artist name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="artist@example.com"
                disabled
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+250..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          {/* Music Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Genre</label>
              <Input
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="Gospel, Soul, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <Input
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Instagram</label>
                <Input
                  name="social_instagram"
                  value={formData.social_links.instagram}
                  onChange={handleChange}
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Facebook</label>
                <Input
                  name="social_facebook"
                  value={formData.social_links.facebook}
                  onChange={handleChange}
                  placeholder="facebook.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">YouTube</label>
                <Input
                  name="social_youtube"
                  value={formData.social_links.youtube}
                  onChange={handleChange}
                  placeholder="youtube.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Twitter</label>
                <Input
                  name="social_twitter"
                  value={formData.social_links.twitter}
                  onChange={handleChange}
                  placeholder="@username"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 border-t pt-6">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
