'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { ArrowLeft, Search } from 'lucide-react'
import Link from 'next/link'
import SongCard from '@/components/SongCard'
import ArtistCard from '@/components/ArtistCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Song, Artist, NewsArticle } from '@/types'

function SearchResultsContent() {
      const searchParams = useSearchParams()
      const router = useRouter()
      const query = searchParams.get('q') || ''

      const [songs, setSongs] = useState<Song[]>([])
      const [artists, setArtists] = useState<Artist[]>([])
      const [news, setNews] = useState<NewsArticle[]>([])
      const [loading, setLoading] = useState(true)
      const [searchInput, setSearchInput] = useState(query)

      useEffect(() => {
            if (query) {
                  performSearch(query)
            }
      }, [query])

      const performSearch = async (searchTerm: string) => {
            try {
                  setLoading(true)
                  const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`)
                  if (!response.ok) {
                        throw new Error('Search failed')
                  }
                  const data = await response.json()
                  setSongs(data.songs || [])
                  setArtists(data.artists || [])
                  setNews(data.news || [])
            } catch (error) {
                  console.error('Search error:', error)
                  setSongs([])
                  setArtists([])
                  setNews([])
            } finally {
                  setLoading(false)
            }
      }

      const handleSearch = (e: React.FormEvent) => {
            e.preventDefault()
            if (searchInput.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`)
            }
      }

      const clearSearch = () => {
            setSearchInput('')
            setSongs([])
            setArtists([])
            setNews([])
      }

      if (loading) {
            return (
                  <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
            )
      }

      return (
            <div className="container mx-auto px-4 py-8">
                  {/* Search Input */}
                  <div className="mb-8">
                        <form onSubmit={handleSearch} className="flex gap-2">
                              <Link href="/" className="self-center">
                                    <Button type="button" variant="ghost" size="icon">
                                          <ArrowLeft className="h-5 w-5" />
                                    </Button>
                              </Link>
                              <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                          type="search"
                                          placeholder="Search songs, artists, news..."
                                          value={searchInput}
                                          onChange={(e) => setSearchInput(e.target.value)}
                                          className="pl-10"
                                    />
                              </div>
                              <Button type="submit">Search</Button>
                              {query && (
                                    <Button type="button" variant="outline" onClick={clearSearch}>
                                          Clear
                                    </Button>
                              )}
                        </form>
                        {query && (
                              <p className="text-muted-foreground mt-2">
                                    Search results for "{query}"
                              </p>
                        )}
                  </div>

                  {/* Search Results */}
                  {query && (
                        <div className="space-y-8">
                              {/* Songs */}
                              {songs.length > 0 && (
                                    <section>
                                          <h2 className="text-2xl font-bold mb-4">Songs</h2>
                                          <div className="grid gap-4">
                                                {songs.map((song) => (
                                                      <SongCard key={song.id} song={song} />
                                                ))}
                                          </div>
                                    </section>
                              )}

                              {/* Artists */}
                              {artists.length > 0 && (
                                    <section>
                                          <h2 className="text-2xl font-bold mb-4">Artists</h2>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {artists.map((artist) => (
                                                      <ArtistCard key={artist.id} artist={artist} />
                                                ))}
                                          </div>
                                    </section>
                              )}

                              {/* News */}
                              {news.length > 0 && (
                                    <section>
                                          <h2 className="text-2xl font-bold mb-4">News</h2>
                                          <div className="grid gap-4">
                                                {news.map((article) => (
                                                      <Link key={article.id} href={`/news/${article.id}`}>
                                                            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                                                  <h3 className="font-semibold">{article.title}</h3>
                                                                  {article.excerpt && (
                                                                        <p className="text-muted-foreground text-sm mt-1">{article.excerpt}</p>
                                                                  )}
                                                            </div>
                                                      </Link>
                                                ))}
                                          </div>
                                    </section>
                              )}

                              {/* No Results */}
                              {songs.length === 0 && artists.length === 0 && (
                                    <div className="text-center py-12">
                                          <Search className="w-16 h-16 mx-auto text-muted/50 mb-4" />
                                          <h3 className="text-2xl font-semibold mb-2">No results found</h3>
                                          <p className="text-muted-foreground mb-6">
                                                Try searching with different keywords
                                          </p>
                                          <Link href="/">
                                                <Button variant="outline">Go Home</Button>
                                          </Link>
                                    </div>
                              )}
                        </div>
                  )}

                  {/* No Query State */}
                  {!query && (
                        <div className="text-center py-12">
                              <Search className="w-16 h-16 mx-auto text-muted/50 mb-4" />
                              <h3 className="text-2xl font-semibold mb-2">Search our content</h3>
                              <p className="text-muted-foreground mb-6">
                                    Search for songs, artists, news, and more
                              </p>
                              <Link href="/">
                                    <Button variant="outline">Go Home</Button>
                              </Link>
                        </div>
                  )}
            </div>
      )
}

export default function SearchResults() {
      return (
            <Suspense fallback={<div className="min-h-screen bg-background text-foreground p-8">Loading...</div>}>
                  <SearchResultsContent />
            </Suspense>
      )
}
