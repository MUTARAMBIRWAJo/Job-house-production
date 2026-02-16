'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import FilterControls from '@/components/FilterControls'
import SongCard from '@/components/SongCard'
import { EnhancedSong } from '@/lib/types'

interface LyricsClientProps {
  initialSongs: EnhancedSong[]
  language: string
  sort: string
}

export default function LyricsClient({ initialSongs, language, sort }: LyricsClientProps) {
  const [songs, setSongs] = useState<EnhancedSong[]>(initialSongs)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleLanguageChange = (newLanguage: string) => {
    const params = new URLSearchParams(searchParams)
    if (newLanguage) {
      params.set('language', newLanguage)
    } else {
      params.delete('language')
    }
    params.set('sort', sort)
    router.push(`/lyrics?${params.toString()}`)
  }

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', newSort)
    if (language) {
      params.set('language', language)
    }
    router.push(`/lyrics?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Gospel Lyrics</h1>
          <p className="text-muted-foreground text-lg">
            Discover and explore gospel song lyrics in Kinyarwanda and other languages
          </p>
        </div>

        <div className="mb-8">
          <FilterControls
            language={language}
            sort={sort}
            onLanguageChange={handleLanguageChange}
            onSortChange={handleSortChange}
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading lyrics...</p>
          </div>
        ) : songs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No lyrics found</p>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
