'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      setUsers(data || [])
    } catch (err: any) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)

      if (error) throw error
      setUsers(users.filter(u => u.id !== id))
    } catch (err: any) {
      console.error('Failed to delete user:', err)
    }
  }

  const handleUpdateRole = async (id: string, newRole: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', id)

      if (error) throw error

      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
    } catch (err: any) {
      console.error('Failed to update user role:', err)
    }
  }

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Platform Users</h1>
          </div>
          <p className="text-muted-foreground">Manage platform users and roles</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Verified</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-right p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user: any) => (
                    <tr key={user.id} className="border-b hover:bg-accent">
                      <td className="p-2">
                        <p className="font-medium">{user.full_name || 'N/A'}</p>
                      </td>
                      <td className="p-2 text-sm">{user.email}</td>
                      <td className="p-2">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                          className="p-1 border rounded text-sm bg-background"
                        >
                          <option value="customer">Customer</option>
                          <option value="artist">Artist</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status || 'Active'}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge variant={user.is_verified ? 'default' : 'outline'}>
                          {user.is_verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="p-2 text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-2 text-right">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
