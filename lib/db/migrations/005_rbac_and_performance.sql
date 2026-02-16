-- JOB HOUSE PRODUCTION - RBAC & Performance Enhancement Migration
-- Run this SQL in your Supabase SQL Editor after 004_chord_sheets_events.sql

-- ============================================
-- EDITOR ROLE TABLES & POLICIES
-- ============================================

-- Editor role management (editors can manage content but not users)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS editor_permissions JSONB DEFAULT '{
  "can_publish_news": true,
  "can_edit_news": true,
  "can_approve_lyrics": true,
  "can_feature_content": true,
  "can_view_analytics": true
}'::jsonb;

-- ============================================
-- ARTIST PROMOTIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.artist_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  promotion_type VARCHAR(50) NOT NULL, -- featured_banner, homepage_featured, newsletter, social_media
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, active, expired, cancelled
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for artist_promotions
ALTER TABLE public.artist_promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active promotions" ON public.artist_promotions
  FOR SELECT USING (status = 'active' AND start_date <= NOW() AND end_date >= NOW());

CREATE POLICY "Admins can manage all promotions" ON public.artist_promotions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Editors can manage promotions" ON public.artist_promotions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'editor')
  );

CREATE POLICY "Users can view their own promotion requests" ON public.artist_promotions
  FOR SELECT USING (user_id = auth.uid());

-- ============================================
-- ADDITIONAL INDEXES FOR PERFORMANCE
-- ============================================

-- Songs additional indexes
CREATE INDEX IF NOT EXISTS idx_songs_genre ON public.songs(genre);
CREATE INDEX IF NOT EXISTS idx_songs_released_at ON public.songs(released_at DESC);
CREATE INDEX IF NOT EXISTS idx_songs_play_count ON public.songs(play_count DESC);
CREATE INDEX IF NOT EXISTS idx_songs_created_at ON public.songs(created_at DESC);

-- Artists additional indexes
CREATE INDEX IF NOT EXISTS idx_artists_genre ON public.artists(genre);
CREATE INDEX IF NOT EXISTS idx_artists_follower_count ON public.artists(follower_count DESC);
CREATE INDEX IF NOT EXISTS idx_artists_created_at ON public.artists(created_at DESC);

-- Orders additional indexes
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_amount ON public.orders(amount);

-- Products additional indexes
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- News additional indexes
CREATE INDEX IF NOT EXISTS idx_news_created_at ON public.news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_author ON public.news(author);

-- Studio leads additional indexes
CREATE INDEX IF NOT EXISTS idx_studio_leads_created_at ON public.studio_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_studio_leads_priority ON public.studio_leads(priority);

-- Downloads additional indexes
CREATE INDEX IF NOT EXISTS idx_downloads_created_at ON public.downloads(created_at DESC);

-- ============================================
-- EDITOR ROLE POLICIES FOR EXISTING TABLES
-- ============================================

-- Editor can manage news
DROP POLICY IF EXISTS "Editors can manage news" ON public.news;
CREATE POLICY "Editors can manage news" ON public.news
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'editor'))
  );

-- Editor can manage songs (approve/feature)
DROP POLICY IF EXISTS "Editors can manage songs" ON public.songs;
CREATE POLICY "Editors can manage songs" ON public.songs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'editor'))
  );

-- Editor can manage products
DROP POLICY IF EXISTS "Editors can manage products" ON public.products;
CREATE POLICY "Editors can manage products" ON public.products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'editor'))
  );

-- Editor can manage studio services
DROP POLICY IF EXISTS "Editors can manage services" ON public.studio_services;
CREATE POLICY "Editors can manage services" ON public.studio_services
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'editor'))
  );

-- Editor can view all orders
DROP POLICY IF EXISTS "Editors can view all orders" ON public.orders;
CREATE POLICY "Editors can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'editor'))
    OR user_email = auth.jwt()->>'email'
  );

-- Editor can view all studio leads
DROP POLICY IF EXISTS "Editors can view all studio leads" ON public.studio_leads;
CREATE POLICY "Editors can view all studio leads" ON public.studio_leads
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'editor'))
    OR email = auth.jwt()->>'email'
  );

-- ============================================
-- ARTIST-SPECIFIC POLICIES
-- ============================================

-- Artists can view their own songs analytics
CREATE POLICY "Artists can view own songs analytics" ON public.songs
  FOR SELECT USING (
    artist_id IN (SELECT artist_id FROM public.profiles WHERE id = auth.uid() AND role = 'artist')
    OR is_featured = true
    OR is_premium = false
  );

-- Artists can view all public artists
CREATE POLICY "Anyone can view artists" ON public.artists
  FOR SELECT USING (true);

-- ============================================
-- USER SESSION IMPROVEMENTS
-- ============================================

-- Add session expiry tracking
ALTER TABLE public.user_sessions
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS device_info JSONB,
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Index for session expiry
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON public.user_sessions(expires_at);

-- ============================================
-- ANALYTICS TABLES (Optional - for future use)
-- ============================================

CREATE TABLE IF NOT EXISTS public.content_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(50) NOT NULL, -- song, artist, news, product
  content_id UUID NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- view, play, download, share, like
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  session_id UUID,
  referrer TEXT,
  user_agent TEXT,
  country VARCHAR(100),
  city VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for analytics
ALTER TABLE public.content_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can insert analytics" ON public.content_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all analytics" ON public.content_analytics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Editors can view content analytics" ON public.content_analytics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'editor'))
  );

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_content ON public.content_analytics(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON public.content_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.content_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON public.content_analytics(user_id);

-- ============================================
-- FINAL FUNCTION UPDATES
-- ============================================

-- Update updated_at trigger function if it exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE 'Migration 005 completed successfully!';
  RAISE NOTICE 'Added:';
  RAISE NOTICE '  - Editor permissions column on profiles';
  RAISE NOTICE '  - Artist promotions table with RLS';
  RAISE NOTICE '  - Additional performance indexes';
  RAISE NOTICE '  - Editor role policies for existing tables';
  RAISE NOTICE '  - Artist-specific policies';
  RAISE NOTICE '  - User session improvements';
  RAISE NOTICE '  - Content analytics table';
END $$;
