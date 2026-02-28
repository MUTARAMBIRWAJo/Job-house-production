'use client'

import Link from 'next/link'
import { Music, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

interface Song {
  id: string
  slug: string
  title: string
  description?: string
  lyrics?: string
  cover_image?: string
  view_count?: number
  artist_id?: string
  artists?: {
    id: string
    name: string
    slug: string
    image_url?: string
    verified_status?: string
  }
}

interface SongCardProps {
  song: Song
}

export default function SongCard({ song }: SongCardProps) {
  return (
    <Link href={`/songs/${song.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer hover:border-secondary">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2 text-foreground">
                {song.title}
              </CardTitle>
              {song.artists && (
                <p className="text-sm text-muted-foreground mt-1">
                  <Link href={`/artists/${song.artists.slug}`} onClick={(e) => e.stopPropagation()}>
                    <span className="hover:text-secondary transition-colors cursor-pointer">
                      {song.artists.name}
                      {song.artists.verified_status === 'verified' && (
                        <span className="ml-1 text-xs text-primary">✓</span>
                      )}
                    </span>
                  </Link>
                </p>
              )}
              {song.description && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                  {song.description}
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
            {song.view_count !== undefined && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="w-3 h-3" />
                <span>{song.view_count} views</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
