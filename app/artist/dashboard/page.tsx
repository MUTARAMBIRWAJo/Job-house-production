import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Music, FileText, Users, TrendingUp, Eye, Heart, Download, Settings, LogOut, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { signOut } from '@/lib/auth/actions'

export default async function ArtistDashboardPage() {
      const supabase = await createClient()

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
            redirect('/login')
      }

      const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

      // Only allow artists and admins
      if (!profile || !['artist', 'admin'].includes(profile.role)) {
            redirect('/dashboard')
      }

      // Get artist's songs
      const { data: songs } = await supabase
            .from('songs')
            .select('*')
            .eq('artist_id', profile.artist_id || user.id)
            .order('created_at', { ascending: false })
            .limit(10)

      // Get artist profile info
      const { data: artist } = await supabase
            .from('artists')
            .select('*')
            .eq('id', profile.artist_id || user.id)
            .single()

      // Get total stats
      const { data: totalPlays } = await supabase
            .from('songs')
            .select('play_count')
            .eq('artist_id', profile.artist_id || user.id)

      const totalPlaysCount = totalPlays?.reduce((sum, song) => sum + (song.play_count || 0), 0) || 0

      // Get total likes
      const { data: totalLikes } = await supabase
            .from('song_likes')
            .select('id', { count: 'exact' })
            .eq('artist_id', profile.artist_id || user.id)

      // Get pending studio requests (if artist has studio)
      const { data: studioRequests } = await supabase
            .from('studio_leads')
            .select('*')
            .eq('artist_id', profile.artist_id || user.id)
            .order('created_at', { ascending: false })
            .limit(5)

      return (
            <div className="min-h-screen bg-background">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-8">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                          {artist?.image_url ? (
                                                <img
                                                      src={artist.image_url}
                                                      alt={artist.name}
                                                      className="w-16 h-16 rounded-full object-cover border-4 border-white/20"
                                                />
                                          ) : (
                                                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                                                      <Music className="w-8 h-8" />
                                                </div>
                                          )}
                                          <div>
                                                <h1 className="text-3xl font-bold">
                                                      {artist?.name || profile?.full_name || 'Artist'}
                                                </h1>
                                                <p className="text-gray-200">
                                                      {artist?.genre || 'Music Artist'}
                                                </p>
                                          </div>
                                    </div>
                                    <div className="flex gap-3">
                                          <Button className="bg-secondary hover:bg-secondary/90 text-primary" asChild>
                                                <Link href="/studio">
                                                      <Plus className="w-4 h-4 mr-2" />
                                                      Upload Song
                                                </Link>
                                          </Button>
                                          <form action={signOut}>
                                                <Button variant="outline" className="text-white border-white hover:bg-white/10">
                                                      <LogOut className="w-4 h-4 mr-2" />
                                                      Sign Out
                                                </Button>
                                          </form>
                                    </div>
                              </div>
                        </div>
                  </div>

                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                              <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                          <CardTitle className="text-sm font-medium text-muted-foreground">
                                                Total Plays
                                          </CardTitle>
                                          <Eye className="w-4 h-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                          <div className="text-2xl font-bold">{totalPlaysCount.toLocaleString()}</div>
                                          <p className="text-xs text-muted-foreground">Lifetime streams</p>
                                    </CardContent>
                              </Card>

                              <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                          <CardTitle className="text-sm font-medium text-muted-foreground">
                                                Total Likes
                                          </CardTitle>
                                          <Heart className="w-4 h-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                          <div className="text-2xl font-bold">{totalLikes?.length || 0}</div>
                                          <p className="text-xs text-muted-foreground">Song likes</p>
                                    </CardContent>
                              </Card>

                              <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                          <CardTitle className="text-sm font-medium text-muted-foreground">
                                                Songs
                                          </CardTitle>
                                          <Music className="w-4 h-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                          <div className="text-2xl font-bold">{songs?.length || 0}</div>
                                          <p className="text-xs text-muted-foreground">Uploaded tracks</p>
                                    </CardContent>
                              </Card>

                              <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                          <CardTitle className="text-sm font-medium text-muted-foreground">
                                                Studio Requests
                                          </CardTitle>
                                          <FileText className="w-4 h-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                          <div className="text-2xl font-bold">{studioRequests?.length || 0}</div>
                                          <p className="text-xs text-muted-foreground">Pending bookings</p>
                                    </CardContent>
                              </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              {/* Songs List */}
                              <div className="lg:col-span-2">
                                    <Card>
                                          <CardHeader>
                                                <div className="flex items-center justify-between">
                                                      <CardTitle>Your Songs</CardTitle>
                                                      <Button variant="outline" size="sm" asChild>
                                                            <Link href="/lyrics">View All</Link>
                                                      </Button>
                                                </div>
                                          </CardHeader>
                                          <CardContent>
                                                {songs && songs.length > 0 ? (
                                                      <div className="space-y-3">
                                                            {songs.map((song) => (
                                                                  <div key={song.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
                                                                        <div className="flex items-center gap-3">
                                                                              {song.thumbnail_url ? (
                                                                                    <img src={song.thumbnail_url} alt={song.title} className="w-12 h-12 rounded object-cover" />
                                                                              ) : (
                                                                                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                                                                          <Music className="w-5 h-5 text-muted-foreground" />
                                                                                    </div>
                                                                              )}
                                                                              <div>
                                                                                    <p className="font-medium">{song.title}</p>
                                                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                                          <span className="flex items-center gap-1">
                                                                                                <Eye className="w-3 h-3" />
                                                                                                {song.play_count || 0}
                                                                                          </span>
                                                                                          <span className="flex items-center gap-1">
                                                                                                <Heart className="w-3 h-3" />
                                                                                                {song.like_count || 0}
                                                                                          </span>
                                                                                    </div>
                                                                              </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                              <Badge variant={song.is_premium ? 'default' : 'secondary'}>
                                                                                    {song.is_premium ? 'Premium' : 'Free'}
                                                                              </Badge>
                                                                              {song.is_verified && (
                                                                                    <Badge variant="outline" className="bg-green-50 text-green-700">
                                                                                          Verified
                                                                                    </Badge>
                                                                              )}
                                                                        </div>
                                                                  </div>
                                                            ))}
                                                      </div>
                                                ) : (
                                                      <div className="text-center py-8 text-muted-foreground">
                                                            <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                                            <p>No songs uploaded yet</p>
                                                            <Button className="mt-4 bg-secondary hover:bg-secondary/90 text-primary" asChild>
                                                                  <Link href="/studio">Upload Your First Song</Link>
                                                            </Button>
                                                      </div>
                                                )}
                                          </CardContent>
                                    </Card>
                              </div>

                              {/* Sidebar */}
                              <div className="space-y-6">
                                    {/* Quick Actions */}
                                    <Card>
                                          <CardHeader>
                                                <CardTitle>Quick Actions</CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-2">
                                                <Button className="w-full justify-start bg-secondary hover:bg-secondary/90 text-primary" asChild>
                                                      <Link href="/studio">
                                                            <Music className="w-4 h-4 mr-2" />
                                                            Upload New Song
                                                      </Link>
                                                </Button>
                                                <Button variant="outline" className="w-full justify-start" asChild>
                                                      <Link href="/artist/profile">
                                                            <Settings className="w-4 h-4 mr-2" />
                                                            Edit Profile
                                                      </Link>
                                                </Button>
                                                <Button variant="outline" className="w-full justify-start" asChild>
                                                      <Link href="/my-downloads">
                                                            <Download className="w-4 h-4 mr-2" />
                                                            My Downloads
                                                      </Link>
                                                </Button>
                                          </CardContent>
                                    </Card>

                                    {/* Studio Requests */}
                                    <Card>
                                          <CardHeader>
                                                <CardTitle>Studio Requests</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                                {studioRequests && studioRequests.length > 0 ? (
                                                      <div className="space-y-3">
                                                            {studioRequests.slice(0, 3).map((request) => (
                                                                  <div key={request.id} className="p-3 border rounded-lg">
                                                                        <p className="font-medium text-sm">{request.service_type}</p>
                                                                        <p className="text-xs text-muted-foreground mt-1">
                                                                              {new Date(request.created_at).toLocaleDateString()}
                                                                        </p>
                                                                        <Badge
                                                                              variant="outline"
                                                                              className="mt-2 text-xs"
                                                                        >
                                                                              {request.status.replace('_', ' ')}
                                                                        </Badge>
                                                                  </div>
                                                            ))}
                                                      </div>
                                                ) : (
                                                      <p className="text-center text-muted-foreground py-4 text-sm">
                                                            No studio requests yet
                                                      </p>
                                                )}
                                          </CardContent>
                                    </Card>

                                    {/* Artist Profile Link */}
                                    <Card>
                                          <CardHeader>
                                                <CardTitle>Public Profile</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                      View your public artist profile
                                                </p>
                                                <Button variant="outline" className="w-full" asChild>
                                                      <Link href={`/artists/${user.id}`}>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View Profile
                                                      </Link>
                                                </Button>
                                          </CardContent>
                                    </Card>
                              </div>
                        </div>
                  </div>
            </div>
      )
}
