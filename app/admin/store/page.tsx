import { Suspense } from 'react'
import Link from 'next/link'
import { Package, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getStoreStats } from '@/lib/server/db-actions'

function StatCard({ icon: Icon, label, value, subtext }: {
  icon: React.ComponentType<{ className: string }>
  label: string
  value: string | number
  subtext?: string
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 hover:border-secondary transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          {subtext && <p className="text-xs text-muted-foreground mt-2">{subtext}</p>}
        </div>
        <div className="bg-secondary/10 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-secondary" />
        </div>
      </div>
    </div>
  )
}

async function StoreStatsContent() {
  const stats = await getStoreStats()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={Package}
        label="Active Products"
        value={stats.active_products}
        subtext={`of ${stats.total_products} total`}
      />
      <StatCard
        icon={ShoppingBag}
        label="Total Orders"
        value={stats.total_orders}
        subtext="Paid transactions"
      />
      <StatCard
        icon={DollarSign}
        label="Total Revenue"
        value={`$${stats.total_revenue.toFixed(2)}`}
        subtext="From all sales"
      />
      <StatCard
        icon={TrendingUp}
        label="Avg Order Value"
        value={`$${(stats.total_orders > 0 ? stats.total_revenue / stats.total_orders : 0).toFixed(2)}`}
        subtext="Revenue per order"
      />
    </div>
  )
}

export default async function AdminStorePage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Store Analytics</h1>
          <p className="text-muted-foreground mt-2">Digital Worship Store Performance</p>
        </div>
        <Link href="/admin/products">
          <Button className="bg-secondary hover:bg-secondary/90 text-primary font-semibold">
            Manage Products
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div className="text-center py-12 text-muted-foreground">Loading analytics...</div>}>
        <StoreStatsContent />
      </Suspense>

      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/products/new">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              Add New Product
            </Button>
          </Link>
          <Link href="/store">
            <Button variant="outline" className="w-full">
              View Store
            </Button>
          </Link>
          <Link href="/admin/store/orders">
            <Button variant="outline" className="w-full">
              View Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
