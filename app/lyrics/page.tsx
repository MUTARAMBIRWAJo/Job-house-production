import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Filter } from 'lucide-react'
import SongCard from '@/components/SongCard'
import { Button } from '@/components/ui/button'
import FilterControls from '@/components/FilterControls'
import { Song } from '@/types'
import { createClient } from '@/lib/supabase/server'
import LyricsClient from './LyricsClient'

// Server-side data fetching - PUBLIC ACCESS (No authentication required)
async function getSongs(language?: string, sort: string = 'recent') {
  const supabase = await createClient()
  
  let query = supabase
    .from('songs')
    .select(`
      *,
      artists:artist_id (
        id,
        name,
        slug,
        avatar_url,
        verified_status
      )
    `)

  // Apply language filter
  if (language && language !== '' && language !== 'all') {
    query = query.eq('language', language)
  }

  // Apply sorting
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

  const { data: songs, error } = await query

  if (error) {
    console.error('Error fetching songs:', error)
    return []
  }

  console.log("Raw songs:", songs)

  // Enhanced songs mapping
  return songs?.map((song: any) => ({
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
    artist_slug: song.artists?.slug || song.artist_name?.toLowerCase().replace(/\s+/g, '-'),
    artist_avatar: song.artists?.avatar_url || undefined,
    artist_verified: song.artists?.verified_status || false,
    genres: song.language ? [song.language] : [],
    album_title: undefined,
    album_slug: undefined
  })) || []
}

export default async function LyricsPage({
  searchParams
}: {
  searchParams: { language?: string; sort?: string }
}) {
  const language = searchParams.language || ''
  const sort = searchParams.sort || 'recent'
  
  const songs = await getSongs(language, sort)

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading lyrics...</p>
          </div>
        </div>
      </div>
    }>
      <LyricsClient initialSongs={songs} language={language} sort={sort} />
    </Suspense>
  )
}
