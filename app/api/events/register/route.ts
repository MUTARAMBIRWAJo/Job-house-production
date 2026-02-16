import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      event_id,
      name,
      email,
      phone
    } = body

    // Validation
    if (!event_id || !name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: event_id, name' },
        { status: 400 }
      )
    }

    // Check if event exists and is published
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, title, event_date')
      .eq('id', event_id)
      .eq('is_published', true)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { success: false, error: 'Event not found or not published' },
        { status: 404 }
      )
    }

    // Check if already registered
    if (email) {
      const { data: existing } = await supabase
        .from('event_attendees')
        .select('id')
        .eq('event_id', event_id)
        .eq('email', email)
        .single()

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Already registered for this event' },
          { status: 409 }
        )
      }
    }

    // Register for event
    const { data, error } = await supabase
      .from('event_attendees')
      .insert({
        event_id,
        name,
        email,
        phone,
        registration_date: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('[API] Error registering for event:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to register for event' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        event_title: event.title,
        event_date: event.event_date
      },
      message: 'Successfully registered for event'
    })

  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
