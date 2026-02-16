import Link from 'next/link'
import { ArrowLeft, Filter } from 'lucide-react'
import ArtistCard from '@/components/ArtistCard'
import { Button } from '@/components/ui/button'
import { Artist } from '@/types'
import { createPublicClient } from '@/lib/supabase/public'

const GENRES = ['Gospel', 'Contemporary Gospel', 'Traditional Gospel', 'Reggae', 'Soul', 'Pop']

// Enhanced Artist interface with joins (matches ArtistCard expectations)
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

// Server-side data fetching - PUBLIC ACCESS (No authentication required)
async function getArtists(genre?: string, verifiedOnly: boolean = false, search?: string) {
  const supabase = createPublicClient()
  
  let query = supabase
    .from('artists')
    .select('*')

  // Apply filters
  if (genre && genre !== '') {
    query = query.contains('genres', [genre])
  }
  
  if (verifiedOnly) {
    query = query.eq('verified_status', true)
  }
  
  if (search && search !== '') {
    query = query.or(`name.ilike.%${search}%,bio.ilike.%${search}%`)
  }

  const { data: artists, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching artists:', error)
    return []
  }

  // Enhanced artists mapping
  return artists?.map((artist: any) => ({
    id: artist.id,
    name: artist.name,
    slug: artist.slug,
    bio: artist.bio,
    avatar_url: artist.avatar_url,
    verified_status: artist.verified_status,
    genres: artist.genres,
    songs_count: artist.songs_count || 0,
    followers: artist.followers || 0,
    created_at: artist.created_at,
    updated_at: artist.updated_at
  })) || []
}

export default async function ArtistsPage({
  searchParams
}: {
  searchParams?: { genre?: string; verified?: string; search?: string }
}) {
  const genre = searchParams?.genre || ''
  const verifiedOnly = searchParams?.verified === 'true'
  const search = searchParams?.search || ''
  
  const artists = await getArtists(genre, verifiedOnly, search)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Artists</h1>
          <p className="text-muted-foreground text-lg">
            Discover talented gospel artists and their music
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-card rounded-lg p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Genre</label>
              <select className="w-full p-2 border rounded-md">
                <option value="">All Genres</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Verified Only</label>
              <select className="w-full p-2 border rounded-md">
                <option value="false">All Artists</option>
                <option value="true">Verified Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input 
                type="text" 
                placeholder="Search artists..."
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Artists Grid */}
        {artists.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground">
              <Filter className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No artists found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or check back later for new additions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist: any) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
