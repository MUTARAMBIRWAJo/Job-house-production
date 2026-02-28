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
      <Card className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer hover:border-secondary overflow-hidden border-border/50 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-serif font-bold line-clamp-2 text-foreground mb-2">
                {song.title}
              </CardTitle>
              {song.artists && (
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  <Link href={`/artists/${song.artists.slug}`} onClick={(e) => e.stopPropagation()}>
                    <span className="hover:text-secondary transition-colors cursor-pointer">
                      {song.artists.name}
                      {song.artists.verified_status === 'verified' && (
                        <span className="ml-1.5 inline-flex items-center text-secondary">✓</span>
                      )}
                    </span>
                  </Link>
                </p>
              )}
              {song.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {song.description}
                </p>
              )}
            </div>
            <div className="bg-secondary/15 p-3 rounded-xl flex-shrink-0">
              <Music className="w-5 h-5 text-secondary" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {song.view_count !== undefined && (
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span>{song.view_count.toLocaleString()} views</span>
              </div>
            )}
            <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2 py-1 rounded-full">
              Gospel
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
