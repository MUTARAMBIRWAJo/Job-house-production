'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Filter, Users, Music, Video, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Event, EventType } from '@/lib/types'

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'concert', label: 'Concert' },
  { value: 'crusade', label: 'Crusade' },
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' }
]

const CITIES = ['All', 'Kigali', 'Musanze', 'Rubavu', 'Butare', 'Gitarama']

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState('')
  const [showUpcoming, setShowUpcoming] = useState(true)
  const [showNeedsCoverage, setShowNeedsCoverage] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredEvents = events.filter((event: Event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    fetchEvents(0)
  }, [selectedType, selectedCity, showUpcoming, showNeedsCoverage])

  const fetchEvents = async (newOffset: number, limit: number = 24) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: newOffset.toString(),
      })

      if (selectedType && selectedType !== 'all') params.append('type', selectedType)
      if (selectedCity && selectedCity !== 'all') params.append('city', selectedCity)
      if (showUpcoming) params.append('upcoming', 'true')
      if (showNeedsCoverage) params.append('needs_coverage', 'true')

      const res = await fetch(`/api/events?${params}`)
      if (res.ok) {
        const data = await res.json()
        console.log('Events API response:', data)
        if (newOffset === 0) {
          setEvents(data.data || [])
        } else {
          setEvents((prev) => [...prev, ...(data.data || [])])
        }
        setHasMore((data.data || []).length === limit)
      } else {
        console.error('Events API error:', res.status, res.statusText)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    const newOffset = offset + 24
    setOffset(newOffset)
    fetchEvents(newOffset)
  }

  const loadAll = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: '1000', // Load a large number to get all events
        offset: '0',
      })

      if (selectedType && selectedType !== 'all') params.append('type', selectedType)
      if (selectedCity && selectedCity !== 'all') params.append('city', selectedCity)
      if (showUpcoming) params.append('upcoming', 'true')
      if (showNeedsCoverage) params.append('needs_coverage', 'true')

      const res = await fetch(`/api/events?${params}`)
      if (res.ok) {
        const data = await res.json()
        console.log('Load all events response:', data)
        setEvents(data.data || [])
        setHasMore(false)
      } else {
        console.error('Load all events error:', res.status, res.statusText)
      }
    } catch (error) {
      console.error('Error loading all events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEventTypeIcon = (type: EventType) => {
    switch (type) {
      case 'concert': return Music
      case 'crusade': return Users
      case 'conference': return Mic
      case 'workshop': return Video
      default: return Calendar
    }
  }

  const getEventTypeColor = (type: EventType) => {
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isEventPast = (dateString: string) => {
    return new Date(dateString) < new Date()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Gospel Events</h1>
            <p className="text-lg text-muted-foreground">
              Discover gospel concerts, crusades, conferences, and workshops near you
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="lg:col-span-2"
              />
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {CITIES.filter(city => city !== 'All').map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={showUpcoming ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowUpcoming(!showUpcoming)}
                  className="flex-1"
                >
                  Upcoming
                </Button>
                <Button
                  variant={showNeedsCoverage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowNeedsCoverage(!showNeedsCoverage)}
                  className="flex-1"
                >
                  Needs Coverage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-4 pb-16">
        {loading && events.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-5/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Events Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or check back later for new events.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const EventTypeIcon = getEventTypeIcon(event.event_type)
                const eventTypeColor = getEventTypeColor(event.event_type)
                const isPast = isEventPast(event.event_date)
                
                return (
                  <Card key={event.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${isPast ? 'opacity-75' : ''}`}>
                    {event.poster_image ? (
                      <div className="h-48 bg-muted relative">
                        <img 
                          src={event.poster_image} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        {isPast && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="secondary">Past Event</Badge>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <EventTypeIcon className="w-16 h-16 text-primary/30" />
                      </div>
                    )}
                    
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <Badge className={`${eventTypeColor} mb-2`}>{event.event_type}</Badge>
                          <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                        </div>
                        {event.is_featured && (
                          <Badge variant="secondary">Featured</Badge>
                        )}
                      </div>
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
                                Audio Coverage
                              </Badge>
                            )}
                            {event.needs_video_coverage && (
                              <Badge variant="outline" className="text-xs">
                                <Video className="w-3 h-3 mr-1" />
                                Video Coverage
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Link href={`/events/${event.slug}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              View Details
                            </Button>
                          </Link>
                          
                          {(event.needs_audio_coverage || event.needs_video_coverage) && (
                            <Link href="/studio?service=event-coverage" className="flex-1">
                              <Button size="sm" className="w-full">
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

            {hasMore && (
              <div className="text-center mt-12 space-y-4">
                <div className="flex justify-center gap-4">
                  <Button onClick={loadMore} variant="outline" size="lg">
                    Load More Events
                  </Button>
                  <Button onClick={loadAll} variant="default" size="lg" className="bg-primary hover:bg-primary/90">
                    Load All Events
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Showing {events.length} of {events.length + (hasMore ? 'more' : 'all')} events
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
