'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Product } from '@/types'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')

  const [product, setProduct] = useState<Product | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      // In a real scenario, we would fetch the product by ID
      // For now, we'll simulate fetching from mock data
      const res = await fetch(`/api/store/products/id/${productId}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data.data)
      }
    } catch (error) {
      console.error('[v0] Error fetching product:', error)
      setError('Product not found')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setError('')

    try {
      if (!product || !email) {
        setError('Please enter your email address')
        setProcessing(false)
        return
      }

      // Create checkout session
      const res = await fetch('/api/store/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          email,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/checkout?productId=${product.id}`,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to create checkout session')
      }

      const data = await res.json()
      router.push(data.url)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Checkout failed. Please try again.'
      setError(message)
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-muted-foreground mb-4">Product not found</p>
        <Link href="/store">
          <Button>Back to Store</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/store" className="flex items-center gap-2 text-secondary hover:text-secondary/80">
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Checkout</h2>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">We'll send your download link and receipt here</p>
              </div>

              {/* Security Notice */}
              <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-3">
                <Lock className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-foreground">
                  <p className="font-semibold mb-1">Secure & Private</p>
                  <p>All transactions are secure and encrypted. Your data will never be shared.</p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={processing}
                className="w-full bg-secondary hover:bg-secondary/90 text-primary font-semibold py-3 text-lg"
              >
                {processing ? 'Processing...' : 'Continue to Payment'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By clicking continue, you agree to our terms and privacy policy
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-muted/50 rounded-lg p-6 sticky top-6">
              <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>

              {/* Product */}
              <div className="border-b border-border pb-4 mb-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-primary rounded flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {product.title.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground line-clamp-2">{product.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-foreground">
                  <span>Subtotal</span>
                  <span>${product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-foreground">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-secondary">${product.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Features */}
              <div className="mt-6 pt-6 border-t border-border space-y-2">
                <p className="text-xs font-semibold text-foreground">What you get:</p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li>Instant digital download</li>
                  <li>Lifetime access</li>
                  <li>Download link via email</li>
                  <li>No DRM restrictions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        <CheckoutContent />
      </Suspense>
    </div>
  )
}
