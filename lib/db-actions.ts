'use server'

import { createClient } from '@/lib/supabase/server'
import { createPublicClient } from '@/lib/supabase/public'
import {
  Song,
  Artist,
  NewsArticle,
  StudioLead,
  StudioService,
  SearchResult,
  CRMStats,
  LeadStatus,
  LeadPriority,
  Product,
  Order,
  OrderItem,
  StoreStats,
  EventType
} from '@/lib/types'

// Helper function to get server client
async function getSupabase() {
  return createClient()
}

// Helper function to get public client (no authentication required)
function getPublicSupabase() {
  return createPublicClient()
}

// ============================================
// SONGS
// ============================================
export async function getSongs(options?: {
  limit?: number
  offset?: number
  sort?: 'recent' | 'trending'
  language?: string
  searchTerm?: string
}): Promise<Song[]> {
  const supabase = await getSupabase()

  let query = supabase
    .from('songs')
    .select(`
      *,
      artists:artist_id (
        id, name, slug, avatar_url, verified_status
      )
    `)
    .order('created_at', { ascending: false })

  if (options?.searchTerm) {
    query = query.or(`title.ilike.%${options.searchTerm}%,lyrics.ilike.%${options.searchTerm}%`)
  }

  if (options?.language) {
    query = query.eq('genre', options.language)
  }

  if (options?.sort === 'trending') {
    query = query.order('play_count', { ascending: false })
  }

  const limit = options?.limit || 10
  const offset = options?.offset || 0
  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching songs:', error)
    return []
  }

  // Map artist data to flat structure for compatibility
  return (data || []).map(song => ({
    ...song,
    artist_name: song.artists?.name,
    artist_slug: song.artists?.slug,
    artist_id: song.artist_id
  }))
}

