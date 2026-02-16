import { NextRequest, NextResponse } from 'next/server'
import { getOrdersByUserId, getOrderItems, getProductById } from '@/lib/db-actions'
import { createClient } from '@/lib/supabase/server'

/**
 * Verify user authentication
 */
async function verifyAuth() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { authorized: false, error: 'Unauthorized', userId: null, userEmail: null }
  }

  return { authorized: true, error: null, userId: user.id, userEmail: user.email }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth()

    if (!auth.authorized || !auth.userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get orders for authenticated user by user_id
    const orders = await getOrdersByUserId(auth.userId)

    // Get all items for these orders
    const allItems = []
    for (const order of orders) {
      const items = await getOrderItems(order.id)
      // Also fetch product details for each item
      for (const item of items) {
        if (item.product_id) {
          const product = await getProductById(item.product_id)
          if (product) {
            item.product = product
          }
        }
      }
      allItems.push(...items)
    }

    // Get unique products
    const productsMap = new Map()
    for (const item of allItems) {
      if (item.product) {
        productsMap.set(item.product.id, item.product)
      }
    }
    const products = Array.from(productsMap.values())

    return NextResponse.json({
      success: true,
      data: {
        orders,
        items: allItems,
        products,
      },
    })
  } catch (error) {
    console.error('[v0] Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
