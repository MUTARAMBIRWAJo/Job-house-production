'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Globe, Instagram, Users, Music } from 'lucide-react'
import SongCard from '@/components/SongCard'
import VerifiedBadge from '@/components/VerifiedBadge'
import ArtistPromotion from '@/components/ArtistPromotion'
import { Button } from '@/components/ui/button'
import { Artist, Song } from '@/types'

export default function ArtistDetailPage() {
  const params = useParams()
  const router = useRouter()
  const artistId = params.id as string

  const [artist, setArtist] = useState<Artist | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (artistId) {
      fetchArtistData()
    }
  }, [artistId])

  const fetchArtistData = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/artists/${artistId}`)

      if (!res.ok) {
        throw new Error('Failed to fetch artist')
      }

      const data = await res.json()
      setArtist(data.data)
      setSongs(data.data.songs || [])
    } catch (error) {
      console.error('[v0] Error fetching artist data:', error)
      setArtist(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
          <p className="text-muted-foreground">Loading artist profile...</p>
        </div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Artist Not Found</h1>
          <Link href="/artists">
            <Button variant="outline">Back to Artists</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/artists">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Artists
            </Button>
          </Link>
        </div>
      </div>

      {/* Artist Hero Section */}
      <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            {/* Artist Image */}
            <div className="md:col-span-1 flex justify-center">
              <div className="w-64 h-64 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Users className="w-32 h-32 text-secondary/30" />
              </div>
            </div>

            {/* Artist Info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{artist.name}</h1>
                  {artist.verified && <VerifiedBadge verified={artist.verified} />}
                </div>
                <p className="text-lg text-gray-200">{artist.genre}</p>
              </div>

              <p className="text-gray-100 text-lg leading-relaxed max-w-2xl">{artist.bio}</p>

              {/* Contact & Social */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  {artist.email && (
                    <a
                      href={`mailto:${artist.email}`}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">Email</span>
                    </a>
                  )}
                  {artist.phone && (
                    <a
                      href={`tel:${artist.phone}`}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">Call</span>
                    </a>
                  )}
                  {artist.website && (
                    <a
                      href={`https://${artist.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">Website</span>
                    </a>
                  )}
                </div>

                {/* Social Media */}
                {artist.social_links && (
                  <div className="flex gap-3">
                    {artist.social_links.instagram && (
                      <a
                        href={`https://instagram.com/${artist.social_links.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {artist.social_links.facebook && (
                      <a
                        href={`https://facebook.com/${artist.social_links.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <span className="w-5 h-5">f</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Songs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <Music className="w-6 h-6 text-secondary" />
            <h2 className="text-3xl font-bold text-foreground">Featured Songs</h2>
            <span className="ml-auto text-muted-foreground">{songs.length} songs</span>
          </div>

          {songs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {songs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <Music className="w-16 h-16 mx-auto text-muted/50 mb-4" />
              <p className="text-muted-foreground">No songs available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Collaboration CTA */}
      <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-8 max-w-4xl mx-auto mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">Interested in Collaboration?</h3>
        <p className="text-muted-foreground mb-4">
          Contact {artist.name} through our collaboration platform or visit their contact information above.
        </p>
        <Link href="/studio">
          <Button className="bg-secondary hover:bg-secondary/90 text-primary font-semibold">
            Explore Collaboration Services
          </Button>
        </Link>
      </div>

      {/* Artist Promotion */}
      {artist && (
        <div className="bg-gradient-to-r from-primary/10 to-background border border-primary/20 rounded-xl p-8 max-w-4xl mx-auto mb-20">
          <h3 className="text-2xl font-bold text-foreground mb-2">Promote This Artist</h3>
          <p className="text-muted-foreground mb-6">
            Increase visibility and reach more fans with our promotion packages
          </p>
          <ArtistPromotion 
            artistId={artist.id}
            artistName={artist.name}
            onPromotionRequested={() => {
              // Optional: Show success message or redirect
            }}
          />
        </div>
      )}
    </div>
  )
}
