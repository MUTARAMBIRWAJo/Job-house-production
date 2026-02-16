'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, User, Globe, Share2, Copy, Check, Music, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Song, ChordSheet } from '@/types'
import ChordSheetComponent from '@/components/ChordSheet'

export default function SongDetailPage() {
  const params = useParams()
  const songId = params.id as string

  const [song, setSong] = useState<Song | null>(null)
  const [chordSheets, setChordSheets] = useState<ChordSheet[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('lyrics')

  useEffect(() => {
    if (songId) {
      fetchSongData()
      incrementViewCount()
    }
  }, [songId])

  const fetchSongData = async () => {
    try {
      setLoading(true)
      
      const [songRes, chordsRes] = await Promise.all([
        fetch(`/api/songs/${songId}`),
        fetch(`/api/chord-sheets?song_id=${songId}`)
      ])
      
      if (!songRes.ok) {
        throw new Error('Failed to fetch song')
      }

      const songData = await songRes.json()
      setSong(songData.data)

      if (chordsRes.ok) {
        const chordsData = await chordsRes.json()
        setChordSheets(chordsData.data || [])
        // Auto-switch to chords tab if chord sheets exist
        if (chordsData.data && chordsData.data.length > 0) {
          setActiveTab('chords')
        }
      }
    } catch (error) {
      console.error('[v0] Error fetching song:', error)
      setSong(null)
    } finally {
      setLoading(false)
    }
  }

  const incrementViewCount = async () => {
    try {
      await fetch('/api/songs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId }),
      })
    } catch (error) {
      console.error('[v0] Error incrementing view count:', error)
    }
  }

  const handleCopyLyrics = () => {
    if (song?.lyrics) {
      navigator.clipboard.writeText(song.lyrics)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({
        title: song?.title,
        text: `Check out "${song?.title}" by ${song?.artist_name}`,
        url,
      })
    } else {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
          <p className="text-muted-foreground">Loading song...</p>
        </div>
      </div>
    )
  }

  if (!song) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Song Not Found</h1>
          <Link href="/lyrics">
            <Button variant="outline">Back to Lyrics</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/lyrics">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lyrics
            </Button>
          </Link>
        </div>
      </div>

      {/* Song Hero */}
      <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4 text-balance">{song.title}</h1>

          {/* Song Info */}
        <div className="flex flex-wrap items-center gap-6 text-gray-200 mb-6">
          <Link href={`/artists/${song.artist_id || '#'}`} className="hover:text-white transition">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{song.artist_name}</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <span>{song.language}</span>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <span>{song.view_count.toLocaleString()} views</span>
          </div>

          {song.key_signature && (
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              <span>Key: {song.key_signature}</span>
            </div>
          )}

          <span className="text-sm">
            {new Date(song.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lyrics" className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Lyrics
            </TabsTrigger>
            <TabsTrigger value="chords" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Chord Sheets {chordSheets.length > 0 && `(${chordSheets.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lyrics" className="mt-6">
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="prose prose-invert max-w-none">
                <div className="space-y-4 text-foreground leading-relaxed whitespace-pre-wrap font-serif text-lg">
                  {song.lyrics}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="chords" className="mt-6">
            {chordSheets.length > 0 ? (
              <div className="space-y-6">
                {chordSheets.map((chordSheet) => (
                  <ChordSheetComponent 
                    key={chordSheet.id} 
                    chordSheet={chordSheet} 
                    showFull={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Chord Sheets Available</h3>
                <p className="text-muted-foreground mb-6">
                  Chord sheets for this song haven't been added yet. Check back later or contribute your own chord sheet!
                </p>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Request Chord Sheet
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-12 mt-8">
          <Button
            onClick={handleCopyLyrics}
            variant="outline"
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Lyrics
              </>
            )}
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>

        {/* Related Songs */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">More Songs</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-lg p-4 border border-border text-center">
              <Music className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                More songs coming soon...
              </p>
            </div>
          </div>
        </div>

        {/* Artist Info CTA */}
        <div className="mt-16 bg-secondary/10 border border-secondary/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-foreground mb-2">About {song.artist_name}</h3>
          <p className="text-muted-foreground mb-6">
            Discover more about this artist and explore all their works on our platform.
          </p>
          <Link href={`/artists/${song.artist_id || '#'}`}>
            <Button className="bg-secondary hover:bg-secondary/90 text-primary font-semibold">
              Visit Artist Profile
            </Button>
          </Link>
        </div>
        </div>
      </div>
    </div>
  )
}
