'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Trash2, Edit, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

export default function EditorNewsPage() {
  const [loading, setLoading] = useState(true)
  const [articles, setArticles] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })

      setArticles(data || [])
    } catch (err: any) {
      console.error('Failed to fetch articles:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id)

      if (error) throw error
      setArticles(articles.filter(a => a.id !== id))
    } catch (err: any) {
      console.error('Failed to delete article:', err)
    }
  }

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/editor">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Manage News</h1>
          </div>
          <p className="text-muted-foreground">Create and manage news articles</p>
        </div>
        <Link href="/dashboard/editor/news/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Article
          </Button>
        </Link>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Articles ({filteredArticles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredArticles.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No articles found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Featured</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-right p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((article: any) => (
                    <tr key={article.id} className="border-b hover:bg-accent">
                      <td className="p-2">
                        <div>
                          <p className="font-medium">{article.title}</p>
                          <p className="text-sm text-muted-foreground">{article.slug}</p>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                          {article.status}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge variant={article.is_featured ? 'default' : 'outline'}>
                          {article.is_featured ? 'Featured' : 'Regular'}
                        </Badge>
                      </td>
                      <td className="p-2 text-sm text-muted-foreground">
                        {new Date(article.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/editor/news/${article.id}/edit`}>
                            <Button size="sm" variant="outline" className="gap-1">
                              <Edit className="w-3 h-3" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1"
                            onClick={() => handleDelete(article.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </Button>
                        </div>
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
