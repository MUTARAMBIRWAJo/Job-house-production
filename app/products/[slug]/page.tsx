import { redirect } from 'next/navigation'

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  redirect(`/store/${params.slug}`)
  return null
}

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
