'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function CreateNewsPage() {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    is_featured: false,
    status: 'draft'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
    setFormData(prev => ({ ...prev, slug }))
  }

  const handleCreate = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
      setError('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase
        .from('news')
        .insert({
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (err) throw err
      // Navigate back to news list
      window.location.href = '/dashboard/editor/news'
    } catch (err: any) {
      setError(err.message || 'Failed to create article')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <Link href="/dashboard/editor/news">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create News Article</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error}
        </div>
      )}

      {/* Create Form */}
      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Heading */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Article title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <div className="flex gap-2">
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="article-title"
                />
                <Button onClick={generateSlug} variant="outline" size="sm">
                  Generate
                </Button>
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <Input
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Brief summary of the article..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <Textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Article content..."
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          {/* Status & Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="flex items-end">
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
              {saving ? 'Creating...' : 'Create Article'}
            </Button>
            <Link href="/dashboard/editor/news">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
