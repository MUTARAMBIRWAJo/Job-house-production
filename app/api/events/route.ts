import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Event } from '@/lib/types'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const type = searchParams.get('type')
    const city = searchParams.get('city')
    const featured = searchParams.get('featured')
    const upcoming = searchParams.get('upcoming')
    const past = searchParams.get('past')
    const needsCoverage = searchParams.get('needs_coverage')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('events')
      .select('id, title, slug, description, event_date, event_end_date, location, venue_address, featured_image, ticket_url, capacity, status, created_at, updated_at')
      .order('event_date', { ascending: true })

    // Apply filters
    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    // Date filters
    const today = new Date().toISOString().split('T')[0]
    
    if (upcoming === 'true') {
      query = query.gte('event_date', today)
    }
    
    if (past === 'true') {
      query = query.lt('event_date', today)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('[API] Error fetching events:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch events' },
        { status: 500 }
      )
    }

    console.log('[API] Raw events data:', data)

    // Transform data to match our types (mapping our schema to Event interface)
    const events: Event[] = (data || []).map((event: any) => ({
      id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description,
      event_type: 'concert' as any, // Default type for compatibility
      event_date: event.event_date,
      event_time: null,
      venue: event.location || '',
      venue_address: event.venue_address,
      city: null,
      country: 'Rwanda',
      poster_image: event.featured_image,
      organizer_name: null,
      organizer_phone: null,
      organizer_email: null,
      ticket_price: 0,
      is_free: !event.ticket_url,
      needs_audio_coverage: false,
      needs_video_coverage: false,
      coverage_contact: null,
      is_featured: false,
      is_published: event.status === 'upcoming',
      published_at: event.created_at,
      created_at: event.created_at,
      updated_at: event.updated_at
    }))

    return NextResponse.json({
      success: true,
      data: events,
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

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      title,
      description,
      event_date,
      event_end_date,
      location,
      venue_address,
      featured_image,
      ticket_url,
      capacity = null,
      status = 'upcoming'
    } = body

    // Validation
    if (!title || !event_date || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, event_date, location' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const { data, error } = await supabase
      .from('events')
      .insert({
        title,
        slug,
        description,
        event_date,
        event_end_date,
        location,
        venue_address,
        featured_image,
        ticket_url,
        capacity,
        status
      })
      .select()
      .single()

    if (error) {
      console.error('[API] Error creating event:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create event' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data
    })

  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
