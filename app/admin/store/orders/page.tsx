import Link from 'next/link'
import { ArrowLeft, Eye, Download, DollarSign, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AdminOrdersPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/store">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Store Orders</h1>
          <p className="text-muted-foreground mt-2">Manage customer orders and transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-card rounded-xl border border-border p-6 hover:border-secondary transition-colors">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-semibold text-foreground">Order #1001</h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
              Paid
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">user@example.com</p>
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold text-secondary">$9.99</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items:</span>
              <span className="font-semibold">1</span>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              Feb 10, 2024
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 hover:border-secondary transition-colors">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-semibold text-foreground">Order #1002</h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
              Paid
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">john@example.com</p>
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold text-secondary">$44.98</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items:</span>
              <span className="font-semibold">2</span>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              Feb 12, 2024
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 hover:border-secondary transition-colors">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-semibold text-foreground">Order #1003</h3>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
              Pending
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">info@example.com</p>
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold text-secondary">$19.99</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items:</span>
              <span className="font-semibold">1</span>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              Feb 18, 2024
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Export Orders</h2>
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export as CSV
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export as PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
