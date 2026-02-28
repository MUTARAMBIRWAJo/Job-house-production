import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, MapPin, Users, Ticket } from 'lucide-react'
import Image from 'next/image'
import { isValidImageUrl } from '@/lib/utils/image-validation'

interface Event {
  id: string
  slug: string
  title: string
  description: string
  event_date: string
  location: string
  image_url: string
  status: string
  ticket_price: number
  capacity: number
  created_at: string
}

async function getEventBySlug(slug: string): Promise<Event | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error || !data) return null
  return data as Event
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const event = await getEventBySlug(params.slug)
  
  if (!event) {
    return { title: 'Event Not Found' }
  }

  return {
    title: event.title,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: event.image_url ? [event.image_url] : [],
    },
  }
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = await getEventBySlug(params.slug)

  if (!event) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="pt-4">
        <Link href="/events-ssr" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
          {/* Image */}
          <div className="flex items-center justify-center">
            {event.image_url && isValidImageUrl(event.image_url) ? (
              <div className="relative w-full h-64 md:h-96">
                <Image
                  src={event.image_url}
                  alt={event.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center">
                <Calendar className="w-24 h-24 text-primary-foreground opacity-50" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-6 flex flex-col justify-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {event.title}
              </h1>
            </div>

            {/* Event Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-semibold text-foreground">{formatDate(event.event_date)}</p>
                  <p className="text-sm text-muted-foreground">{formatTime(event.event_date)}</p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold text-foreground">{event.location}</p>
                  </div>
                </div>
              )}

              {event.capacity && (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-semibold text-foreground">{event.capacity} attendees</p>
                  </div>
                </div>
              )}

              {event.ticket_price !== null && (
                <div className="flex items-center gap-3">
                  <Ticket className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ticket Price</p>
                    <p className="font-semibold text-foreground">
                      {event.ticket_price === 0 ? 'Free' : `$${event.ticket_price}`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button className="bg-secondary hover:bg-secondary/90">
                Get Tickets
              </Button>
              <Button variant="outline">
                Share Event
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      {event.description && (
        <section className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">About This Event</h2>
              <div className="whitespace-pre-wrap text-foreground leading-relaxed text-lg">
                {event.description}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Don't Miss This Event
          </h2>
          <p className="text-muted-foreground text-lg">
            Register now and join us for this amazing gospel experience.
          </p>
          <div className="flex gap-4">
            <Button className="bg-secondary hover:bg-secondary/90">
              <Ticket className="w-4 h-4 mr-2" />
              Get Tickets
            </Button>
            <Button variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
