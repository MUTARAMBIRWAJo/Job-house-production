'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Calendar, MapPin, Users, Edit, Trash2, Clock, Eye, Video, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { Event, Profile } from '@/lib/types'

interface EventManagementProps {
  user: Profile
}

export function EventManagement({ user }: EventManagementProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'concert',
    event_date: '',
    event_time: '18:00',
    venue: '',
    venue_address: '',
    city: '',
    organizer_name: '',
    organizer_phone: '',
    organizer_email: '',
    needs_audio_coverage: false,
    needs_video_coverage: false,
    is_published: false
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const supabase = createClient()
      let query = supabase.from('events').select('*')
      
      if (user.role === 'artist') {
        query = query.eq('organizer_id', user.id)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching events:', error)
      } else {
        setEvents(data || [])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const supabase = createClient()
      const eventData = {
        ...formData,
        organizer_id: user.id,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
        is_free: true,
        ticket_price: 0,
        country: 'Rwanda'
      }

      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single()

      if (error) {
        console.error('Error creating event:', error)
        alert('Failed to create event. Please try again.')
      } else {
        setEvents(prev => [data, ...prev])
        setShowCreateDialog(false)
        resetForm()
        alert('Event created successfully!')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent) return

    setSubmitting(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('events')
        .update({
          title: formData.title,
          description: formData.description,
          event_type: formData.event_type,
          event_date: formData.event_date,
          event_time: formData.event_time,
          venue: formData.venue,
          venue_address: formData.venue_address,
          city: formData.city,
          organizer_name: formData.organizer_name,
          organizer_phone: formData.organizer_phone,
          organizer_email: formData.organizer_email,
          needs_audio_coverage: formData.needs_audio_coverage,
          needs_video_coverage: formData.needs_video_coverage
        })
        .eq('id', selectedEvent.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating event:', error)
        alert('Failed to update event. Please try again.')
      } else {
        setEvents(prev => prev.map(event => 
          event.id === selectedEvent.id ? { ...event, ...data } : event
        ))
        setShowEditDialog(false)
        setSelectedEvent(null)
        alert('Event updated successfully!')
      }
    } catch (error) {
      console.error('Error updating event:', error)
      alert('Failed to update event. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) {
        console.error('Error deleting event:', error)
        alert('Failed to delete event. Please try again.')
      } else {
        setEvents(prev => prev.filter(event => event.id !== eventId))
        alert('Event deleted successfully!')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Failed to delete event. Please try again.')
    }
  }

  const openEditDialog = (event: Event) => {
    setSelectedEvent(event)
    setFormData({
      title: event.title,
      description: event.description || '',
      event_type: event.event_type,
      event_date: event.event_date,
      event_time: event.event_time || '18:00',
      venue: event.venue,
      venue_address: event.venue_address || '',
      city: event.city || '',
      organizer_name: event.organizer_name || '',
      organizer_phone: event.organizer_phone || '',
      organizer_email: event.organizer_email || '',
      needs_audio_coverage: event.needs_audio_coverage || false,
      needs_video_coverage: event.needs_video_coverage || false,
      is_published: event.is_published || false
    })
    setShowEditDialog(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_type: 'concert',
      event_date: '',
      event_time: '18:00',
      venue: '',
      venue_address: '',
      city: '',
      organizer_name: '',
      organizer_phone: '',
      organizer_email: '',
      needs_audio_coverage: false,
      needs_video_coverage: false,
      is_published: false
    })
  }

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.city || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Events</h1>
          <p className="text-muted-foreground">Manage your gospel events and gatherings</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Add a new gospel event to your calendar
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Event Title *</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your event..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Event Type *</label>
                  <Select value={formData.event_type} onValueChange={(value) => setFormData(prev => ({ ...prev, event_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concert">Concert</SelectItem>
                      <SelectItem value="crusade">Crusade</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Event Date *</label>
                  <Input
                    type="date"
                    required
                    value={formData.event_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Event Time</label>
                  <Input
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_time: e.target.value }))}
                    placeholder="18:00"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">City *</label>
                  <Input
                    required
                    value={formData.city || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Kigali"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Venue *</label>
                <Input
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                  placeholder="Event venue name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Venue Address</label>
                <Input
                  value={formData.venue_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, venue_address: e.target.value }))}
                  placeholder="Full venue address"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Organizer Name *</label>
                  <Input
                    required
                    value={formData.organizer_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizer_name: e.target.value }))}
                    placeholder="Your name or organization"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Organizer Phone</label>
                  <Input
                    type="tel"
                    value={formData.organizer_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizer_phone: e.target.value }))}
                    placeholder="+250 7xx xxx xxx"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Organizer Email</label>
                <Input
                  type="email"
                  value={formData.organizer_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, organizer_email: e.target.value }))}
                  placeholder="organizer@example.com"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Coverage Needs</label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="audio_coverage"
                      checked={formData.needs_audio_coverage}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, needs_audio_coverage: Boolean(checked) }))}
                    />
                    <label htmlFor="audio_coverage" className="flex items-center gap-2">
                      <Mic className="w-4 h-4" />
                      Need Audio Coverage
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="video_coverage"
                      checked={formData.needs_video_coverage}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, needs_video_coverage: Boolean(checked) }))}
                    />
                    <label htmlFor="video_coverage" className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Need Video Coverage
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>
                Update event details
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleEditEvent} className="space-y-4">
              {/* Same form fields as create dialog */}
              <div>
                <label className="text-sm font-medium">Event Title *</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your event..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update Event'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Badge variant="secondary" className="px-3 py-1">
          {filteredEvents.length} events
        </Badge>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-muted/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? 'No events found' : 'No events yet'}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? 'Try adjusting your search terms' 
              : 'Create your first event to get started'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge className={getEventTypeColor(event.event_type)}>
                        {event.event_type}
                      </Badge>
                      {isEventPast(event.event_date) && (
                        <Badge variant="secondary">Past Event</Badge>
                      )}
                    </CardDescription>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(event)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(event.event_date).toLocaleDateString()}
                    </span>
                    {event.event_time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.event_time}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}