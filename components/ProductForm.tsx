import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Product } from '@/types'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface ProductFormProps {
  product?: Product
  isLoading?: boolean
}

export default function ProductForm({ product, isLoading = false }: ProductFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: product?.title || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || '',
    file_url: product?.file_url || '',
    cover_image: product?.cover_image || '',
    is_active: product?.is_active || true,
  })

  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus({ type: null, message: '' })

    try {
      const method = product ? 'PATCH' : 'POST'
      const url = product
        ? `/api/store/products/${product.id}`
        : '/api/store/products/create'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save product')
      }

      setStatus({
        type: 'success',
        message: product ? 'Product updated successfully' : 'Product created successfully',
      })

      setTimeout(() => {
        router.push('/admin/products')
      }, 1500)
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status.type && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            status.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{status.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Product Title</label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Gospel Hymn Collection"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Product Slug</label>
          <Input
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="gospel-hymn-collection"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Description</label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed product description"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Price (USD)</label>
          <Input
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="9.99"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            required
          >
            <option value="">Select a category</option>
            <option value="Hymns">Hymns</option>
            <option value="Original Compositions">Original Compositions</option>
            <option value="Production Resources">Production Resources</option>
            <option value="Educational Materials">Educational Materials</option>
            <option value="Digital Resources">Digital Resources</option>
            <option value="Sheet Music & Arrangements">Sheet Music & Arrangements</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <div className="flex items-center h-10 border border-border rounded-lg px-4">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className="ml-2 text-sm text-foreground">{formData.is_active ? 'Active' : 'Inactive'}</label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Cover Image URL</label>
          <Input
            name="cover_image"
            value={formData.cover_image}
            onChange={handleChange}
            placeholder="/products/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">File URL</label>
          <Input
            name="file_url"
            value={formData.file_url}
            onChange={handleChange}
            placeholder="product-file.zip"
            required
          />
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <Button
          type="submit"
          disabled={submitting || isLoading}
          className="bg-secondary hover:bg-secondary/90 text-primary font-semibold"
        >
          {submitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
