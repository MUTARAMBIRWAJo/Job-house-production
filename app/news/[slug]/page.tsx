import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Share2 } from 'lucide-react'
import Image from 'next/image'

interface NewsArticle {
  id: string
  slug: string
  title: string
  content: string
  category: string
  featured_image: string
  excerpt: string
  status: string
  created_at: string
  updated_at: string
}

async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) return null
  return data as NewsArticle
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug)
  
  if (!article) {
    return { title: 'Article Not Found' }
  }

  return {
    title: article.title,
    description: article.excerpt || article.content.slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.featured_image ? [article.featured_image] : [],
    },
  }
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="pt-4">
        <Link href="/news" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to News
        </Link>
      </div>

      {/* Hero Section */}
      <section className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {article.category && (
              <span className="text-xs bg-secondary/20 text-secondary px-3 py-1 rounded-full font-semibold">
                {article.category}
              </span>
            )}
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.created_at)}</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            {article.title}
          </h1>
        </div>

        {/* Featured Image */}
        {article.featured_image && (
          <div className="relative w-full h-96 rounded-2xl overflow-hidden">
            <Image
              src={article.featured_image}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-foreground leading-relaxed text-lg">
            {article.content}
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="max-w-4xl mx-auto border-t border-border pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Share this article</h3>
            <p className="text-sm text-muted-foreground">Spread the word about this news</p>
          </div>
          <Button className="gap-2" variant="outline">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </section>

      {/* Related Articles CTA */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            More News & Updates
          </h2>
          <p className="text-muted-foreground text-lg">
            Stay updated with the latest from Job House Production.
          </p>
          <Link href="/news">
            <Button className="bg-secondary hover:bg-secondary/90">
              View All Articles
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
