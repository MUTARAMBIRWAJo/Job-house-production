import { NextRequest, NextResponse } from 'next/server'
import { searchAll } from '@/lib/db-actions'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: {
          songs: [],
          artists: [],
          news: [],
        },
      })
    }

    const results = await searchAll(query)

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error('[v0] Error searching:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search' },
      { status: 500 }
    )
  }
}
