import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { ChordSheet } from '@/lib/types'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const songId = searchParams.get('song_id')
    const instrument = searchParams.get('instrument')
    const difficulty = searchParams.get('difficulty')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('chord_sheets')
      .select(`
        *,
        songs: song_id (
          id, title, slug, artist_name
        ),
        profiles: created_by (
          id, full_name, avatar_url
        )
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (songId) {
      query = query.eq('song_id', songId)
    }
    
    if (instrument) {
      query = query.eq('instrument_type', instrument)
    }
    
    if (difficulty) {
      query = query.eq('difficulty_level', difficulty)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('[API] Error fetching chord sheets:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch chord sheets' },
        { status: 500 }
      )
    }

    // Transform data to match our types
    const chordSheets: ChordSheet[] = (data || []).map((sheet: any) => ({
      id: sheet.id,
      song_id: sheet.song_id,
      title: sheet.title,
      key_signature: sheet.key_signature,
      tempo: sheet.tempo,
      time_signature: sheet.time_signature,
      chord_progression: sheet.chord_progression,
      difficulty_level: sheet.difficulty_level,
      instrument_type: sheet.instrument_type,
      is_official: sheet.is_official,
      created_by: sheet.created_by,
      created_at: sheet.created_at,
      updated_at: sheet.updated_at,
      song: sheet.songs,
      creator: sheet.profiles
    }))

    return NextResponse.json({
      success: true,
      data: chordSheets,
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
      song_id,
      title,
      key_signature,
      tempo,
      time_signature,
      chord_progression,
      difficulty_level = 'beginner',
      instrument_type = 'guitar',
      is_official = false
    } = body

    // Validation
    if (!song_id || !title || !key_signature || !chord_progression) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('chord_sheets')
      .insert({
        song_id,
        title,
        key_signature,
        tempo,
        time_signature: time_signature || '4/4',
        chord_progression,
        difficulty_level,
        instrument_type,
        is_official,
        created_by: user?.id || null
      })
      .select()
      .single()

    if (error) {
      console.error('[API] Error creating chord sheet:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create chord sheet' },
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
