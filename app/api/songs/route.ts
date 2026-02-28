import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSongs, incrementSongViewCount } from '@/lib/server/db-actions'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const { 
      limit = '12',
      offset = '0',
      search,
      language,
      sort = 'created_at',
      order = 'desc',
      created_by,
      featured
    } = Object.fromEntries(searchParams.entries())

    // Handle special case for lyrics page filtering
    const isLyricsPage = searchParams.has('language') || searchParams.has('sort')
    
    let query = supabase
      .from('songs')
      .select(`
        *,
        artists: artist_id (
          id, 
          name, 
          slug,
          avatar_url,
          verified_status
        )
      `)

    // Apply different logic for lyrics page vs general API
    if (isLyricsPage) {
      // Lyrics page specific logic
      if (language && language !== '' && language !== 'all') {
        query = query.eq('language', language)
      }

      // Apply sorting for lyrics page
      switch (sort) {
        case 'trending':
          query = query.order('view_count', { ascending: false })
          break
        case 'popular':
          query = query.order('view_count', { ascending: false })
          break
        case 'recent':
        default:
          query = query.order('created_at', { ascending: false })
          break
      }
    } else {
      // Original API logic
      query = query.order(sort, { ascending: order === 'asc' })
      
      // Apply filters
      if (search) {
        query = query.or(`title.ilike.%${search}%,lyrics.ilike.%${search}%`)
      }
      
      if (language && language !== 'all') {
        query = query.eq('language', language)
      }
      
      if (created_by) {
        query = query.eq('created_by', created_by)
      }
      
      const featured = searchParams.get('featured')
      if (featured === 'true') {
        query = query.eq('featured', true)
      }
    }

    // Apply pagination
    const limitNum = parseInt(limit)
    const offsetNum = parseInt(offset)
    query = query.range(offsetNum, offsetNum + limitNum - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('[API] Error fetching songs:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch songs' },
        { status: 500 }
      )
    }

    console.log('[API] Raw songs data:', data)

    const total = count || 0
    const hasMore = offsetNum + limitNum < total

    if (isLyricsPage) {
      // Return simplified format for lyrics page
      const enhancedSongs = data?.map((song: any) => ({
        id: song.id,
        title: song.title,
        lyrics: song.lyrics,
        artist_name: song.artist_name,
        featured_artist: song.featured_artist,
        language: song.language,
        audio_url: song.audio_url,
        cover_image: song.cover_image,
        view_count: song.view_count,
        download_count: song.download_count,
        duration_seconds: song.duration_seconds,
        created_at: song.created_at,
        updated_at: song.updated_at,
        chords: song.chords,
        key_signature: song.key_signature,
        tempo: song.tempo,
        time_signature: song.time_signature,
        // Enhanced fields (simplified)
        artist_slug: song.artist_name?.toLowerCase().replace(/\s+/g, '-'),
        artist_avatar: song.artists?.avatar_url || null,
        artist_verified: song.artists?.verified_status || false,
        genres: song.language ? [song.language] : [],
        album_title: null,
        album_slug: null
      })) || []

      console.log('[API] Lyrics page response:', enhancedSongs.length)
      return NextResponse.json({
        success: true,
        data: enhancedSongs,
        songs: enhancedSongs
      })
    } else {
      // Return original format for general API
      console.log('[API] General API response:', data?.length || 0)
      return NextResponse.json({
        success: true,
        data: data || [],
        songs: data || [],
        pagination: {
          limit: limitNum,
          offset: offsetNum,
          total,
          hasMore
        }
      })
    }

  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { songId } = await request.json()

    if (!songId) {
      return NextResponse.json(
        { success: false, error: 'Song ID is required' },
        { status: 400 }
      )
    }

    await incrementSongViewCount(songId)

    return NextResponse.json({
      success: true,
      message: 'View count incremented',
    })
  } catch (error) {
    console.error('[v0] Error incrementing view count:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to increment view count' },
      { status: 500 }
    )
  }
}
