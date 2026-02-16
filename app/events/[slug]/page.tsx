'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Users, Phone, Mail, Video, Mic, Clock, Ticket, Share2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Event } from '@/lib/types'

export default function EventDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRegistration, setShowRegistration] = useState(false)
  const [copied, setCopied] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    if (slug) {
      fetchEventData()
    }
  }, [slug])

  const fetchEventData = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/events/${slug}`)
      
      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Unknown error')
        console.error('[v0] Error fetching event:', {
          status: res.status,
          statusText: res.statusText,
          error: errorText
        })
        setEvent(null)
        return
      }

      const data = await res.json()
      setEvent(data.data)
    } catch (error) {
      console.error('[v0] Error fetching event:', error)
      setEvent(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegistering(true)

    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: event?.id,
          ...registrationForm
        })
      })

      if (res.ok) {
        setRegistrationSuccess(true)
        setRegistrationForm({ name: '', email: '', phone: '' })
        setTimeout(() => {
          setShowRegistration(false)
          setRegistrationSuccess(false)
        }, 3000)
      } else {
        const error = await res.json()
        alert(error.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setRegistering(false)
    }
  }

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: `Check out "${event?.title}" - ${event?.event_type} in ${event?.city}`,
        url,
      })
    } else {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
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

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'concert': return 'bg-purple-100 text-purple-800'
      case 'crusade': return 'bg-blue-100 text-blue-800'
      case 'conference': return 'bg-green-100 text-green-800'
      case 'workshop': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const isEventPast = (dateString: string) => {
    return new Date(dateString) < new Date()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Event Not Found</h1>
          <Link href="/events">
            <Button variant="outline">Back to Events</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isPast = isEventPast(event.event_date)

  return (
    <div className="min-h-screen">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/events">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>

      {/* Event Hero */}
      <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge className={getEventTypeColor(event.event_type)} mb-4>
                  {event.event_type}
                </Badge>
                <h1 className="text-5xl font-bold leading-tight text-balance">{event.title}</h1>
                {event.description && (
                  <p className="text-lg text-gray-100 text-balance">
                    {event.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Event
                    </>
                  )}
                </Button>

                {!isPast && (
                  <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
                    <DialogTrigger asChild>
                      <Button className="bg-secondary hover:bg-secondary/90 text-primary font-semibold">
                        <Users className="w-4 h-4 mr-2" />
                        Register Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Register for Event</DialogTitle>
                        <DialogDescription>
                          Join us for "{event.title}" - {formatDate(event.event_date)}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {registrationSuccess ? (
                        <div className="text-center py-8">
                          <Check className="w-16 h-16 mx-auto mb-4 text-green-600" />
                          <h3 className="text-xl font-semibold mb-2">Registration Successful!</h3>
                          <p className="text-muted-foreground">
                            We've received your registration. See you at the event!
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleRegistration} className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Name *</label>
                            <Input
                              required
                              value={registrationForm.name}
                              onChange={(e) => setRegistrationForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Your full name"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Email</label>
                            <Input
                              type="email"
                              value={registrationForm.email}
                              onChange={(e) => setRegistrationForm(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="your@email.com"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Phone</label>
                            <Input
                              type="tel"
                              value={registrationForm.phone}
                              onChange={(e) => setRegistrationForm(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="+250 7xx xxx xxx"
                            />
                          </div>
                          <div className="flex gap-3 pt-4">
                            <Button type="submit" disabled={registering} className="flex-1">
                              {registering ? 'Registering...' : 'Complete Registration'}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setShowRegistration(false)}>
                              Cancel
                            </Button>
                          </div>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                )}

                {(event.needs_audio_coverage || event.needs_video_coverage) && (
                  <Link href="/studio?service=event-coverage">
                    <Button variant="outline" className="border-white text-white hover:bg-white/10">
                      <Video className="w-4 h-4 mr-2" />
                      Offer Coverage
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              {event.poster_image ? (
                <div className="relative w-full h-96 rounded-2xl overflow-hidden">
                  <img 
                    src={event.poster_image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-96 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center">
                  <Calendar className="w-32 h-32 text-white/30" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Information */}
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold">Date & Time</h4>
                      <p className="text-muted-foreground">
                        {formatDate(event.event_date)}
                        {event.event_time && ` at ${event.event_time}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold">Venue</h4>
                      <p className="text-muted-foreground">
                        {event.venue}
                        {event.venue_address && <br />}
                        {event.venue_address}
                        {event.city && <br />}
                        {event.city}, {event.country}
                      </p>
                    </div>
                  </div>

                  {event.organizer_name && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold">Organizer</h4>
                        <p className="text-muted-foreground">{event.organizer_name}</p>
                        {event.organizer_phone && (
                          <p className="text-sm flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {event.organizer_phone}
                          </p>
                        )}
                        {event.organizer_email && (
                          <p className="text-sm flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {event.organizer_email}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Ticket className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold">Tickets</h4>
                      <p className="text-muted-foreground">
                        {event.is_free ? 'Free Entry' : `RWF ${event.ticket_price}`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Production Services CTA */}
            {(event.needs_audio_coverage || event.needs_video_coverage) && (
              <Card className="border-secondary/20 bg-secondary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Production Services Needed
                  </CardTitle>
                  <CardDescription>
                    This event is looking for professional audio and video coverage services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3 mb-4">
                    {event.needs_audio_coverage && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Mic className="w-3 h-3" />
                        Audio Coverage
                      </Badge>
                    )}
                    {event.needs_video_coverage && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        Video Coverage
                      </Badge>
                    )}
                  </div>
                  <Link href="/studio?service=event-coverage">
                    <Button className="w-full">
                      Offer Production Services
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!isPast && (
                  <Button 
                    onClick={() => setShowRegistration(true)}
                    className="w-full"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Register for Event
                  </Button>
                )}
                
                <Button variant="outline" onClick={handleShare} className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Event
                </Button>

                {(event.needs_audio_coverage || event.needs_video_coverage) && (
                  <Link href="/studio?service=event-coverage">
                    <Button variant="outline" className="w-full">
                      <Video className="w-4 h-4 mr-2" />
                      Offer Coverage
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Event Status */}
            <Card>
              <CardHeader>
                <CardTitle>Event Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={isPast ? "secondary" : "default"}>
                      {isPast ? 'Past Event' : 'Upcoming'}
                    </Badge>
                  </div>
                  
                  {event.is_featured && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Featured</span>
                      <Badge variant="secondary">Yes</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
