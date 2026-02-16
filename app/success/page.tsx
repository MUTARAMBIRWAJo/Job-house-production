'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Mail, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Order, OrderItem, Product } from '@/types'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const email = searchParams.get('email')

  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`/api/store/orders/${orderId}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data.data.order)
        setItems(data.data.items || [])
        setProducts(data.data.products || [])
      }
    } catch (error) {
      console.error('[v0] Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <>
      {/* Success Message */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-4">Purchase Successful!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for your purchase. Your digital products are ready to download.
        </p>

        {/* Email Confirmation */}
        <div className="bg-muted/50 rounded-lg p-6 mb-8 inline-block w-full max-w-md">
          <div className="flex items-center gap-3 justify-center text-foreground">
            <Mail className="w-5 h-5 text-secondary" />
            <span>
              Confirmation email sent to{' '}
              <span className="font-semibold">{email || 'your email'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary/5 border-b border-border px-6 py-4">
            <p className="text-sm text-muted-foreground">Order ID: {orderId}</p>
            {order && (
              <p className="text-sm text-muted-foreground">
                Date: {new Date(order.created_at).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Products */}
          <div className="divide-y divide-border">
            {products.map((product) => (
              <div key={product.id} className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {product.title.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-secondary">${product.price.toFixed(2)}</p>
                  <Button
                    size="sm"
                    className="mt-2 bg-secondary hover:bg-secondary/90 text-primary"
                    asChild
                  >
                    <Link href={`/my-downloads?email=${encodeURIComponent(email || '')}`}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-primary/5 border-t border-border px-6 py-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-2xl font-bold text-secondary">
                ${order?.amount.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
        <Button
          size="lg"
          asChild
          className="bg-secondary hover:bg-secondary/90 text-primary font-semibold"
        >
          <Link href={`/my-downloads?email=${encodeURIComponent(email || '')}`}>
            <Download className="w-5 h-5 mr-2" />
            Go to My Downloads
          </Link>
        </Button>

        <Button size="lg" variant="outline" asChild>
          <Link href="/store">Continue Shopping</Link>
        </Button>
      </div>
    </>
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
