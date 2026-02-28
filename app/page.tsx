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
    console.error('Songs fetch error:', error)
    return []
  }

  console.log("Raw songs:", songs)
  console.log("Songs count:", songs?.length || 0)

  return songs || []
}

async function getFeaturedArtists() {
  const supabase = await createClient()
  
  const { data: artists, error } = await supabase
    .from('artists')
    .select('*')
    .eq('verified_status', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return artists || []
}

async function getUpcomingEvents() {
  const supabase = await createClient()
  
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })
    .limit(6)

  if (error) {
    console.error('Events fetch error:', error)
    return []
  }

  console.log("Raw events:", events)
  console.log("Events count:", events?.length || 0)

  return events || []
}

async function getLatestNews() {
  const supabase = await createClient()
  
  const { data: news, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('News fetch error:', error)
    return []
  }

  console.log("Raw news:", news)
  console.log("News count:", news?.length || 0)

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
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary via-primary to-primary/80 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-72 h-72 bg-secondary/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance">
                  Elevating <span className="text-secondary">Gospel Music</span> in Rwanda
                </h1>
                <p className="text-lg md:text-xl text-gray-100 text-balance">
                  Discover authentic gospel lyrics, connect with talented artists, and access professional music production services.
                </p>
              </div>

              <form action="/search" className="flex gap-2 mt-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    name="q"
                    placeholder="Search songs or artists..."
                    className="pl-10 py-3 rounded-lg text-primary placeholder-gray-400 border-secondary/30 focus:border-secondary"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-secondary hover:bg-secondary/90 text-primary font-semibold px-8"
                >
                  Search
                </Button>
              </form>

              <div className="flex gap-4 pt-4">
                <Link href="/lyrics">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Explore Lyrics
                  </Button>
                </Link>
                <Link href="/artists">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Find Artists
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="relative w-full h-96 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center">
                <Music className="w-32 h-32 text-secondary/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Songs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-2">Latest Songs</h2>
              <p className="text-muted-foreground">Newest gospel songs added recently</p>
            </div>
            <Link href="/lyrics">
              <Button variant="outline">View All</Button>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-2">Featured Artists</h2>
              <p className="text-muted-foreground">Talented gospel musicians from Rwanda</p>
            </div>
            <Link href="/artists">
              <Button variant="outline">View All</Button>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-2">Latest Events</h2>
              <p className="text-muted-foreground">Recently added gospel events and activities</p>
            </div>
            <Link href="/events">
              <Button variant="outline">View All Events</Button>
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
      <section className="bg-muted/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional studio services to help your music reach the world
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
