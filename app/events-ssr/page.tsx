import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Calendar, MapPin } from 'lucide-react'
import Image from 'next/image'

async function getEvents(searchTerm?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('events')
    .select('*')
    .eq('status', 'active')
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })

  if (searchTerm) {
    query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
  }

  const { data } = await query.limit(100)
  return data || []
}

export const metadata = {
  title: 'Events - Job House Production',
  description: 'Upcoming gospel events, concerts, and conferences.',
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const searchTerm = searchParams.q
  const events = await getEvents(searchTerm)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Upcoming Events
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Don't miss our gospel concerts, conferences, and community events.
            </p>
          </div>

          {/* Search */}
          <form action="/events-ssr" method="get" className="flex gap-2 max-w-md">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                name="q"
                placeholder="Search events..."
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

      {/* Events Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {searchTerm ? `Search Results for "${searchTerm}"` : 'All Events'}
          </h2>
          <p className="text-muted-foreground">
            {events.length} event{events.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? 'No events found matching your search.'
                : 'No upcoming events at this time.'}
            </p>
            {searchTerm && (
              <Link href="/events-ssr">
                <Button variant="outline">Clear Search</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: any) => (
              <Link key={event.id} href={`/events/${event.slug}`}>
                <div className="group cursor-pointer h-full">
                  <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                    {event.image_url ? (
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <Calendar className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-secondary transition-colors">
                      {event.title}
                    </h3>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-secondary font-semibold">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
