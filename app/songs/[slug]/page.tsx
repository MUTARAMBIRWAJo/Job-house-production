import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Music, Calendar, User } from 'lucide-react'
import Image from 'next/image'

interface Song {
  id: string
  slug: string
  title: string
  description: string
  lyrics: string
  cover_image: string
  artist_id: string
  status: string
  created_at: string
  artists: {
    id: string
    name: string
    slug: string
    image_url: string
  }
}

async function getSongBySlug(slug: string): Promise<Song | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('songs')
    .select(`
      *,
      artists:artist_id (
        id,
        name,
        slug,
        image_url
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) return null
  return data as Song
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const song = await getSongBySlug(params.slug)
  
  if (!song) {
    return { title: 'Song Not Found' }
  }

  return {
    title: song.title,
    description: song.description || `Listen to ${song.title} on Job House Production`,
    openGraph: {
      title: song.title,
      description: song.description,
      images: song.cover_image ? [song.cover_image] : [],
    },
  }
}

export default async function SongDetailPage({ params }: { params: { slug: string } }) {
  const song = await getSongBySlug(params.slug)

  if (!song) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="pt-4">
        <Link href="/songs" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Songs
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
          {/* Image */}
          <div className="flex items-center justify-center">
            {song.cover_image ? (
              <div className="relative w-full h-64 md:h-96">
                <Image
                  src={song.cover_image}
                  alt={song.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center">
                <Music className="w-24 h-24 text-primary-foreground opacity-50" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-6 flex flex-col justify-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {song.title}
              </h1>
              
              {/* Artist */}
              {song.artists && (
                <Link href={`/artists/${song.artists.slug}`}>
                  <div className="flex items-center gap-3 mb-6 group cursor-pointer">
                    {song.artists.image_url ? (
                      <div className="relative w-12 h-12">
                        <Image
                          src={song.artists.image_url}
                          alt={song.artists.name}
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-foreground">
                          {song.artists.name[0]}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold group-hover:text-secondary transition-colors">
                        {song.artists.name}
                      </p>
                      <p className="text-sm text-muted-foreground">Artist</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(song.created_at)}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button className="bg-secondary hover:bg-secondary/90">
                Listen Now
              </Button>
              <Button variant="outline">
                Share
              </Button>
              <Button variant="outline">
                Save Lyrics
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Lyrics Section */}
      <section className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Lyrics</h2>
            <div className="bg-muted/50 rounded-lg p-8">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {song.lyrics || 'Lyrics not available'}
              </div>
            </div>
          </div>

          {song.description && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">About</h2>
              <p className="text-muted-foreground text-lg">
                {song.description}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Need Professional Music Production?
          </h2>
          <p className="text-muted-foreground text-lg">
            Get your music professionally produced, mixed, and mastered by our experienced team.
          </p>
          <div className="flex gap-4">
            <Link href="/studio">
              <Button className="bg-secondary hover:bg-secondary/90">
                Explore Services
              </Button>
            </Link>
            <Button variant="outline">
              Request Quote
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
