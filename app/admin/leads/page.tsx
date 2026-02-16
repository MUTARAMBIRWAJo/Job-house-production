'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StudioLead {
  id: string
  artist_name: string
  email: string
  phone?: string
  service_type: string
  budget?: number | null
  status: string
  priority: string
  created_at: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<StudioLead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<StudioLead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    filterAndSortLeads()
  }, [leads, searchTerm, statusFilter, priorityFilter, sortBy])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/leads')
      if (res.ok) {
        const data = await res.json()
        setLeads(data.leads || [])
      }
    } catch (error) {
      console.error('[v0] Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortLeads = () => {
    let filtered = [...leads]

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (lead) =>
          lead.artist_name.toLowerCase().includes(term) ||
          lead.email.toLowerCase().includes(term)
      )
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((lead) => lead.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter) {
      filtered = filtered.filter((lead) => lead.priority === priorityFilter)
    }

    // Sort
    if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    setFilteredLeads(filtered)
    setCurrentPage(1)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 font-bold'
      case 'medium': return 'text-orange-600 font-medium'
      case 'low': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatBudget = (budget: number | null | undefined) => {
    if (!budget) return 'N/A'
    return `RWF ${budget.toLocaleString()}`
  }

  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-secondary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading leads...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Studio Leads</h1>
        <p className="text-muted-foreground mt-2">
          Manage and track all studio service inquiries
        </p>
      </div>

      {/* Filters */}
      <Card className="border-secondary/20">
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter || ''}
              onChange={(e) => setPriorityFilter(e.target.value || null)}
              className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            >
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {paginatedLeads.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
              {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length}
            </span>
            {(searchTerm || statusFilter || priorityFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter(null)
                  setPriorityFilter(null)
                }}
                className="text-secondary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="border-secondary/20 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">
            All Leads ({filteredLeads.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedLeads.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No leads found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Desktop View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                        Project Type
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                        Budget
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                        Priority
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                        Created
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLeads.map((lead) => (
                      <tr key={lead.id} className="border-b border-border hover:bg-secondary/5 transition-colors">
                        <td className="py-3 px-4 text-sm font-medium text-foreground">
                          {lead.artist_name}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {lead.email}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {lead.service_type}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {formatBudget(lead.budget)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              lead.status
                            )}`}
                          >
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-sm font-medium ${getPriorityColor(lead.priority)}`}>
                            {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {formatDate(lead.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          <Link href={`/admin/leads/${lead.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-secondary hover:bg-secondary/10"
                            >
                              View
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="lg:hidden space-y-4">
                {paginatedLeads.map((lead) => (
                  <Link key={lead.id} href={`/admin/leads/${lead.id}`}>
                    <div className="p-4 border border-border rounded-lg hover:border-secondary/50 transition-colors cursor-pointer">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">
                              {lead.artist_name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {lead.email}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                              lead.status
                            )}`}
                          >
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>
                            <p className="font-medium text-foreground">
                              {lead.service_type}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-foreground">
                              {formatBudget(lead.budget)}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                            Priority: {lead.priority.toUpperCase()}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(lead.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={currentPage === pageNum ? 'bg-secondary hover:bg-secondary/90' : ''}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