export async function getSongById(id: string): Promise<Song | null> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('songs')
    .select(`
      *,
      artists:artist_id (
        id, name, slug, avatar_url, verified_status
      )
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Error fetching song:', error)
    return null
  }

  return {
    ...data,
    artist_name: data.artists?.name,
    artist_slug: data.artists?.slug
  }
}

export async function searchSongs(query: string): Promise<Song[]> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .or(`title.ilike.%${query}%,artist_name.ilike.%${query}%`)
    .order('play_count', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error searching songs:', error)
    return []
  }

  return data || []
}

export async function incrementSongViewCount(id: string): Promise<void> {
  const supabase = await getSupabase()

  const { error } = await supabase
    .rpc('increment_play_count', { song_id: id })

  if (error) {
    // Fallback: manual increment
    const { data } = await supabase
      .from('songs')
      .select('play_count')
      .eq('id', id)
      .single()

    if (data) {
      await supabase
        .from('songs')
        .update({ play_count: (data.play_count || 0) + 1 })
        .eq('id', id)
    }
  }
}

// ============================================
// ARTISTS
// ============================================
export async function getArtists(options?: {
  limit?: number
  offset?: number
  verified?: boolean
  searchTerm?: string
  genre?: string
}): Promise<Artist[]> {
  const supabase = getPublicSupabase()

  let query = supabase
    .from('artists')
    .select('*')
    .order('created_at', { ascending: false })

  if (options?.verified !== undefined) {
    query = query.eq('is_verified', options.verified)
  }

  if (options?.genre) {
    query = query.eq('genre', options.genre)
  }

  if (options?.searchTerm) {
    query = query.or(`name.ilike.%${options.searchTerm}%,genre.ilike.%${options.searchTerm}%`)
  }

  const limit = options?.limit || 10
  const offset = options?.offset || 0
  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching artists:', error)
    return []
  }

  return data || []
}

export async function getArtistById(id: string): Promise<Artist | null> {
  const supabase = getPublicSupabase()

  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Error fetching artist:', error)
    return null
  }

  return data
}

export async function getArtistWithSongs(id: string): Promise<(Artist & { songs: Song[] }) | null> {
  const supabase = getPublicSupabase()

  // Get artist
  const { data: artist, error: artistError } = await supabase
    .from('artists')
    .select('*')
    .eq('id', id)
    .single()

  if (artistError || !artist) {
    console.error('Error fetching artist:', artistError)
    return null
  }

  // Get artist's songs
  const { data: songs, error: songsError } = await supabase
    .from('songs')
    .select('*')
    .eq('artist_id', id)
    .order('created_at', { ascending: false })

  if (songsError) {
    console.error('Error fetching artist songs:', songsError)
  }

  return {
    ...artist,
    songs: songs || []
  }
}

export async function searchArtists(query: string): Promise<Artist[]> {
  const supabase = getPublicSupabase()

  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .or(`name.ilike.%${query}%,genre.ilike.%${query}%`)
    .eq('is_verified', true)
    .order('follower_count', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error searching artists:', error)
    return []
  }

  return data || []
}

// ============================================
// NEWS
// ============================================
export async function getNews(options?: {
  limit?: number
  offset?: number
  searchTerm?: string
  featured?: boolean
}): Promise<NewsArticle[]> {
  const supabase = getPublicSupabase()

  try {
    let query = supabase
      .from('news')
      .select('id, title, slug, content, featured_image, category, featured, status, created_at, updated_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (options?.searchTerm) {
      query = query.or(`title.ilike.%${options.searchTerm}%,content.ilike.%${options.searchTerm}%`)
    }

    if (options?.featured) {
      query = query.eq('featured', true)
    }

    const limit = options?.limit || 10
    const offset = options?.offset || 0
    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) {
      console.error('[v0] News fetch error:', error)
      return []
    }

    // Map database fields to NewsArticle interface
    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.content?.substring(0, 160) || null,
      content: item.content,
      author: null, // Will be updated when user system is ready
      category: item.category,
      featured_image: item.featured_image,
      is_featured: item.featured,
      published_at: item.created_at,
      published_date: item.created_at,
      created_at: item.created_at,
      updated_at: item.updated_at
    }))
  } catch (err) {
    console.error('[v0] News unexpected error:', err)
    return []
  }
}

export async function getNewsById(id: string): Promise<NewsArticle | null> {
  const supabase = getPublicSupabase()

  try {
    const { data, error } = await supabase
      .from('news')
      .select('id, title, slug, content, featured_image, category, featured, status, created_at, updated_at')
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('[v0] News article fetch error:', error)
      return null
    }

    // Map database fields to NewsArticle interface
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.content?.substring(0, 160) || null,
      content: data.content,
      author: null,
      category: data.category,
      featured_image: data.featured_image,
      is_featured: data.featured,
      published_at: data.created_at,
      published_date: data.created_at,
      created_at: data.created_at,
      updated_at: data.updated_at
    }

  return data
}

export async function searchNews(query: string): Promise<NewsArticle[]> {
  const supabase = getPublicSupabase()

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error searching news:', error)
    return []
  }

  return data || []
}

// ============================================
// STUDIO SERVICES
// ============================================
export async function getStudioServices(options?: {
  limit?: number
  offset?: number
}): Promise<StudioService[]> {
  const supabase = await getSupabase()

  let query = supabase
    .from('studio_services')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  const limit = options?.limit || 10
  const offset = options?.offset || 0
  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching studio services:', error)
    return []
  }

  // Parse features JSON
  return (data || []).map(service => ({
    ...service,
    features: typeof service.features === 'string'
      ? JSON.parse(service.features)
      : service.features || []
  }))
}

// ============================================
// STUDIO LEADS
// ============================================
export async function createStudioLead(data: {
  artist_name: string
  email: string
  phone?: string
  service_type: string
  genre?: string
  budget?: number
  budget_range?: string
  description?: string
  timeline?: string
}): Promise<StudioLead> {
  const supabase = await getSupabase()

  const { data: lead, error } = await supabase
    .from('studio_leads')
    .insert({
      name: data.artist_name,
      email: data.email,
      phone: data.phone,
      service_type: data.service_type,
      description: data.description,
      budget: data.budget_range || data.budget?.toString(),
      status: 'new'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating studio lead:', error)
    throw new Error('Failed to create studio lead')
  }

  return lead
}

export async function submitStudioLead(data: {
  artist_name: string
  email: string
  phone?: string
  service_type: string
  genre?: string
  budget?: number
  description?: string
  timeline?: string
}): Promise<StudioLead> {
  return createStudioLead(data)
}

// ============================================
// SEARCH
// ============================================
export async function searchAll(query: string): Promise<SearchResult[]> {
  const [songs, artists, news] = await Promise.all([
    searchSongs(query),
    searchArtists(query),
    searchNews(query)
  ])

  const results: SearchResult[] = [
    ...songs.map(song => ({
      type: 'song' as const,
      id: song.id,
      title: song.title,
      description: song.lyrics?.substring(0, 100) || '',
      url: `/lyrics/${song.id}`,
      relevance_score: song.view_count
    })),
    ...artists.map(artist => ({
      type: 'artist' as const,
      id: artist.id,
      title: artist.name,
      description: artist.bio?.substring(0, 100) || '',
      url: `/artists/${artist.id}`,
      relevance_score: artist.follower_count
    })),
    ...news.map(article => ({
      type: 'news' as const,
      id: article.id,
      title: article.title,
      description: article.excerpt || '',
      url: `/news/${article.id}`,
      relevance_score: 0 // News doesn't have a relevance score
    }))
  ]

  return results.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0))
}

// ============================================
// CRM LEADS
// ============================================
export async function getStudioLeads(options?: {
  limit?: number
  offset?: number
  status?: LeadStatus
  priority?: LeadPriority
  search?: string
  sortBy?: 'newest' | 'oldest'
}): Promise<StudioLead[]> {
  const supabase = await getSupabase()

  let query = supabase
    .from('studio_leads')
    .select('*')
    .order('created_at', { ascending: options?.sortBy === 'oldest' })

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  if (options?.search) {
    query = query.or(`name.ilike.%${options.search}%,email.ilike.%${options.search}%`)
  }

  const limit = options?.limit || 10
  const offset = options?.offset || 0
  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching leads:', error)
    return []
  }

  return data || []
}

export async function getStudioLeadById(id: string): Promise<StudioLead | null> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('studio_leads')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Error fetching lead:', error)
    return null
  }

  return data
}

export async function updateStudioLead(
  id: string,
  updates: Partial<Omit<StudioLead, 'id' | 'created_at'>>
): Promise<StudioLead | null> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('studio_leads')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating lead:', error)
    return null
  }

  return data
}

export async function getCRMStats(): Promise<CRMStats> {
  const supabase = await getSupabase()

  // Get counts in parallel
  const [
    { count: totalLeads },
    { data: newLeadsData },
    { data: inProgressLeads },
    { count: totalSongs },
    { count: totalArtists },
    { count: totalNews },
    { data: paidOrders }
  ] = await Promise.all([
    supabase.from('studio_leads').select('*', { count: 'exact', head: true }),
    supabase.from('studio_leads').select('*').eq('status', 'new'),
    supabase.from('studio_leads').select('*').eq('status', 'in_progress'),
    supabase.from('songs').select('*', { count: 'exact', head: true }),
    supabase.from('artists').select('*', { count: 'exact', head: true }),
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('amount, status').eq('status', 'paid')
  ])

  // Calculate completed this month
  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const { data: completedLeads } = await supabase
    .from('studio_leads')
    .select('updated_at')
    .eq('status', 'completed')
    .gte('updated_at', thisMonth.toISOString())

  const totalRevenue = (paidOrders || []).reduce((sum, order) => sum + (order.amount || 0), 0)

  return {
    total_leads: totalLeads || 0,
    new_leads: newLeadsData?.length || 0,
    in_progress: inProgressLeads?.length || 0,
    completed_this_month: completedLeads?.length || 0,
    total_songs: totalSongs || 0,
    total_artists: totalArtists || 0,
    total_news: totalNews || 0,
    total_revenue: totalRevenue
  }
}

// ============================================
// PRODUCTS (DIGITAL STORE)
// ============================================
export async function getProducts(options?: {
  limit?: number
  offset?: number
  category?: string
  search?: string
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest'
  active_only?: boolean
}): Promise<Product[]> {
  const supabase = await getSupabase()

  let query = supabase
    .from('products')
    .select('*')

  if (options?.active_only !== false) {
    query = query.eq('is_active', true)
  }

  if (options?.category) {
    query = query.eq('category', options.category)
  }

  if (options?.search) {
    query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`)
  }

  // Sort
  if (options?.sortBy === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (options?.sortBy === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else if (options?.sortBy === 'newest') {
    query = query.order('created_at', { ascending: false })
  } else if (options?.sortBy === 'oldest') {
    query = query.order('created_at', { ascending: true })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const limit = options?.limit || 12
  const offset = options?.offset || 0
  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    console.error('Error fetching product:', error)
    return null
  }

  return data
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Error fetching product:', error)
    return null
  }

  return data
}

