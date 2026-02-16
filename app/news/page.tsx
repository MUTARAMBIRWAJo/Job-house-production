import Link from 'next/link'
import { ArrowLeft, Calendar, Newspaper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { NewsArticle } from '@/types'

// Server-side data fetching - REAL-TIME ALL NEWS QUERY (ACTUAL SCHEMA)
async function getNews(category?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('news')
    .select(`
      id,
      title,
      slug,
      content,
      excerpt,
      category,
      featured,
      featured_image,
      published_date,
      created_at,
      updated_at
    `)
    .order('created_at', { ascending: false })

  // Apply category filter only if specified
  if (category && category !== 'All' && category !== '') {
    query = query.eq('category', category)
  }

  const { data: news, error } = await query

  if (error) {
    console.error('Error fetching news:', error)
    return []
  }

  console.log('📰 Raw news:', news)
  console.log('📰 Real-time News fetched:', news?.length || 0)
  return news || []
}

export default async function NewsPage({
  searchParams
}: {
  searchParams?: { category?: string }
}) {
  const category = searchParams?.category || ''
  
  const news = await getNews(category)

  console.log('News page - Articles fetched:', news.length, 'category:', category)

  const categories = ['All', 'Events', 'News', 'Industry', 'Features', 'Interviews']

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest News</h1>
            <p className="text-lg text-muted-foreground">
              Stay updated with the latest gospel music news, events, and industry updates
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? 'default' : 'outline'}
              onClick={() => {
                const params = new URLSearchParams(searchParams?.toString())
                if (cat === 'All') {
                  params.delete('category')
                } else {
                  params.set('category', cat)
                }
                window.location.href = `/news?${params.toString()}`
              }}
              className="rounded-full"
            >
              {cat}
            </Button>
          ))}
        </div>
      </section>

      {/* News Articles */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No news articles found</h3>
              <p className="text-muted-foreground">
                {category ? `No articles found in the "${category}" category.` : 'No news articles available yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((article: any) => (
                <article key={article.id} className="group">
                  <Link href={`/news/${article.id}`} className="block">
                    <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-colors">
                      <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <Newspaper className="w-16 h-16 text-primary/30" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-primary font-semibold mb-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(article.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {article.category || 'News'}
                          </span>
                          <span className="text-sm text-primary font-semibold hover:underline">
                            Read More →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
