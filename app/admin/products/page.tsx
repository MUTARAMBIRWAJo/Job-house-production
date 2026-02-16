'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, ToggleRight, ToggleLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Product } from '@/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const filtered = products.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [search, products])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/store/products?limit=100&active_only=false')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.data || [])
      }
    } catch (error) {
      console.error('[v0] Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      // In a real scenario, you'd have a delete API
      setProducts(products.filter((p) => p.id !== productId))
    } catch (error) {
      console.error('[v0] Error deleting product:', error)
    }
  }

  const handleToggleActive = async (product: Product) => {
    try {
      // In a real scenario, you'd have an update API
      const updated = {
        ...product,
        is_active: !product.is_active,
      }
      setProducts(products.map((p) => (p.id === product.id ? updated : p)))
    } catch (error) {
      console.error('[v0] Error updating product:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Products</h1>
              <p className="text-muted-foreground mt-1">Manage your digital products</p>
            </div>
            <Link href="/admin/products/new">
              <Button className="bg-secondary hover:bg-secondary/90 text-primary font-semibold">
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No products found</p>
            <Link href="/admin/products/new">
              <Button>Create First Product</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Product</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Category</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Price</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-right font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-foreground line-clamp-1">{product.title}</p>
                          <p className="text-sm text-muted-foreground">{product.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-secondary">${product.price.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded text-sm font-medium ${product.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(product)}
                          title={product.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {product.is_active ? (
                            <ToggleRight className="w-4 h-4" />
                          ) : (
                            <ToggleLeft className="w-4 h-4" />
                          )}
                        </Button>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-border">
              {filteredProducts.map((product) => (
                <div key={product.id} className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-2">{product.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-secondary">${product.price.toFixed(2)}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${product.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleToggleActive(product)}
                    >
                      {product.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Link href={`/admin/products/${product.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Products</p>
            <p className="text-3xl font-bold text-foreground">{products.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Active Products</p>
            <p className="text-3xl font-bold text-secondary">
              {products.filter((p) => p.is_active).length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Revenue Value</p>
            <p className="text-3xl font-bold text-secondary">
              ${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
