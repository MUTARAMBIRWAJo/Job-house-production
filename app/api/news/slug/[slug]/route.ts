import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NewsArticle } from '@/lib/types'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('news')
      .select('id, title, slug, content, featured_image, category, featured, status, created_at, updated_at')
      .eq('slug', params.slug)
      .eq('status', 'published')
      .single()

    if (error || !data) {
      console.error('[v0] News article fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      )
    }

    // Map database fields to NewsArticle interface
    const article: NewsArticle = {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.content?.substring(0, 160) || null,
      content: data.content,
      author: null,
      category: data.category,
      featured_image: data.featured_image,
      is_featured: data.featured,
      published_at: data.created_at,
      published_date: data.created_at,
      created_at: data.created_at,
      updated_at: data.updated_at
    }

    return NextResponse.json({
      success: true,
      data: article
    })

  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
