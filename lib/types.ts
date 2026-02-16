// ============================================
// UNIFIED TYPE DEFINITIONS - JOB HOUSE PRODUCTION
// ============================================

// ============================================
// USER & AUTH TYPES
// ============================================
export type UserRole = 'admin' | 'artist' | 'customer' | 'editor'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  avatar_url: string | null
  phone: string | null
  bio: string | null
  is_verified: boolean
  artist_id: string | null
  created_at: string
  updated_at: string
  two_factor_secret: string | null
  two_factor_enabled: boolean
  editor_permissions: {
    can_edit_news: boolean
    can_publish_news: boolean
    can_approve_lyrics: boolean
    can_view_analytics: boolean
    can_feature_content: boolean
  }
}

// ============================================
// ARTIST TYPES
// ============================================
export interface Artist {
  id: string
  name: string
  slug: string
  email: string | null
  phone: string | null
  website: string | null
  image_url: string | null
  genre: string | null
  bio: string | null
  location: string | null
  social_links: {
    instagram?: string
    facebook?: string
    whatsapp?: string
    youtube?: string
    twitter?: string
  }
  is_verified: boolean
  is_featured: boolean
  play_count: number
  follower_count: number
  created_at: string
  updated_at: string
}

// ============================================
// SONG TYPES
// ============================================
export interface Song {
  id: string
  title: string
  lyrics: string
  artist_name: string
  artist_slug?: string
  artist_id?: string
  featured_artist: string | null
  language: string
  audio_url: string | null
  cover_image: string | null
  view_count: number
  download_count: number
  duration_seconds: number | null
  chords: any
  key_signature: string | null
  tempo: number | null
  time_signature: string | null
  created_at: string
  updated_at: string
}


// ============================================
// PRODUCT TYPES
// ============================================
export interface Product {
  id: string
  title: string
  slug: string
  description: string | null
  price: number
  currency: string
  demo_url: string | null
  file_url: string
  is_active: boolean
  is_featured: boolean
  view_count: number
  download_count: number
  cover_image: string | null
  created_at: string
  updated_at: string
  category_name?: string
  category_slug?: string
}

// ============================================
// EVENT TYPES
// ============================================
export interface Event {
  id: string
  title: string
  slug: string
  description: string | null
  event_type: EventType
  event_date: string
  event_time: string | null
  venue: string
  venue_address: string | null
  city: string | null
  country: string
  poster_image: string | null
  organizer_name: string | null
  organizer_phone: string | null
  organizer_email: string | null
  ticket_price: number
  is_free: boolean
  needs_audio_coverage: boolean
  needs_video_coverage: boolean
  coverage_contact: string | null
  is_featured: boolean
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

// ============================================
// ENHANCED INTERFACES FOR REAL-TIME DATA
// ============================================

// Real-time Song interface with JOINs
export interface EnhancedSong {
  id: string
  title: string
  lyrics: string
  artist_name: string
  featured_artist: string | null
  language: string
  audio_url: string | null
  cover_image: string | null
  view_count: number
  download_count: number
  duration_seconds: number | null
  created_at: string
  updated_at: string
  chords: any
  key_signature: string | null
  tempo: number | null
  time_signature: string | null
  artist_slug?: string
  artist_avatar?: string
  artist_verified?: boolean
  genres?: string[]
  album_title?: string
  album_slug?: string
}

// Real-time Artist interface with JOINs
export interface EnhancedArtist {
  id: string
  name: string
  slug: string
  bio: string
  avatar_url: string | null
  verified_status: boolean | null
  genres: string[] | null
  email: string | null
  social_links: any
  founded_year: number | null
  songs_count: number | null
  followers: number | null
  created_at: string
  updated_at: string
  genre_names?: string[]
  genre_count?: number
  latest_song_title?: string
  latest_song_date?: string
}

// Real-time News interface with JOINs
export interface RealTimeNews {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  featured: boolean
  featured_image: string | null
  published_date: string
  created_at: string
  updated_at: string
  author_name?: string
  author_slug?: string
  author_avatar?: string
  category_name?: string
  category_color?: string
}

// Real-time Product interface with JOINs
export interface RealTimeProduct {
  id: string
  title: string
  slug: string
  description: string
  category: string
  price: number
  currency: string
  demo_url: string | null
  file_url: string
  is_active: boolean
  is_featured: boolean
  view_count: number
  download_count: number
  cover_image: string | null
  created_at: string
  updated_at: string
}

// Real-time Event interface with JOINs
export interface RealTimeEvent extends Event {
  venue_name?: string
  event_type_name?: string
  event_type_icon?: string
}

// ============================================
// ARTIST PROMOTION TYPES
// ============================================
export type PromotionType = 'featured_artist' | 'featured_song' | 'verified_profile'
export type PromotionStatus = 'pending' | 'paid' | 'active' | 'expired' | 'cancelled'

export interface ArtistPromotion {
  id: string
  artist_id: string
  user_id: string
  promotion_type: PromotionType
  duration_months: number
  price: number
  currency: string
  status: PromotionStatus
  payment_method: string
  payment_intent_id: string | null
  custom_message: string | null
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
  artist?: Artist
  user?: Profile
}

// ============================================
// NEWS TYPES
// ============================================
export interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  author: string | null
  category: string | null
  featured_image: string | null
  is_featured: boolean
  published_at: string | null
  published_date: string | null // Alias for published_at for backward compatibility
  created_at: string
  updated_at: string
}

