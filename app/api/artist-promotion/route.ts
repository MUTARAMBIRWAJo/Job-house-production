import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      artist_id,
      promotion_type, // 'featured_artist', 'featured_song', 'verified_profile'
      duration_months = 1,
      payment_method = 'stripe',
      custom_message
    } = body

    // Validation
    if (!artist_id || !promotion_type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: artist_id, promotion_type' },
        { status: 400 }
      )
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get artist details
    const { data: artist, error: artistError } = await supabase
      .from('artists')
      .select('*')
      .eq('id', artist_id)
      .single()

    if (artistError || !artist) {
      return NextResponse.json(
        { success: false, error: 'Artist not found' },
        { status: 404 }
      )
    }

    // Check if user owns this artist or is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, artist_id')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.artist_id !== artist_id && profile.role !== 'admin')) {
      return NextResponse.json(
        { success: false, error: 'Permission denied' },
        { status: 403 }
      )
    }

    // Calculate pricing based on promotion type and duration
    const pricing = {
      featured_artist: 50000 * duration_months, // RWF 50,000 per month
      featured_song: 30000 * duration_months,   // RWF 30,000 per month
      verified_profile: 75000  // One-time fee
    }

    const price = pricing[promotion_type as keyof typeof pricing]
    
    if (!price) {
      return NextResponse.json(
        { success: false, error: 'Invalid promotion type' },
        { status: 400 }
      )
    }

    // Create promotion record
    const { data: promotion, error: promotionError } = await supabase
      .from('artist_promotions')
      .insert({
        artist_id,
        user_id: user.id,
        promotion_type,
        duration_months,
        price,
        currency: 'RWF',
        status: 'pending',
        payment_method,
        custom_message,
        start_date: new Date().toISOString(),
        end_date: promotion_type !== 'verified_profile' 
          ? new Date(Date.now() + duration_months * 30 * 24 * 60 * 60 * 1000).toISOString()
          : null
      })
      .select()
      .single()

    if (promotionError) {
      console.error('[API] Error creating promotion:', promotionError)
      return NextResponse.json(
        { success: false, error: 'Failed to create promotion request' },
        { status: 500 }
      )
    }

    // In a real implementation, you would integrate with Stripe here
    // For now, we'll simulate payment completion
    const paymentData = {
      promotion_id: promotion.id,
      amount: price,
      currency: 'RWF',
      payment_method,
      status: 'pending'
    }

    return NextResponse.json({
      success: true,
      data: {
        promotion,
        payment: paymentData,
        artist: {
          name: artist.name,
          slug: artist.slug,
          image_url: artist.image_url
        }
      },
      message: 'Promotion request created successfully'
    })

  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const artistId = searchParams.get('artist_id')
    const userId = searchParams.get('user_id')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('artist_promotions')
      .select(`
        *,
        artists: artist_id (
          id, name, slug, image_url
        ),
        profiles: user_id (
          id, full_name, email
        )
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (artistId) {
      query = query.eq('artist_id', artistId)
    }
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    if (status) {
      query = query.eq('status', status)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('[API] Error fetching promotions:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch promotions' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      total: count || 0,
      hasMore: (offset + limit) < (count || 0)
    })

  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
