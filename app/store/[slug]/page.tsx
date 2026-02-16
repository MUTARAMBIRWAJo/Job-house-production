'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Share2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'

export default function ProductPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/store/products/${slug}`)

      if (res.ok) {
        const data = await res.json()
        setProduct(data.data)
        if (data.data?.id) {
          fetchRelatedProducts(data.data.id)
        }
      } else {
        router.push('/store')
      }
    } catch (error) {
      console.error('[v0] Error fetching product:', error)
      router.push('/store')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (productId: string) => {
    try {
      const res = await fetch(`/api/store/products/related/${productId}`)
      if (res.ok) {
        const data = await res.json()
        setRelatedProducts(data.data || [])
      }
    } catch (error) {
      console.error('[v0] Error fetching related products:', error)
    }
  }

  const handleCheckout = () => {
    if (product) {
      router.push(`/checkout?productId=${product.id}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full animate-pulse" />
          <p className="mt-4 text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Product not found</p>
          <Link href="/store">
            <Button className="mt-4">Back to Store</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/store" className="flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center text-white text-6xl font-bold">
              {product.title.charAt(0)}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-sm font-semibold rounded">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{product.title}</h1>
              <p className="text-xl text-muted-foreground">{product.description}</p>
            </div>

            {/* Pricing */}
            <div className="border-t border-b border-border py-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-secondary">${product.price.toFixed(2)}</span>
                <span className="text-lg text-muted-foreground">{product.currency}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full bg-secondary hover:bg-secondary/90 text-primary font-semibold text-lg py-6"
                onClick={handleCheckout}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Buy Now
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" size="lg" className="flex-1">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <h3 className="font-semibold text-foreground">What's Included:</h3>
              <ul className="space-y-2 text-foreground">
                <li className="flex items-start gap-2">
                  <Download className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Instant digital download</span>
                </li>
                <li className="flex items-start gap-2">
                  <Download className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Lifetime access to your purchase</span>
                </li>
                <li className="flex items-start gap-2">
                  <Download className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>No DRM restrictions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Download className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Download to your device</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link key={related.id} href={`/store/${related.slug}`}>
                  <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-secondary hover:shadow-lg transition-all cursor-pointer">
                    <div className="h-40 bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold">
                      {related.title.charAt(0)}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{related.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-secondary">${related.price.toFixed(2)}</span>
                        <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-primary">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
