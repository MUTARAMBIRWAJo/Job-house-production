import { NextRequest, NextResponse } from 'next/server'
import { getRelatedProducts } from '@/lib/db-actions'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const products = await getRelatedProducts(id, 4)

    return NextResponse.json({
      success: true,
      data: products,
    })
  } catch (error) {
    console.error('[v0] Error fetching related products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch related products' },
      { status: 500 }
    )
  }
}
