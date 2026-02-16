import { NextRequest, NextResponse } from 'next/server'
import { getProductById, createOrder, createOrderItems } from '@/lib/db-actions'

export async function POST(request: NextRequest) {
  try {
    const { productId, email } = await request.json()

    if (!productId || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate product exists
    const product = await getProductById(productId)
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // In production, you would:
    // 1. Create a Stripe Checkout Session
    // 2. Return the session URL
    // For demo, we'll create an order and return success page

    const sessionId = `cs_test_${Math.random().toString(36).substr(2, 9)}`
    
    // Create order
    const order = await createOrder({
      user_email: email,
      stripe_payment_id: sessionId,
      amount: product.price,
      status: 'pending',
    })

    // Create order item
    await createOrderItems([
      {
        order_id: order.id,
        product_id: productId,
      },
    ])

    return NextResponse.json({
      success: true,
      url: `/success?orderId=${order.id}&email=${encodeURIComponent(email)}`,
    })
  } catch (error) {
    console.error('[v0] Checkout error:', error)
    return NextResponse.json(
      { success: false, error: 'Checkout failed' },
      { status: 500 }
    )
  }
}
