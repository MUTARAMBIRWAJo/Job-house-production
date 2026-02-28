import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import SongCard from '@/components/SongCard'

async function getAllSongs(searchTerm?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('songs')
    .select('*, artists:artist_id(id, name, slug, image_url, verified_status)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (searchTerm) {
    query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
  }

  const { data } = await query.limit(100)
  return data || []
}

export const metadata = {
  title: 'Songs - Gospel Lyrics & Music',
  description: 'Explore a collection of gospel songs, lyrics, and music from talented artists.',
}

export default async function SongsPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const searchTerm = searchParams.q
  const songs = await getAllSongs(searchTerm)

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Gospel Songs & Lyrics
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Discover authentic gospel music, explore lyrics, and connect with talented artists.
            </p>
          </div>

          {/* Search */}
          <form action="/songs" method="get" className="flex gap-2 max-w-md">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                name="q"
                placeholder="Search songs..."
                className="pl-10 py-3 rounded-lg"
                defaultValue={searchTerm || ''}
              />
            </div>
            <Button type="submit" className="bg-secondary hover:bg-secondary/90">
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Songs Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {searchTerm ? `Search Results for "${searchTerm}"` : 'All Songs'}
          </h2>
          <p className="text-muted-foreground">
            {songs.length} song{songs.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {songs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? 'No songs found matching your search.'
                : 'No songs available yet.'}
            </p>
            {searchTerm && (
              <Link href="/songs">
                <Button variant="outline">Clear Search</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
