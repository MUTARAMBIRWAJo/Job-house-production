import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

interface Artist {
  id: string
  name: string
  slug: string
  bio?: string
  image_url?: string
  verified_status?: string
  genres?: string[]
  created_at?: string
  updated_at?: string
}

interface ArtistCardProps {
  artist: Artist
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link href={`/artists/${artist.slug}`}>
      <Card className="h-full hover:shadow-lg transition-all hover:border-secondary overflow-hidden cursor-pointer">
        <CardContent className="p-0">
          <div className="flex flex-col items-center pt-6 pb-4 px-4 text-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {artist.image_url ? (
                  <Image
                    src={artist.image_url}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-2xl">
                      {artist.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {artist.verified_status === 'verified' && (
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
            {artist.genres && artist.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3 justify-center">
                {artist.genres.slice(0, 2).map((genre, index) => (
                  <span key={index} className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Bio Preview */}
            {artist.bio && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {artist.bio}
              </p>
            )}

            {/* Verified Badge */}
            {artist.verified_status === 'verified' && (
              <span className="text-xs text-primary mt-2 font-semibold">Verified Artist</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
