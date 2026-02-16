'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MessageSquare, Save, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StudioLead {
  id: string
  artist_name: string
  email: string
  phone?: string
  service_type: string
  genre?: string
  budget?: number | null
  description?: string
  timeline?: string
  status: string
  priority: string
  assigned_to?: string | null
  internal_notes?: string | null
  created_at: string
  updated_at: string
}

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.id as string

  const [lead, setLead] = useState<StudioLead | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [internalNotes, setInternalNotes] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchLead()
  }, [leadId])

  const fetchLead = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/leads/${leadId}`)
      if (res.ok) {
        const data = await res.json()
        setLead(data.lead)
        setStatus(data.lead.status)
        setPriority(data.lead.priority)
        setAssignedTo(data.lead.assigned_to || '')
        setInternalNotes(data.lead.internal_notes || '')
      }
    } catch (error) {
      console.error('[v0] Error fetching lead:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          priority,
          assigned_to: assignedTo || null,
          internal_notes: internalNotes || null,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setLead(data.lead)
        setSuccessMessage('Lead updated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('[v0] Error saving lead:', error)
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-orange-100 text-orange-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-secondary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading lead details...</p>
        </div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="p-8">
        <Link href="/admin/leads">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Leads
          </Button>
        </Link>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Lead not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <Link href="/admin/leads">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Leads
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {lead.artist_name}
            </h1>
            <p className="text-muted-foreground mt-2">
              Lead ID: {lead.id}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getPriorityColor(priority)}`}>
              Priority: {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section - Lead Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle className="text-lg">Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Artist Name
                    </label>
                    <p className="text-foreground font-medium">{lead.artist_name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Genre
                    </label>
                    <p className="text-foreground font-medium">{lead.genre || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-secondary hover:underline flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      {lead.email}
                    </a>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Phone
                    </label>
                    {lead.phone ? (
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-secondary hover:underline flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        {lead.phone}
                      </a>
                    ) : (
                      <p className="text-muted-foreground">Not provided</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="font-semibold text-foreground">Project Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Service Type
                    </label>
                    <p className="text-foreground font-medium">{lead.service_type}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Budget
                    </label>
                    <p className="text-foreground font-medium">
                      {lead.budget ? `RWF ${lead.budget.toLocaleString()}` : 'Not specified'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Timeline
                    </label>
                    <p className="text-foreground font-medium">{lead.timeline || 'Not specified'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Description
                  </label>
                  <p className="text-foreground whitespace-pre-wrap text-sm">
                    {lead.description || 'No description provided'}
                  </p>
                </div>
              </div>

              {/* Timestamps */}
              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="font-semibold text-foreground">Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <label className="font-medium text-muted-foreground">Created</label>
                    <p className="text-foreground">{formatDate(lead.created_at)}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="font-medium text-muted-foreground">Last Updated</label>
                    <p className="text-foreground">{formatDate(lead.updated_at)}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-border pt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                <a href={`mailto:${lead.email}`}>
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-semibold">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </a>
                {lead.phone && (
                  <a href={`tel:${lead.phone}`}>
                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-semibold">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </a>
                )}
                {lead.phone && (
                  <a
                    href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Management */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle className="text-lg">Update Lead</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Assigned To */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Assigned To
                </label>
                <Input
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="e.g., James, Sarah"
                  className="border-border focus:ring-secondary"
                />
              </div>

              {/* Internal Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Internal Notes
                </label>
                <Textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Add internal notes for team members..."
                  className="border-border focus:ring-secondary min-h-24 resize-none"
                />
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-secondary hover:bg-secondary/90 text-primary font-semibold"
              >
                {saving ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
