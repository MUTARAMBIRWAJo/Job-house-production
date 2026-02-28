import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ShoppingCart, Share2 } from 'lucide-react'
import Image from 'next/image'

interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  status: string
  created_at: string
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error || !data) return null
  return data as Product
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  
  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image_url ? [product.image_url] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="pt-4">
        <Link href="/store" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>
      </div>

      {/* Product Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          {product.image_url ? (
            <div className="relative w-full h-96 md:h-full min-h-96">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-24 h-24 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-6 flex flex-col justify-start">
          <div>
            <div className="text-sm text-secondary font-semibold mb-2">
              {product.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {product.name}
            </h1>
            <div className="text-3xl font-bold text-secondary">
              ${product.price.toFixed(2)}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Description</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Link href={`/checkout?product=${product.id}`}>
              <Button className="bg-secondary hover:bg-secondary/90 gap-2">
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>
            </Link>
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Related Products</h2>
          <p className="text-muted-foreground">Check out similar items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Placeholder for related products */}
          <div className="text-center py-12">
            <p className="text-muted-foreground">More products coming soon</p>
          </div>
        </div>
      </section>
    </div>
  )
}
