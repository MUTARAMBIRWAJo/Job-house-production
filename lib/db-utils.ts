import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface FetchOptions {
  limit?: number
  offset?: number
  select?: string
}

// Safe fetch wrapper for songs
export async function fetchSongs(options: FetchOptions = {}) {
  try {
    const { select = '*', limit = 20, offset = 0 } = options
    
    let query = supabase.from('songs').select(select)
    
    if (limit) query = query.limit(limit)
    if (offset) query = query.range(offset, offset + (limit || 20) - 1)
    
    const { data, error } = await query
    
    if (error) {
      console.error('[DB] Songs fetch error:', error)
      return { data: [], error }
    }
    
    return { data: data || [], error: null }
  } catch (err) {
    console.error('[DB] Songs unexpected error:', err)
    return { data: [], error: err }
  }
}

// Safe fetch wrapper for news
export async function fetchNews(options: FetchOptions = {}) {
  try {
    const { select = '*', limit = 15, offset = 0 } = options
    
    let query = supabase.from('news').select(select)
    
    if (limit) query = query.limit(limit)
    if (offset) query = query.range(offset, offset + (limit || 15) - 1)
    
    const { data, error } = await query
    
    if (error) {
      console.error('[DB] News fetch error:', error)
      return { data: [], error }
    }
    
    return { data: data || [], error: null }
  } catch (err) {
    console.error('[DB] News unexpected error:', err)
    return { data: [], error: err }
  }
}

// Safe fetch wrapper for events
export async function fetchEvents(options: FetchOptions = {}) {
  try {
    const { select = '*', limit = 10, offset = 0 } = options
    
    let query = supabase.from('events').select(select)
    
    if (limit) query = query.limit(limit)
    if (offset) query = query.range(offset, offset + (limit || 10) - 1)
    
    const { data, error } = await query
    
    if (error) {
      console.error('[DB] Events fetch error:', error)
      return { data: [], error }
    }
    
    return { data: data || [], error: null }
  } catch (err) {
    console.error('[DB] Events unexpected error:', err)
    return { data: [], error: err }
  }
}

// Safe fetch wrapper for artists
export async function fetchArtists(options: FetchOptions = {}) {
  try {
    const { select = '*', limit = 20, offset = 0 } = options
    
    let query = supabase.from('artists').select(select)
    
    if (limit) query = query.limit(limit)
    if (offset) query = query.range(offset, offset + (limit || 20) - 1)
    
    const { data, error } = await query
    
    if (error) {
      console.error('[DB] Artists fetch error:', error)
      return { data: [], error }
    }
    
    return { data: data || [], error: null }
  } catch (err) {
    console.error('[DB] Artists unexpected error:', err)
    return { data: [], error: err }
  }
}

// Safe fetch wrapper for portfolio
export async function fetchPortfolio(options: FetchOptions = {}) {
  try {
    const { select = '*', limit = 10, offset = 0 } = options
    
    let query = supabase.from('portfolio').select(select)
    
    if (limit) query = query.limit(limit)
    if (offset) query = query.range(offset, offset + (limit || 10) - 1)
    
    const { data, error } = await query
    
    if (error) {
      console.error('[DB] Portfolio fetch error:', error)
      return { data: [], error }
    }
    
    return { data: data || [], error: null }
  } catch (err) {
    console.error('[DB] Portfolio unexpected error:', err)
    return { data: [], error: err }
  }
}

// Fetch single item by slug
export async function fetchBySlug(table: string, slug: string) {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) {
      console.error(`[DB] ${table} fetch by slug error:`, error)
      return { data: null, error }
    }
    
    return { data, error: null }
  } catch (err) {
    console.error(`[DB] ${table} unexpected error:`, err)
    return { data: null, error: err }
  }
}

// Fetch genres
export async function fetchGenres() {
  try {
    const { data, error } = await supabase.from('genres').select('*')
    
    if (error) {
      console.error('[DB] Genres fetch error:', error)
      return { data: [], error }
    }
    
    return { data: data || [], error: null }
  } catch (err) {
    console.error('[DB] Genres unexpected error:', err)
    return { data: [], error: err }
  }
}

// Fetch categories
export async function fetchCategories() {
  try {
    const { data, error } = await supabase.from('categories').select('*')
    
    if (error) {
      console.error('[DB] Categories fetch error:', error)
      return { data: [], error }
    }
    
    return { data: data || [], error: null }
  } catch (err) {
    console.error('[DB] Categories unexpected error:', err)
    return { data: [], error: err }
  }
}
