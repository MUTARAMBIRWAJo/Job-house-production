'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Order, OrderItem, Product } from '@/lib/types'

function DownloadsContent() {
  const router = useRouter()

  const [orders, setOrders] = useState<Order[]>([])
  const [items, setItems] = useState<OrderItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Check if user is logged in via API
      const res = await fetch('/api/auth/me')

      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          setIsAuthenticated(true)
          fetchOrders()
        } else {
          setIsAuthenticated(false)
          setLoading(false)
        }
      } else {
        setIsAuthenticated(false)
        setLoading(false)
      }
    } catch (error) {
      console.error('[v0] Auth check error:', error)
      setIsAuthenticated(false)
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      // Now the API gets orders by authenticated user, not by email param
      const res = await fetch('/api/store/orders')

      if (res.ok) {
        const data = await res.json()
        setOrders(data.data.orders || [])
        setItems(data.data.items || [])
        setProducts(data.data.products || [])
      }
    } catch (error) {
      console.error('[v0] Error fetching downloads:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProductForItem = (item: OrderItem): Product | undefined => {
    // First check if product is already loaded on the item
    if (item.product) return item.product
    // Fallback to products array
    return products.find((p) => p.id === item.product_id)
  }

  const getOrderItems = (orderId: string) => {
    return items.filter((i) => i.order_id === orderId)
  }

  const handleDownload = async (product: Product) => {
    try {
      // Call the download API to get a signed URL
      const res = await fetch(`/api/store/download/${encodeURIComponent(product.file_path || product.file_url)}`)

      if (res.ok) {
        const data = await res.json()
        if (data.success && data.downloadUrl) {
          // Open the signed URL in a new window
          window.open(data.downloadUrl, '_blank')
        } else {
          alert(data.error || 'Download failed')
        }
      } else {
        const data = await res.json()
        alert(data.error || 'Download failed')
      }
    } catch (error) {
      console.error('[v0] Download error:', error)
      alert('Download failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/store" className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
            <h1 className="text-4xl font-bold">My Downloads</h1>
            <p className="text-lg text-gray-100 mt-2">Access your purchased digital products</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-card border border-border rounded-lg p-8 max-w-md mx-auto text-center">
            <Lock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to access your downloads.
            </p>
            <div className="space-y-3">
              <Button
                asChild
                className="w-full bg-secondary hover:bg-secondary/90 text-primary font-semibold"
              >
                <Link href="/login?redirect=/my-downloads">Login to Access Downloads</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full"
              >
                <Link href="/register?redirect=/my-downloads">Create an Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/store" className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>
          <h1 className="text-4xl font-bold">My Downloads</h1>
          <p className="text-lg text-gray-100 mt-2">Access your purchased digital products</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              You haven't purchased any products yet.
            </p>
            <Link href="/store">
              <Button>Browse Store</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Found {orders.length} order(s) with {products.length} product(s)
            </p>

            {/* Orders */}
            {orders.map((order) => {
              const orderItems = getOrderItems(order.id)
              const orderProducts = orderItems
                .map((item) => getProductForItem(item))
                .filter(Boolean) as Product[]

              return (
                <div key={order.id} className="bg-card border border-border rounded-lg overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-primary/5 border-b border-border px-6 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground">Order ID</p>
                        <p className="font-semibold text-foreground">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-semibold text-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-semibold text-secondary">${order.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="divide-y divide-border">
                    {orderProducts.map((product) => (
                      <div key={product.id} className="p-6 flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary rounded flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {product.title.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{product.title}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <Button
                          onClick={() => handleDownload(product)}
                          className="bg-secondary hover:bg-secondary/90 text-primary font-semibold"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MyDownloadsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    }>
      <DownloadsContent />
    </Suspense>
  )
}
