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
      <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:border-secondary overflow-hidden cursor-pointer border-border/50 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="flex flex-col items-center pt-8 pb-6 px-6 text-center flex-1">
            {/* Avatar */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center overflow-hidden border-2 border-secondary/10">
                {artist.image_url ? (
                  <Image
                    src={artist.image_url}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-secondary/40 to-primary/40 flex items-center justify-center">
                    <span className="text-primary font-serif font-bold text-4xl">
                      {artist.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {artist.verified_status === 'verified' && (
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                </div>
              )}
            </div>

            {/* Name */}
            <h3 className="font-serif font-bold text-foreground text-lg line-clamp-2 mb-2">
              {artist.name}
            </h3>

            {/* Genres */}
            {artist.genres && artist.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 justify-center">
                {artist.genres.slice(0, 2).map((genre, index) => (
                  <span key={index} className="text-xs font-medium bg-secondary/15 text-primary px-3 py-1 rounded-full">
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Bio Preview */}
            {artist.bio && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {artist.bio}
              </p>
            )}

            {/* Verified Badge */}
            {artist.verified_status === 'verified' && (
              <span className="text-xs font-semibold text-secondary bg-secondary/10 px-3 py-1.5 rounded-full">
                ✓ Verified Artist
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
