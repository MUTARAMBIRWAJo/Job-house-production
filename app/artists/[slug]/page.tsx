import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, Music, Globe, Verified } from 'lucide-react'
import Image from 'next/image'

interface Artist {
  id: string
  slug: string
  name: string
  bio: string
  image_url: string
  verified_status: string
  website: string
  social_links: any
  genres: string[]
  created_at: string
}

async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as Artist
}

async function getArtistSongs(artistId: string) {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('songs')
    .select('*')
    .eq('artist_id', artistId)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(10)

  return data || []
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const artist = await getArtistBySlug(params.slug)
  
  if (!artist) {
    return { title: 'Artist Not Found' }
  }

  return {
    title: artist.name,
    description: artist.bio || `Listen to music by ${artist.name} on Job House Production`,
    openGraph: {
      title: artist.name,
      description: artist.bio,
      images: artist.image_url ? [artist.image_url] : [],
    },
  }
}

export default async function ArtistDetailPage({ params }: { params: { slug: string } }) {
  const artist = await getArtistBySlug(params.slug)

  if (!artist) {
    notFound()
  }

  const songs = await getArtistSongs(artist.id)

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="pt-4">
        <Link href="/artists" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Artists
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
          {/* Image */}
          <div className="flex items-center justify-center">
            {artist.image_url ? (
              <div className="relative w-full h-64 md:h-96">
                <Image
                  src={artist.image_url}
                  alt={artist.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center">
                <Users className="w-24 h-24 text-primary-foreground opacity-50" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-6 flex flex-col justify-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  {artist.name}
                </h1>
                {artist.verified_status === 'verified' && (
                  <Verified className="w-8 h-8 text-secondary" />
                )}
              </div>
              
              {artist.genres && artist.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {artist.genres.map((genre) => (
                    <span
                      key={genre}
                      className="text-xs bg-secondary/20 text-secondary px-3 py-1 rounded-full font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {artist.bio && (
              <p className="text-muted-foreground text-lg leading-relaxed">
                {artist.bio}
              </p>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-3 pt-4">
              {artist.website && (
                <a href={artist.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <Globe className="w-4 h-4" />
                    Visit Website
                  </Button>
                </a>
              )}
              <Button className="bg-secondary hover:bg-secondary/90">
                Book Production
              </Button>
              <Button variant="outline">
                Contact
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Songs Section */}
      {songs.length > 0 && (
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Latest Songs</h2>
            <p className="text-muted-foreground">Discover {artist.name}'s recent releases</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((song) => (
              <Link key={song.id} href={`/songs/${song.slug}`}>
                <div className="group cursor-pointer h-full">
                  <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                    {song.cover_image ? (
                      <Image
                        src={song.cover_image}
                        alt={song.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <Music className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-secondary transition-colors">
                      {song.title}
                    </h3>
                    {song.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {song.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Ready to Book {artist.name}?
          </h2>
          <p className="text-muted-foreground text-lg">
            Inquire about studio sessions, collaborations, and more.
          </p>
          <div className="flex gap-4">
            <Button className="bg-secondary hover:bg-secondary/90">
              Book Now
            </Button>
            <Button variant="outline">
              Message
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
