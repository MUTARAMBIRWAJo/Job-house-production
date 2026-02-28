import Link from 'next/link'
import Image from 'next/image'
import { Search, Music, Users, Mic2, Newspaper, Calendar, MapPin, Video, Mic } from 'lucide-react'
import SongCard from '@/components/SongCard'
import ArtistCard from '@/components/ArtistCard'
import WhatsAppButton from '@/components/WhatsAppButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Song, Artist, Event } from '@/types'
import { createClient } from '@/lib/supabase/server'

// Real-time interfaces matching ACTUAL database schema
interface RealTimeSong {
  id: string
  title: string
  lyrics: string
  artist_name: string
  featured_artist: string | null
  language: string
  audio_url: string | null
  cover_image: string | null
  view_count: number
  download_count: number
  duration_seconds: number | null
  created_at: string
  updated_at: string
  chords: any
  key_signature: string | null
  tempo: number | null
  time_signature: string | null
}

interface RealTimeArtist {
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
}

interface RealTimeNews {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  featured: boolean
  featured_image: string | null
  published_date: string
  created_at: string
  updated_at: string
}

interface RealTimeEvent {
  id: string
  title: string
  slug: string
  description: string
  event_type: string
  event_date: string
  event_time: string
  venue: string
  venue_address: string
  city: string
  country: string
  is_free: boolean
  ticket_price: number
  organizer_name: string
  organizer_email: string | null
  organizer_phone: string
  needs_audio_coverage: boolean
  needs_video_coverage: boolean
  is_featured: boolean
  is_published: boolean
  published_at: string
  poster_image: string | null
  created_at: string
  updated_at: string
}

