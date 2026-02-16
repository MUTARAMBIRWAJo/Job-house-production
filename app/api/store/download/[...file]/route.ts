import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getOrdersByUserId, getOrderItems, getProductById } from '@/lib/db-actions'

/**
 * Verify user authentication
 */
async function verifyAuth() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { authorized: false, error: 'Unauthorized', userId: null }
  }

  return { authorized: true, error: null, userId: user.id, userEmail: user.email }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ file: string[] }> }
) {
  try {
    // Verify authentication
    const auth = await verifyAuth()

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please log in to access downloads.' },
        { status: 401 }
      )
    }

    const { file } = await params
    const filePath = file.join('/')

    // Get orders for authenticated user
    const orders = await getOrdersByUserId(auth.userId!)

    if (orders.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No purchases found' },
        { status: 403 }
      )
    }

    // Get all items and verify purchase
    const allItems = []
    for (const order of orders) {
      if (order.status !== 'paid') continue
      const items = await getOrderItems(order.id)
      allItems.push(...items)
    }

    // Verify user has access to this file
    let hasAccess = false
    let purchasedProduct = null

    for (const item of allItems) {
      if (!item.product_id) continue
      const product = await getProductById(item.product_id)
      if (product && (product.file_path === filePath || product.file_url === filePath)) {
        hasAccess = true
        purchasedProduct = product
        break
      }
    }

    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: 'Access denied. You have not purchased this product.' },
        { status: 403 }
      )
    }

    // Generate signed URL from Supabase Storage
    const supabase = await createClient()

    // Use the appropriate bucket based on the file
    const bucketName = 'digital-products'

    const { data: signedUrl, error: signedError } = await supabase
      .storage
      .from(bucketName)
      .createSignedUrl(filePath, 60) // 60 seconds expiry

    if (signedError) {
      console.error('Error creating signed URL:', signedError)
      return NextResponse.json(
        { success: false, error: 'Failed to generate download link' },
        { status: 500 }
      )
    }

    // Log the download (fire and forget, don't await)
    supabase.from('downloads').insert({
      user_id: auth.userId,
      user_email: auth.userEmail,
      download_token: crypto.randomUUID(),
      song_id: null // For products, we don't have song_id
    })

    return NextResponse.json({
      success: true,
      downloadUrl: signedUrl.signedUrl,
      expiresIn: 60,
      fileName: purchasedProduct?.title || filePath
    })
  } catch (error) {
    console.error('[v0] Download error:', error)
    return NextResponse.json(
      { success: false, error: 'Download failed' },
      { status: 500 }
    )
  }
}
