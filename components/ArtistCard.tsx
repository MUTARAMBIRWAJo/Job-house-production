import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

// Enhanced Artist interface with joins
interface EnhancedArtist {
  id: string
  name: string
  slug: string
  bio: string
  avatar_url: string | null
  verified_status: boolean | null
  genres: string[] | null
  email: string | null
  social_links: any
  founded_year: number | null
  songs_count: number | null
  followers: number | null
  created_at: string
  updated_at: string
  // Enhanced fields from joins
  genre_names?: string[]
  genre_count?: number
  latest_song_title?: string
  latest_song_date?: string
}

interface ArtistCardProps {
  artist: EnhancedArtist
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link href={`/artists/${artist.id}`}>
      <Card className="h-full hover:shadow-lg transition-all hover:border-secondary overflow-hidden cursor-pointer">
        <CardContent className="p-0">
          <div className="flex flex-col items-center pt-6 pb-4 px-4 text-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-2xl">
                    {artist.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              {artist.verified_status && (
                <div className="absolute bottom-0 right-0">
                  <CheckCircle2 className="w-6 h-6 text-secondary bg-white rounded-full" />
                </div>
              )}
            </div>

            {/* Name */}
            <h3 className="font-semibold text-foreground text-sm line-clamp-2">
              {artist.name}
            </h3>

            {/* Genres */}
            {artist.genre_names && artist.genre_names.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3 justify-center">
                {artist.genre_names.slice(0, 3).map((genre, index) => (
                  <span key={index} className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                    {genre}
                  </span>
                ))}
                {artist.genre_names && artist.genre_names.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    +{(artist.genre_count || 0) - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Bio Preview */}
            {artist.bio && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {artist.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
              <span>{artist.followers || 0} followers</span>
              {artist.songs_count && (
                <span>{artist.songs_count} songs</span>
              )}
              {artist.verified_status && (
                <span className="text-xs text-primary">Verified</span>
              )}
            </div>

            {/* Founded Year */}
            {artist.founded_year && (
              <div className="text-xs text-muted-foreground mt-2">
                Founded {artist.founded_year}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
