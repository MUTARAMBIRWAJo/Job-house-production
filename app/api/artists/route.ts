import { NextRequest, NextResponse } from 'next/server'
import { getArtists } from '@/lib/db-actions'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const verified = searchParams.get('verified') === 'true' ? true : undefined
    const searchTerm = searchParams.get('search') || undefined
    const genre = searchParams.get('genre') || undefined

    const artists = await getArtists({
      limit,
      offset,
      verified,
      searchTerm,
      genre,
    })

    return NextResponse.json({
      success: true,
      data: artists,
      pagination: { limit, offset },
    })
  } catch (error) {
    console.error('[v0] Error fetching artists:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch artists' },
      { status: 500 }
    )
  }
}