// ============================================
// STUDIO TYPES
// ============================================
export type LeadStatus = 'new' | 'contacted' | 'in_progress' | 'completed' | 'cancelled'
export type LeadPriority = 'low' | 'medium' | 'high'

export interface StudioLead {
  id: string
  artist_id: string | null
  name: string
  email: string
  phone: string | null
  service_type: string
  description: string | null
  budget: string | null
  status: LeadStatus
  assigned_to: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface StudioService {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  duration: string | null
  features: string[]
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}


export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Order {
  id: string
  user_id: string | null
  user_email: string
  amount: number
  currency: string
  status: OrderStatus
  stripe_payment_intent_id: string | null
  stripe_customer_id: string | null
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  song_id: string | null
  price: number
  quantity: number
  created_at: string
  // Joined fields
  product?: Product
  song?: Song
}

export interface CheckoutSession {
  sessionId: string
  url: string
}

// ============================================
// CHORD SHEET TYPES
// ============================================
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type InstrumentType = 'guitar' | 'piano' | 'ukulele' | 'all'

export interface ChordSheet {
  id: string
  song_id: string
  title: string
  key_signature: string
  tempo: number | null
  time_signature: string
  chord_progression: ChordSection[] // Array of chord sections with lyrics
  difficulty_level: DifficultyLevel
  instrument_type: InstrumentType
  is_official: boolean
  created_by: string | null
  created_at: string
  updated_at: string
  // Joined fields
  song?: Song
  creator?: Profile
}

export interface ChordSection {
  section_name: string // Verse, Chorus, Bridge, etc.
  chords: ChordLine[]
}

export interface ChordLine {
  lyrics: string
  chords: Chord[] // Array of chord positions in this line
}

export interface Chord {
  chord_name: string // C, Am, G7, etc.
  position: number // Character position in the lyrics line
}

// ============================================
// EVENT TYPES
// ============================================
export type EventType = 'concert' | 'crusade' | 'conference' | 'workshop'

export interface Event {
  id: string
  title: string
  slug: string
  description: string | null
  event_type: EventType
  event_date: string
  event_time: string | null
  venue: string
  venue_address: string | null
  city: string | null
  country: string
  poster_image: string | null
  organizer_name: string | null
  organizer_phone: string | null
  organizer_email: string | null
  ticket_price: number
  is_free: boolean
  needs_audio_coverage: boolean
  needs_video_coverage: boolean
  coverage_contact: string | null
  is_featured: boolean
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface EventAttendee {
  id: string
  event_id: string
  name: string
  email: string | null
  phone: string | null
  registration_date: string
  // Joined fields
  event?: Event
}

// ============================================
// SEARCH TYPES
// ============================================
export interface SearchResult {
  type: 'song' | 'artist' | 'news' | 'event' | 'chord_sheet'
  id: string
  title: string
  description: string | null
  url: string
  relevance_score?: number
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface StoreStats {
  total_products: number
  active_products: number
  total_orders: number
  total_revenue: number
}

// ============================================
// DOWNLOAD TYPES
// ============================================
export interface Download {
  id: string
  user_id: string | null
  user_email: string | null
  song_id: string | null
  order_id: string | null
  download_token: string
  ip_address: string | null
  downloaded_at: string
}

// ============================================
// CRM TYPES
// ============================================
export interface CRMStats {
  total_leads: number
  new_leads: number
  in_progress: number
  completed_this_month: number
  total_songs: number
  total_artists: number
  total_news: number
  total_revenue: number
}


// ============================================
// API RESPONSE TYPES
// ============================================
export interface PaginationParams {
  limit: number
  offset: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
