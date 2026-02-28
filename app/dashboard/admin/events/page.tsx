import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

async function getEvents() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false })
    .limit(20)
  return data || []
}

export default async function AdminEventsPage() {
  const events = await getEvents()

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard/admin">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Manage Events</h1>
        </div>
        <p className="text-muted-foreground">View and manage all events</p>
      </div>
      <Card>
        <CardHeader><CardTitle>All Events ({events.length})</CardTitle></CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-muted-foreground py-8">No events found</p>
          ) : (
            <div className="space-y-4">
              {events.map((event: any) => (
                <div key={event.id} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
