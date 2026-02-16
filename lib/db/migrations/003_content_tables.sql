-- JOB HOUSE PRODUCTION - Content Tables Schema
-- Run this SQL in your Supabase SQL Editor after 002_core_tables.sql

-- ============================================
-- NEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT,
  category TEXT,
  featured_image TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PRODUCTS TABLE (Digital Store)
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  cover_image TEXT,
  file_path TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STUDIO SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.studio_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration TEXT,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_services ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES FOR NEWS
-- ============================================
DROP POLICY IF EXISTS "Anyone can view published news" ON public.news;
CREATE POLICY "Anyone can view published news" 
  ON public.news FOR SELECT 
  USING (
    published_at IS NOT NULL 
    AND published_at <= NOW()
  );

DROP POLICY IF EXISTS "Admins can manage news" ON public.news;
CREATE POLICY "Admins can manage news" 
  ON public.news FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- RLS POLICIES FOR PRODUCTS
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products" 
  ON public.products FOR SELECT 
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" 
  ON public.products FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- RLS POLICIES FOR STUDIO SERVICES
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active services" ON public.studio_services;
CREATE POLICY "Anyone can view active services" 
  ON public.studio_services FOR SELECT 
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage services" ON public.studio_services;
CREATE POLICY "Admins can manage services" 
  ON public.studio_services FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_is_featured ON public.news(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_category ON public.news(category);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);

CREATE INDEX IF NOT EXISTS idx_studio_services_slug ON public.studio_services(slug);
CREATE INDEX IF NOT EXISTS idx_studio_services_is_active ON public.studio_services(is_active);
CREATE INDEX IF NOT EXISTS idx_studio_services_display_order ON public.studio_services(display_order);

-- ============================================
-- SEED DATA FOR STUDIO SERVICES
-- ============================================
INSERT INTO public.studio_services (name, slug, description, price, duration, features, display_order) VALUES
  (
    'Studio Recording Package',
    'studio-recording-package',
    'Professional recording facilities with experienced sound engineers',
    50000,
    '5 hours',
    '["Professional microphone", "Sound engineer", "Basic mixing", "Digital master copy"]',
    1
  ),
  (
    'Music Production Package',
    'music-production-package',
    'Complete production from arrangement to mastering',
    150000,
    '2-3 weeks',
    '["Arrangement", "Recording", "Mixing", "Mastering", "3 revisions"]',
    2
  ),
  (
    'Mixing & Mastering',
    'mixing-mastering',
    'Professional mixing and mastering services',
    75000,
    '1-2 weeks',
    '["Professional mixing", "Mastering", "Multiple format exports", "2 revisions"]',
    3
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE public.news IS 'News articles and blog posts';
COMMENT ON TABLE public.products IS 'Digital products for sale in the store';
COMMENT ON TABLE public.studio_services IS 'Studio service packages available for booking';

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 
  'news' as table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'news') as columns
UNION ALL
SELECT 
  'products',
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'products')
UNION ALL
SELECT 
  'studio_services',
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'studio_services');
