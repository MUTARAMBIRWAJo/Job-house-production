import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow hover:border-secondary overflow-hidden">
      <Link href={`/store/${product.slug}`}>
        <CardHeader className="p-0">
          <div className="h-48 bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-secondary/30" />
            </div>
          </div>
        </CardHeader>
      </Link>

      <CardContent className="p-4">
        <Link href={`/store/${product.slug}`}>
          <div className="mb-3">
            <h3 className="font-semibold text-foreground line-clamp-2 hover:text-secondary transition-colors">
              {product.title}
            </h3>
            <p className="text-xs text-secondary font-medium mt-1">{product.category}</p>
          </div>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-secondary">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">{product.currency}</p>
          </div>

          <Link href={`/store/${product.slug}`}>
            <Button className="bg-secondary hover:bg-secondary/90 text-primary font-semibold" size="sm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
