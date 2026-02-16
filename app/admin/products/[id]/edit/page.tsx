'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Product } from '@/types'

const CATEGORIES = [
  'Hymns',
  'Original Compositions',
  'Production Resources',
  'Educational Materials',
  'Digital Resources',
  'Sheet Music & Arrangements',
]

export default function EditProductPage() {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Product | null>(null)

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/store/products/id/${id}`)
      if (res.ok) {
        const data = await res.json()
        setFormData(data.data)
      } else {
        router.push('/admin/products')
      }
    } catch (error) {
      console.error('[v0] Error:', error)
      router.push('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return

    const { name, value } = e.target
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value,
          }
        : null
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setSaving(true)

    try {
      const res = await fetch(`/api/store/products/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/products?updated=true')
      } else {
        alert('Error updating product')
      }
    } catch (error) {
      console.error('[v0] Error:', error)
      alert('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Product not found</p>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
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
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">Cannot be changed</p>
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

          {/* Status */}
          <section className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Status</h2>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData((prev) => (prev ? { ...prev, is_active: e.target.checked } : null))
                  }
                  className="rounded border-border"
                />
                <span className="font-medium text-foreground">Product is active and visible in store</span>
              </label>
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={saving} className="bg-secondary hover:bg-secondary/90 text-primary font-semibold">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
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
