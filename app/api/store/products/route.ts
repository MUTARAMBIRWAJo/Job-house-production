import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/server/db-actions'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined
    const sortBy = (searchParams.get('sortBy') || 'newest') as any

    const products = await getProducts({
      limit,
      offset,
      category,
      search,
      sortBy,
      active_only: true,
    })

    return NextResponse.json({
      success: true,
      data: products,
      pagination: { limit, offset },
    })
  } catch (error) {
    console.error('[v0] Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