// Server-side data fetching - PUBLIC ACCESS (No authentication required)
async function getFeaturedSongs() {
  const supabase = await createClient()
  
  const { data: songs, error } = await supabase
    .from('songs')
    .select(`
      *,
      artists:artist_id (
        id,
        name,
        slug,
        image_url,
        verified_status
      )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('[v0] Songs fetch error:', error)
    return []
  }

  return songs || []
}

async function getFeaturedArtists() {
  const supabase = await createClient()
  
  const { data: artists, error } = await supabase
    .from('artists')
    .select('*')
    .eq('verified_status', 'verified')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('[v0] Featured artists fetch error:', error)
    return []
  }

  return artists || []
}

async function getUpcomingEvents() {
  const supabase = await createClient()
  
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .in('status', ['upcoming', 'active'])
    .order('event_date', { ascending: true })
    .limit(6)

  if (error) {
    console.error('[v0] Events fetch error:', error)
    return []
  }

  return events || []
}

async function getLatestNews() {
  const supabase = await createClient()
  
  const { data: news, error } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('[v0] News fetch error:', error)
    return []
  }

  return news || []
}

export default async function HomePage() {
  const [songs, artists, events, news] = await Promise.all([
    getFeaturedSongs(),
    getFeaturedArtists(),
    getUpcomingEvents(),
    getLatestNews()
  ])

  console.log('Songs fetched:', songs.length)
  console.log('Artists fetched:', artists.length)
  console.log('Events fetched:', events.length)
  console.log('News fetched:', news.length)

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full">
                  <span className="w-2 h-2 bg-secondary rounded-full"></span>
                  <span className="text-sm font-semibold text-secondary">Gospel Music Platform</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight text-balance">
                  Gospel Music <span className="text-secondary">Excellence</span> Reimagined
                </h1>
                <p className="text-xl text-white/90 text-balance leading-relaxed">
                  Discover authentic gospel lyrics, connect with Rwanda's finest artists, and access world-class music production services.
                </p>
              </div>

              <form action="/search" className="flex gap-3 mt-8 max-w-md">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-4 w-5 h-5 text-white/50" />
                  <Input
                    type="text"
                    name="q"
                    placeholder="Search songs or artists..."
                    className="pl-12 py-3 rounded-xl text-primary placeholder:text-white/40 bg-white/95 focus:bg-white border-0 focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-secondary hover:bg-secondary/90 text-primary font-semibold px-8 rounded-xl"
                >
                  Search
                </Button>
              </form>

              <div className="flex flex-wrap gap-4 pt-6">
                <Link href="/songs">
                  <Button
                    className="bg-white/95 hover:bg-white text-primary font-semibold px-8 rounded-xl"
                  >
                    Explore Songs
                  </Button>
                </Link>
                <Link href="/artists">
                  <Button
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/20 font-semibold px-8 rounded-xl"
                  >
                    Discover Artists
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden md:flex justify-center items-center">
              <div className="relative w-full h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-2xl blur-2xl"></div>
                <div className="relative h-full bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Music className="w-20 h-20 text-secondary/50 mx-auto" />
                    <p className="text-white/60 font-medium">Gospel Music Hub</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Songs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3">Latest Songs</h2>
              <p className="text-lg text-muted-foreground">Discover the newest gospel songs added to our collection</p>
            </div>
            <Link href="/songs">
              <Button variant="outline" className="rounded-xl">View All Songs</Button>
            </Link>
          </div>

          {songs.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No songs available yet</h3>
              <p className="text-muted-foreground">Songs will appear here once added to the database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {songs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3">Featured Artists</h2>
              <p className="text-lg text-muted-foreground">Connect with Rwanda's most talented verified gospel musicians</p>
            </div>
            <Link href="/artists">
              <Button variant="outline" className="rounded-xl">View All Artists</Button>
            </Link>
          </div>

          {artists.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No featured artists yet</h3>
              <p className="text-muted-foreground">Artists will appear here once verified and featured.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3">Upcoming Events</h2>
              <p className="text-lg text-muted-foreground">Don't miss out on the latest gospel music events and gatherings</p>
            </div>
            <Link href="/events-ssr">
              <Button variant="outline" className="rounded-xl">View All Events</Button>
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No events available yet</h3>
              <p className="text-muted-foreground">Events will appear here once added.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => {
                const getEventTypeColor = (type: string) => {
                  switch (type) {
                    case 'concert': return 'bg-purple-100 text-purple-800'
                    case 'crusade': return 'bg-blue-100 text-blue-800'
                    case 'conference': return 'bg-green-100 text-green-800'
                    case 'workshop': return 'bg-orange-100 text-orange-800'
                    default: return 'bg-gray-100 text-gray-800'
                  }
                }

                const formatDate = (dateString: string) => {
                  const date = new Date(dateString)
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                }

                return (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge className={`${getEventTypeColor(event.event_type)} mb-2`}>
                          {event.event_type}
                        </Badge>
                        {event.is_featured && (
                          <Badge variant="secondary">Featured</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {event.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {formatDate(event.event_date)}
                          {event.event_time && ` at ${event.event_time}`}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {event.venue}, {event.city}
                        </div>

                        {(event.needs_audio_coverage || event.needs_video_coverage) && (
                          <div className="flex gap-2">
                            {event.needs_audio_coverage && (
                              <Badge variant="outline" className="text-xs">
                                <Mic className="w-3 h-3 mr-1" />
                                Audio
                              </Badge>
                            )}
                            {event.needs_video_coverage && (
                              <Badge variant="outline" className="text-xs">
                                <Video className="w-3 h-3 mr-1" />
                                Video
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex flex-col gap-2 pt-2">
                          <Link href={`/events/${event.slug}`} className="w-full">
                            <Button variant="outline" size="sm" className="w-full text-xs">
                              View Details
                            </Button>
                          </Link>

                          {(event.needs_audio_coverage || event.needs_video_coverage) && (
                            <Link href="/studio?service=event-coverage" className="w-full">
                              <Button size="sm" className="w-full text-xs">
                                Offer Coverage
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-muted/30 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Professional Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Studio-quality production and comprehensive music services designed to help your gospel music reach audiences worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Mic2,
                title: 'Studio Recording',
                description: 'Professional recording facilities with experienced engineers',
              },
              {
                icon: Music,
                title: 'Music Production',
                description: 'Complete production services from arrangement to mastering',
              },
              {
                icon: Users,
                title: 'Collaboration',
                description: 'Connect with other artists and producers in our community',
              },
            ].map((service, idx) => {
              const Icon = service.icon
              return (
                <div
                  key={idx}
                  className="bg-card rounded-xl p-8 text-center border border-border hover:border-secondary transition-colors"
                >
                  <Icon className="w-12 h-12 mx-auto mb-4 text-secondary" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <Link href="/studio">
                    <Button variant="outline" className="text-secondary border-secondary hover:bg-secondary/10">
                      Learn More
                    </Button>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-2">Latest News</h2>
              <p className="text-muted-foreground">Gospel music updates and industry news</p>
            </div>
            <Link href="/news">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.length === 0 ? (
              <div className="text-center py-12">
                <Newspaper className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No news articles yet</h3>
                <p className="text-muted-foreground">News articles will appear here once published.</p>
              </div>
            ) : (
              news.map((article, idx) => (
                <article
                  key={article.id}
                  className="bg-card rounded-xl overflow-hidden border border-border hover:border-secondary transition-all hover:shadow-lg"
                >
                  <div className="h-48 bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                    <Newspaper className="w-16 h-16 text-secondary/30" />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-secondary font-semibold mb-2">
                      {article.category || 'News'}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{article.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <Link href={`/news/${article.id}`} className="text-secondary font-semibold hover:underline">
                      Read More →
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Share Your Music?</h2>
          <p className="text-lg text-gray-200">
            Join our community of gospel artists and get your music heard by thousands
          </p>
          <Link href="/studio">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-primary font-semibold">
              Get Started with Studio Services
            </Button>
          </Link>
        </div>
      </section>

      {/* General WhatsApp Button */}
      <WhatsAppButton context="general" />
    </div>
  )
}
