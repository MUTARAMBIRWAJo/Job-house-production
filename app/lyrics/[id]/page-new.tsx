import Link from 'next/link'
import { ArrowLeft, Eye, User, Globe, Share2, Copy, Check, Music, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Song, ChordSheet } from '@/types'
import ChordSheetComponent from '@/components/ChordSheet'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

// Server-side data fetching
async function getSong(id: string) {
  const supabase = await createClient()
  
  const { data: song, error } = await supabase
    .from('songs')
    .select(`
      *,
      artists (
        id,
        name,
        slug,
        is_verified,
        image_url
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching song:', error)
    return null
  }

  return song
}

async function getChordSheets(songId: string) {
  const supabase = await createClient()
  
  const { data: chordSheets, error } = await supabase
    .from('chord_sheets')
    .select('*')
    .eq('song_id', songId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching chord sheets:', error)
    return []
  }

  return chordSheets || []
}

async function incrementPlayCount(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('songs')
    .update({ play_count: (await supabase.from('songs').select('play_count').eq('id', id).single()).data?.play_count || 0 + 1 })
    .eq('id', id)

  if (error) {
    console.error('Error incrementing play count:', error)
  }
}

export default async function SongDetailPage({
  params
}: {
  params: { id: string }
}) {
  const songId = params.id
  
  const [song, chordSheets] = await Promise.all([
    getSong(songId),
    getChordSheets(songId)
  ])

  if (!song) {
    notFound()
  }

  // Increment play count
  await incrementPlayCount(songId)

  console.log('Song detail page - Song fetched:', song.title, 'Chord sheets:', chordSheets.length)

  const hasChordSheets = chordSheets.length > 0
  const activeTab = hasChordSheets ? 'chords' : 'lyrics'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/lyrics">
            <Button variant="outline" className="mb-6 border-white text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lyrics
            </Button>
          </Link>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{song.title}</h1>
            <div className="flex items-center gap-4 text-gray-200">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {song.artist_name}
              </span>
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {song.play_count || 0} views
              </span>
              {song.language && (
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {song.language}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl">
          <Tabs value={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
              {hasChordSheets && (
                <TabsTrigger value="chords">Chord Sheets ({chordSheets.length})</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="lyrics" className="mt-6">
              <div className="bg-card rounded-lg p-8 border border-border">
                <div className="prose prose-lg max-w-none">
                  <pre className="whitespace-pre-wrap font-mono text-foreground leading-relaxed">
                    {song.lyrics || 'No lyrics available for this song.'}
                  </pre>
                </div>
                
                <div className="flex gap-4 mt-8 pt-6 border-t border-border">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Copy className="w-4 h-4" />
                    Copy Lyrics
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {hasChordSheets && (
              <TabsContent value="chords" className="mt-6">
                <div className="space-y-6">
                  {chordSheets.map((chordSheet) => (
                    <div key={chordSheet.id} className="bg-card rounded-lg p-6 border border-border">
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold text-foreground">{chordSheet.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Key: {chordSheet.key_signature}</span>
                          <span>Tempo: {chordSheet.tempo}</span>
                          <span>Time: {chordSheet.time_signature}</span>
                          <span>Difficulty: {chordSheet.difficulty_level}</span>
                        </div>
                      </div>
                      <ChordSheetComponent chordSheet={chordSheet} />
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
