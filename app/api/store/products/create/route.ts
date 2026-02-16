import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProductBySlug } from '@/lib/db-actions'

/**
 * Verify admin authentication
 */
async function verifyAdminAuth() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { authorized: false, error: 'Unauthorized' }
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') {
    return { authorized: false, error: 'Forbidden - Admin access required' }
  }
  return { authorized: true, userId: user.id }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin auth
    const auth = await verifyAdminAuth()
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate required fields
    if (
      !body.title ||
      !body.slug ||
      !body.description ||
      body.price === undefined ||
      !body.category ||
      !body.file_path
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingProduct = await getProductBySlug(body.slug)
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 409 }
      )
    }

    // Create new product in database
    const supabase = await createClient()
    const { data: newProduct, error: createError } = await supabase
      .from('products')
      .insert({
        title: body.title,
        slug: body.slug,
        description: body.description,
        price: body.price,
        currency: body.currency || 'USD',
        cover_image: body.cover_image || '/products/default.jpg',
        file_path: body.file_path,
        category: body.category,
        is_active: body.is_active !== false,
        is_featured: body.is_featured || false,
      })
      .select()
      .single()

    if (createError) {
      console.error('[v0] Error creating product:', createError)
      return NextResponse.json(
        { success: false, error: 'Failed to create product' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newProduct,
    })
  } catch (error) {
    console.error('[v0] Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
