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
      .select(`
        *
      `)
      .order('event_date', { ascending: true })

    // Apply filters
    if (type) {
      query = query.eq('event_type', type)
    }
    
    if (city) {
      query = query.eq('city', city)
    }
    
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }
    
    if (needsCoverage === 'true') {
      query = query.or('needs_audio_coverage.eq.true,needs_video_coverage.eq.true')
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

    // Transform data to match our types
    const events: Event[] = (data || []).map((event: any) => ({
      id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description,
      event_type: event.event_type,
      event_date: event.event_date,
      event_time: event.event_time,
      venue: event.venue,
      venue_address: event.venue_address,
      city: event.city,
      country: event.country,
      poster_image: event.poster_image,
      organizer_name: event.organizer_name,
      organizer_phone: event.organizer_phone,
      organizer_email: event.organizer_email,
      ticket_price: event.ticket_price,
      is_free: event.is_free,
      needs_audio_coverage: event.needs_audio_coverage,
      needs_video_coverage: event.needs_video_coverage,
      coverage_contact: event.coverage_contact,
      is_featured: event.is_featured,
      is_published: event.is_published,
      published_at: event.published_at,
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
      event_type = 'concert',
      event_date,
      event_time,
      venue,
      venue_address,
      city,
      country = 'Rwanda',
      poster_image,
      organizer_name,
      organizer_phone,
      organizer_email,
      ticket_price = 0,
      is_free = true,
      needs_audio_coverage = false,
      needs_video_coverage = false,
      coverage_contact,
      is_featured = false,
      is_published = true
    } = body

    // Validation
    if (!title || !event_date || !venue) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, event_date, venue' },
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
        event_type,
        event_date,
        event_time,
        venue,
        venue_address,
        city,
        country,
        poster_image,
        organizer_name,
        organizer_phone,
        organizer_email,
        ticket_price,
        is_free,
        needs_audio_coverage,
        needs_video_coverage,
        coverage_contact,
        is_featured,
        is_published,
        published_at: is_published ? new Date().toISOString() : null
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
