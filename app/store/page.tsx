import Link from 'next/link'
import { Search, Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Product } from '@/types'
import { createClient } from '@/lib/supabase/server'

interface FilterOptions {
  category: string
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'oldest'
  search: string
}

// Real-time Product interface matching ACTUAL database schema
interface RealTimeProduct {
  id: string
  title: string
  slug: string
  description: string
  category: string
  price: number
  currency: string
  demo_url: string | null
  file_url: string
  is_active: boolean
  is_featured: boolean
  view_count: number
  download_count: number
  cover_image: string | null
  created_at: string
  updated_at: string
}

// Server-side data fetching - REAL-TIME ALL PRODUCTS QUERY (ACTUAL SCHEMA)
async function getProducts(category?: string, sortBy: string = 'newest', search?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // Apply filters only if specified
  if (category && category !== '') {
    query = query.eq('category', category)
  }

  if (search && search !== '') {
    query = query.ilike('title', `%${search}%`)
  }

  // Apply sorting
  switch (sortBy) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }

  const { data: products, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  console.log('🛍️ Real-time Products fetched:', products?.length || 0)
  return products || []
}

async function getCategories() {
  const supabase = await createClient()
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('name')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return categories?.map(cat => cat.name) || []
}

export default async function StorePage({
  searchParams
}: {
  searchParams?: { category?: string; sort?: string; search?: string }
}) {
  const category = searchParams?.category || ''
  const sortBy = searchParams?.sort || 'newest'
  const search = searchParams?.search || ''
  
  const [products, categories] = await Promise.all([
    getProducts(category, sortBy, search),
    getCategories()
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="outline" className="mb-6 border-white text-white hover:bg-white/10">
              ← Back to Home
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Music Store</h1>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Discover premium gospel music, merchandise, and exclusive content
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                defaultValue={search}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-4 items-center">
            <select 
              defaultValue={category}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            
            <select 
              defaultValue={sortBy}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground">
              <Search className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: RealTimeProduct) => (
              <div key={product.id} className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-colors">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{product.title}</div>
                    <div className="text-sm text-muted-foreground">{product.category}</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{product.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">
                      ${product.price}
                    </span>
                    <Button size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