export async function getProductCategories(): Promise<string[]> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('is_active', true)

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  const categories = new Set((data || []).map(p => p.category).filter(Boolean))
  return Array.from(categories).sort()
}

export async function getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
  const supabase = await getSupabase()

  // First get the product's category
  const product = await getProductById(productId)
  if (!product) return []

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('category_name', product.category_name)
    .neq('id', productId)
    .limit(limit)

  if (error) {
    console.error('Error fetching related products:', error)
    return []
  }

  return data || []
}

// ============================================
// ORDERS
// ============================================
export async function getOrders(email: string): Promise<Order[]> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_email', email)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }

  return data || []
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }

  return data || []
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Error fetching order:', error)
    return null
  }

  return data
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId)

  if (error) {
    console.error('Error fetching order items:', error)
    return []
  }

  return data || []
}

export async function createOrder(order: Record<string, unknown>): Promise<Order> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: order.user_id as string | null,
      user_email: order.user_email as string,
      amount: order.amount as number,
      currency: (order.currency as string) || 'USD',
      status: (order.status as string) || 'pending',
      stripe_payment_intent_id: order.stripe_payment_intent_id as string | null,
      stripe_customer_id: order.stripe_customer_id as string | null,
      metadata: (order.metadata as Record<string, unknown>) || {}
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating order:', error)
    throw new Error('Failed to create order')
  }

  return data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createOrderItems(items: any[]): Promise<OrderItem[]> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('order_items')
    .insert(items.map(item => ({
      order_id: item.order_id,
      song_id: item.song_id || null,
      price: item.price || 0
    })))
    .select()

  if (error) {
    console.error('Error creating order items:', error)
    throw new Error('Failed to create order items')
  }

  return data || []
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order | null> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('orders')
    .update({
      status: status as any,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .select()
    .single()

  if (error) {
    console.error('Error updating order:', error)
    return null
  }

  return data
}

// ============================================
// STORE STATS
// ============================================
export async function getStoreStats(): Promise<StoreStats> {
  const supabase = await getSupabase()

  const [
    { count: totalProducts },
    { count: activeProducts },
    { data: paidOrders }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('orders').select('amount, status').eq('status', 'paid')
  ])

  const totalRevenue = (paidOrders || []).reduce((sum, order) => sum + (order.amount || 0), 0)

  return {
    total_products: totalProducts || 0,
    active_products: activeProducts || 0,
    total_orders: paidOrders?.length || 0,
    total_revenue: totalRevenue
  }
}
