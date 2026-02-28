import { redirect } from 'next/navigation'

export default function ProductsPage() {
  redirect('/store')
  return null
}


          {/* Search */}
          <form action="/products" method="get" className="flex gap-2 max-w-md">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                name="q"
                placeholder="Search products..."
                className="pl-10 py-3 rounded-lg"
                defaultValue={searchTerm || ''}
              />
            </div>
            <Button type="submit" className="bg-secondary hover:bg-secondary/90">
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Products Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {searchTerm ? `Search Results for "${searchTerm}"` : 'All Products'}
          </h2>
          <p className="text-muted-foreground">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? 'No products found matching your search.'
                : 'No products available yet.'}
            </p>
            {searchTerm && (
              <Link href="/products">
                <Button variant="outline">Clear Search</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <div className="group cursor-pointer h-full">
                  <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-secondary transition-colors">
                      {product.name}
                    </h3>
                    {product.category && (
                      <p className="text-xs text-secondary">{product.category}</p>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-lg font-bold text-secondary">
                        ${product.price.toFixed(2)}
                      </span>
                      <Button size="sm" variant="outline">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
