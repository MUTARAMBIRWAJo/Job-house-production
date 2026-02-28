'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NewsArticle } from '@/types'

export default function NewsDetailPage() {
  const params = useParams()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/news/slug/${params.slug}`)

        if (!res.ok) {
          throw new Error('Failed to fetch article')
        }

        const data = await res.json()
        setArticle(data.data)
      } catch (err) {
        console.error('[v0] Error fetching article:', err)
        setError('Failed to load article')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchArticle()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-96 bg-muted rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Article Not Found</h1>
          <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
          <Link href="/news">
            <Button variant="outline">Back to News</Button>
          </Link>
        </div>
      </div>
    )
  }

  const publishDate = article.published_date 
    ? new Date(article.published_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not published'

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Button */}
        <Link href="/news">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Button>
        </Link>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4 text-secondary" />
            <span className="text-sm font-semibold text-secondary uppercase">
              {article.category}
            </span>
          </div>
          <h1 className="text-5xl font-bold text-foreground leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time>{publishDate}</time>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="w-full h-96 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center border border-border">
          <div className="text-center text-white/50">
            <Tag className="w-16 h-16 mx-auto opacity-30" />
            <p className="mt-2">Featured Image</p>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none text-muted-foreground space-y-6 leading-relaxed">
          <div className="text-lg font-semibold text-foreground">
            {article.excerpt}
          </div>

          {article.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </article>

        {/* Related Articles */}
        <div className="border-t border-border pt-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((idx) => (
              <article
                key={idx}
                className="bg-card rounded-xl overflow-hidden border border-border hover:border-secondary transition-all hover:shadow-lg"
              >
                <div className="h-32 bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Tag className="w-12 h-12 text-secondary/30" />
                </div>
                <div className="p-4">
                  <div className="text-xs text-secondary font-semibold mb-2">
                    RELATED NEWS
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                    More Gospel Music Updates
                  </h3>
                  <Link href="/news" className="text-secondary font-semibold text-sm hover:underline">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-foreground">Stay Updated</h3>
          <p className="text-muted-foreground">
            Subscribe to our newsletter for the latest gospel music news and updates
          </p>
          <Button className="bg-secondary hover:bg-secondary/90 text-primary font-semibold">
            Subscribe Now
          </Button>
        </div>
      </div>
    </div>
  )
}
