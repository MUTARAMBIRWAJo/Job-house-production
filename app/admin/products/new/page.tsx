'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const CATEGORIES = [
  'Hymns',
  'Original Compositions',
  'Production Resources',
  'Educational Materials',
  'Digital Resources',
  'Sheet Music & Arrangements',
]

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    category: CATEGORIES[0],
    file_url: '',
    cover_image: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Auto-generate slug from title
    if (name === 'title') {
      setFormData((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, '-'),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/store/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          is_active: true,
        }),
      })

      if (res.ok) {
        router.push('/admin/products?created=true')
      } else {
        alert('Error creating product')
      }
    } catch (error) {
      console.error('[v0] Error:', error)
      alert('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/admin/products" className="flex items-center gap-2 text-secondary hover:text-secondary/80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Create New Product</h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <section className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Product Title</label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter product title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Slug</label>
              <Input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="auto-generated-slug"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Auto-generated from title</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product"
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Price (USD)</label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
          </section>

          {/* Files */}
          <section className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Files</h2>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Cover Image</label>
              <Input
                type="text"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleChange}
                placeholder="/products/image.jpg"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Path to cover image in Supabase storage</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Digital Product File</label>
              <Input
                type="text"
                name="file_url"
                value={formData.file_url}
                onChange={handleChange}
                placeholder="product-file.zip"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Filename in Supabase storage</p>
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="bg-secondary hover:bg-secondary/90 text-primary font-semibold">
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Product'}
            </Button>

            <Link href="/admin/products">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
