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

export default function CreateArtistPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
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
    },
    is_verified: false,
    is_featured: false
  })

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
    setFormData(prev => ({ ...prev, slug }))
  }

  const handleCreate = async () => {
    if (!formData.name || !formData.slug) {
      setError('Please fill in required fields: Name and Slug')
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase
        .from('artists')
        .insert({
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (err) throw err
      router.push('/dashboard/admin/artists')
    } catch (err: any) {
      setError(err.message || 'Failed to create artist')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <Link href="/dashboard/admin/artists">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Artist</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error}
        </div>
      )}

      {/* Create Form */}
      <Card>
        <CardHeader>
          <CardTitle>Artist Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Artist name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <div className="flex gap-2">
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="artist-name"
                />
                <Button onClick={generateSlug} variant="outline" size="sm">
                  Generate
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="artist@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+250..."
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
              placeholder="Artist biography..."
              rows={4}
            />
          </div>

          {/* Location & Genre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Genre</label>
              <Input
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="Gospel, Soul, etc."
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <Input
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://..."
            />
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

          {/* Flags */}
          <div className="border-t pt-6">
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_verified"
                  checked={formData.is_verified}
                  onChange={handleCheckboxChange}
                  className="rounded"
                />
                <span className="text-sm font-medium">Mark as Verified</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleCheckboxChange}
                  className="rounded"
                />
                <span className="text-sm font-medium">Feature on Homepage</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 border-t pt-6">
            <Button
              onClick={handleCreate}
              disabled={saving}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Creating...' : 'Create Artist'}
            </Button>
            <Link href="/dashboard/admin/artists">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
