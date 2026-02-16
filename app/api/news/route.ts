import { NextRequest, NextResponse } from 'next/server'
import { getNews } from '@/lib/db-actions'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const searchTerm = searchParams.get('search') || undefined

    const news = await getNews({
      limit,
      offset,
      searchTerm,
    })

    return NextResponse.json({
      success: true,
      data: news,
      pagination: { limit, offset },
    })
  } catch (error) {
    console.error('[v0] Error fetching news:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
