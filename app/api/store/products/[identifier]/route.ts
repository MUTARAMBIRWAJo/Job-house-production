import { NextRequest, NextResponse } from 'next/server'
import { getProductBySlug, getProductById } from '@/lib/db-actions'
import { createClient } from '@/lib/supabase/server'

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

export async function PUT(
      request: NextRequest,
      { params }: { params: Promise<{ identifier: string }> }
) {
      try {
            // Verify admin auth
            const auth = await verifyAdminAuth()
            if (!auth.authorized) {
                  return NextResponse.json(
                        { success: false, error: auth.error },
                        { status: 401 }
                  )
            }

            const { identifier } = await params
            const body = await request.json()

            // Check if identifier is a UUID or a slug
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)

            let product
            if (isUuid) {
                  product = await getProductById(identifier)
            } else {
                  product = await getProductBySlug(identifier)
            }

            if (!product) {
                  return NextResponse.json(
                        { success: false, error: 'Product not found' },
                        { status: 404 }
                  )
            }

            // Update product in database
            const supabase = await createClient()
            const { data: updatedProduct, error: updateError } = await supabase
                  .from('products')
                  .update({
                        ...body,
                        updated_at: new Date().toISOString()
                  })
                  .eq('id', product.id)
                  .select()
                  .single()

            if (updateError) {
                  console.error('[v0] Error updating product:', updateError)
                  return NextResponse.json(
                        { success: false, error: 'Failed to update product' },
                        { status: 500 }
                  )
            }

            return NextResponse.json({
                  success: true,
                  data: updatedProduct,
            })
      } catch (error) {
            console.error('[v0] Error updating product:', error)
            return NextResponse.json(
                  { success: false, error: 'Failed to update product' },
                  { status: 500 }
            )
      }
}

export async function DELETE(
      request: NextRequest,
      { params }: { params: Promise<{ identifier: string }> }
) {
      try {
            // Verify admin auth
            const auth = await verifyAdminAuth()
            if (!auth.authorized) {
                  return NextResponse.json(
                        { success: false, error: auth.error },
                        { status: 401 }
                  )
            }

            const { identifier } = await params

            // Check if identifier is a UUID or a slug
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)

            let product
            if (isUuid) {
                  product = await getProductById(identifier)
            } else {
                  product = await getProductBySlug(identifier)
            }

            if (!product) {
                  return NextResponse.json(
                        { success: false, error: 'Product not found' },
                        { status: 404 }
                  )
            }

            // Delete product from database (soft delete - set is_active to false)
            const supabase = await createClient()
            const { error: deleteError } = await supabase
                  .from('products')
                  .update({ is_active: false, updated_at: new Date().toISOString() })
                  .eq('id', product.id)

            if (deleteError) {
                  console.error('[v0] Error deleting product:', deleteError)
                  return NextResponse.json(
                        { success: false, error: 'Failed to delete product' },
                        { status: 500 }
                  )
            }

            return NextResponse.json({
                  success: true,
                  message: 'Product deleted',
            })
      } catch (error) {
            console.error('[v0] Error deleting product:', error)
            return NextResponse.json(
                  { success: false, error: 'Failed to delete product' },
                  { status: 500 }
            )
      }
}

export async function GET(
      request: NextRequest,
      { params }: { params: Promise<{ identifier: string }> }
) {
      try {
            const { identifier } = await params

            // Check if identifier is a UUID or a slug
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)

            let product
            if (isUuid) {
                  product = await getProductById(identifier)
            } else {
                  product = await getProductBySlug(identifier)
            }

            if (!product) {
                  return NextResponse.json(
                        { success: false, error: 'Product not found' },
                        { status: 404 }
                  )
            }

            return NextResponse.json({
                  success: true,
                  data: product,
            })
      } catch (error) {
            console.error('[v0] Error fetching product:', error)
            return NextResponse.json(
                  { success: false, error: 'Failed to fetch product' },
                  { status: 500 }
            )
      }
}
