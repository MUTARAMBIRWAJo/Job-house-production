import { NextRequest, NextResponse } from 'next/server'
import { getOrderById, getOrderItems, getProductById } from '@/lib/server/db-actions'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await getOrderById(id)

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    const items = await getOrderItems(id)
    const products = []

    for (const item of items) {
      if (!item.product_id) continue
      const product = await getProductById(item.product_id)
      if (product) {
        products.push(product)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        order,
        items,
        products,
      },
    })
  } catch (error) {
    console.error('[v0] Error fetching order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
