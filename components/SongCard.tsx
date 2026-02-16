'use client'

import Link from 'next/link'
import { Music, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatViewCount } from '@/lib/utils-custom'

// Enhanced Song interface with joins
interface EnhancedSong {
  id: string
  title: string
  lyrics: string
  artist_name: string
  featured_artist: string | null
  language: string
  audio_url: string | null
  cover_image: string | null
  view_count: number
  download_count: number
  duration_seconds: number | null
  created_at: string
  updated_at: string
  chords: any
  key_signature: string | null
  tempo: number | null
  time_signature: string | null
  // Enhanced fields from joins
  artist_slug?: string
  artist_avatar?: string
  artist_verified?: boolean
  genres?: string[]
  album_title?: string
  album_slug?: string
}

interface SongCardProps {
  song: EnhancedSong
}

export default function SongCard({ song }: SongCardProps) {
  const handleArtistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.location.href = `/artists?search=${encodeURIComponent(song.artist_name)}`
  }

  return (
    <Link href={`/lyrics/${song.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer hover:border-secondary">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2 text-foreground">
                {song.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                <span
                  className="hover:text-secondary transition-colors cursor-pointer"
                  onClick={handleArtistClick}
                >
                  {song.artist_name}
                  {song.artist_verified && (
                    <span className="ml-1 text-xs text-primary">✓</span>
                  )}
                </span>
                {song.featured_artist && (
                  <span className="text-xs text-muted-foreground">
                    {' '}
                    ft. {song.featured_artist}
                  </span>
                )}
              </p>
              {/* Display genres if available */}
              {song.genres && song.genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {song.genres.map((genre, index) => (
                    <span key={index} className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
              {/* Display album if available */}
              {song.album_title && (
                <p className="text-xs text-muted-foreground mt-1">
                  Album: {song.album_title}
                </p>
              )}
            </div>
            <div className="bg-secondary/10 p-2 rounded-lg">
              <Music className="w-4 h-4 text-secondary" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              <span>{formatViewCount(song.view_count || 0)} views</span>
            </div>
            {/* Display language if available */}
            {song.language && (
              <span className="text-xs text-muted-foreground">
                {song.language}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
