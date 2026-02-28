-- JOB HOUSE PRODUCTION - Core Tables Schema
-- Run this SQL in your Supabase SQL Editor after 001_auth_schema.sql

-- ============================================
-- ARTISTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  image_url TEXT,
  genre TEXT,
  bio TEXT,
  location TEXT,
  social_links JSONB DEFAULT '{}',
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  play_count INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SONGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  thumbnail_url TEXT,
  lyrics TEXT,
  genre TEXT,
  duration INTEGER,
  play_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  price DECIMAL(10,2) DEFAULT 0,
  released_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SONG LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.song_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(song_id, user_id)
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STUDIO LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.studio_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES public.artists(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_type TEXT NOT NULL,
  description TEXT,
  budget TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'cancelled')),
  assigned_to UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DOWNLOADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  download_token TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES FOR ARTISTS
-- ============================================
DROP POLICY IF EXISTS "Anyone can view verified artists" ON public.artists;
CREATE POLICY "Anyone can view verified artists" 
  ON public.artists FOR SELECT 
  USING (verified = true OR verified IS NULL);

DROP POLICY IF EXISTS "Artists can update own profile" ON public.artists;
CREATE POLICY "Artists can update own profile" 
  ON public.artists FOR UPDATE 
  USING (id IN (SELECT artist_id FROM public.profiles WHERE id = auth.uid()));

-- ============================================
-- RLS POLICIES FOR SONGS
-- ============================================
DROP POLICY IF EXISTS "Anyone can view songs" ON public.songs;
CREATE POLICY "Anyone can view songs" 
  ON public.songs FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Artists can manage own songs" ON public.songs;
CREATE POLICY "Artists can manage own songs" 
  ON public.songs FOR ALL 
  USING (artist_id IN (SELECT artist_id FROM public.profiles WHERE id = auth.uid()));

-- ============================================
-- RLS POLICIES FOR SONG LIKES
-- ============================================
DROP POLICY IF EXISTS "Users can manage own likes" ON public.song_likes;
CREATE POLICY "Users can manage own likes" 
  ON public.song_likes FOR ALL 
  USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES FOR ORDERS
-- ============================================
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" 
  ON public.orders FOR SELECT 
  USING (auth.uid() = user_id OR user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" 
  ON public.orders FOR INSERT 
  WITH CHECK (true);

-- ============================================
-- RLS POLICIES FOR ORDER ITEMS
-- ============================================
DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;
CREATE POLICY "Anyone can view order items" 
  ON public.order_items FOR SELECT 
  USING (true);

-- ============================================
-- RLS POLICIES FOR STUDIO LEADS
-- ============================================
DROP POLICY IF EXISTS "Anyone can create studio leads" ON public.studio_leads;
CREATE POLICY "Anyone can create studio leads" 
  ON public.studio_leads FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own studio leads" ON public.studio_leads;
CREATE POLICY "Users can view own studio leads" 
  ON public.studio_leads FOR SELECT 
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR artist_id IN (SELECT artist_id FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all studio leads" ON public.studio_leads;
CREATE POLICY "Admins can manage all studio leads" 
  ON public.studio_leads FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- RLS POLICIES FOR DOWNLOADS
-- ============================================
DROP POLICY IF EXISTS "Users can view own downloads" ON public.downloads;
CREATE POLICY "Users can view own downloads" 
  ON public.downloads FOR SELECT 
  USING (auth.uid() = user_id OR user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Anyone can create downloads" ON public.downloads;
CREATE POLICY "Anyone can create downloads" 
  ON public.downloads FOR INSERT 
  WITH CHECK (true);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_artists_slug ON public.artists(slug);
CREATE INDEX IF NOT EXISTS idx_artists_verified ON public.artists(verified);
CREATE INDEX IF NOT EXISTS idx_artists_is_featured ON public.artists(is_featured);

CREATE INDEX IF NOT EXISTS idx_songs_artist_id ON public.songs(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_slug ON public.songs(slug);
CREATE INDEX IF NOT EXISTS idx_songs_is_premium ON public.songs(is_premium);
CREATE INDEX IF NOT EXISTS idx_songs_is_featured ON public.songs(is_featured);

CREATE INDEX IF NOT EXISTS idx_song_likes_song_id ON public.song_likes(song_id);
CREATE INDEX IF NOT EXISTS idx_song_likes_user_id ON public.song_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON public.orders(user_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_song_id ON public.order_items(song_id);

CREATE INDEX IF NOT EXISTS idx_studio_leads_artist_id ON public.studio_leads(artist_id);
CREATE INDEX IF NOT EXISTS idx_studio_leads_status ON public.studio_leads(status);
CREATE INDEX IF NOT EXISTS idx_studio_leads_email ON public.studio_leads(email);

CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON public.downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_song_id ON public.downloads(song_id);
CREATE INDEX IF NOT EXISTS idx_downloads_token ON public.downloads(download_token);

-- ============================================
-- FOREIGN KEYS FOR PROFILES
-- ============================================
-- Add artist_id column if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'artist_id') THEN
    ALTER TABLE public.profiles ADD COLUMN artist_id UUID REFERENCES public.artists(id);
  END IF;
END $$;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE public.artists IS 'Artist profiles with verification and stats';
COMMENT ON TABLE public.songs IS 'Songs/tracks with audio, lyrics, and pricing';
COMMENT ON TABLE public.song_likes IS 'User likes on songs';
COMMENT ON TABLE public.orders IS 'Purchase orders for digital products';
COMMENT ON TABLE public.order_items IS 'Individual items in orders';
COMMENT ON TABLE public.studio_leads IS 'Studio service inquiry submissions';
COMMENT ON TABLE public.downloads IS 'Download tracking for purchased songs';

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 
  'artists' as table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'artists') as columns
UNION ALL
SELECT 
  'songs',
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'songs')
UNION ALL
SELECT 
  'orders',
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'orders')
UNION ALL
SELECT 
  'studio_leads',
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'studio_leads');
