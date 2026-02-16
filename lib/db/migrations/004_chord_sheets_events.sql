-- JOB HOUSE PRODUCTION - Chord Sheets & Events Schema
-- Run this SQL in your Supabase SQL Editor after 003_content_tables.sql

-- ============================================
-- ADD CHORD SUPPORT TO SONGS TABLE
-- ============================================
ALTER TABLE public.songs 
ADD COLUMN IF NOT EXISTS chords JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS key_signature VARCHAR(10) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS tempo INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS time_signature VARCHAR(10) DEFAULT '4/4';

-- ============================================
-- CHORD SHEETS TABLE (Detailed chord progressions)
-- ============================================
CREATE TABLE IF NOT EXISTS public.chord_sheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  key_signature VARCHAR(10) NOT NULL,
  tempo INTEGER,
  time_signature VARCHAR(10) DEFAULT '4/4',
  chord_progression JSONB NOT NULL, -- Array of chord sections with lyrics
  difficulty_level VARCHAR(20) DEFAULT 'beginner', -- beginner, intermediate, advanced
  instrument_type VARCHAR(50) DEFAULT 'guitar', -- guitar, piano, ukulele, all
  is_official BOOLEAN DEFAULT FALSE, -- Official chord sheet vs user-contributed
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  event_type VARCHAR(50) DEFAULT 'concert', -- concert, crusade, conference, workshop
  event_date DATE NOT NULL,
  event_time TIME,
  venue TEXT NOT NULL,
  venue_address TEXT,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Rwanda',
  poster_image TEXT,
  organizer_name TEXT,
  organizer_phone VARCHAR(20),
  organizer_email TEXT,
  ticket_price DECIMAL(10,2) DEFAULT 0,
  is_free BOOLEAN DEFAULT TRUE,
  needs_audio_coverage BOOLEAN DEFAULT FALSE,
  needs_video_coverage BOOLEAN DEFAULT FALSE,
  coverage_contact TEXT, -- Contact for production services
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- EVENT ATTENDEES TABLE (Optional - for future use)
-- ============================================
CREATE TABLE IF NOT EXISTS public.event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone VARCHAR(20),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, email)
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.chord_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES FOR CHORD SHEETS
-- ============================================
DROP POLICY IF EXISTS "Anyone can view chord sheets" ON public.chord_sheets;
CREATE POLICY "Anyone can view chord sheets" 
  ON public.chord_sheets FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create chord sheets" ON public.chord_sheets;
CREATE POLICY "Authenticated users can create chord sheets" 
  ON public.chord_sheets FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Creators can update their chord sheets" ON public.chord_sheets;
CREATE POLICY "Creators can update their chord sheets" 
  ON public.chord_sheets FOR UPDATE 
  USING (created_by = auth.uid() OR 
         EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Creators or admins can delete chord sheets" ON public.chord_sheets;
CREATE POLICY "Creators or admins can delete chord sheets" 
  ON public.chord_sheets FOR DELETE 
  USING (created_by = auth.uid() OR 
         EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- RLS POLICIES FOR EVENTS
-- ============================================
DROP POLICY IF EXISTS "Anyone can view published events" ON public.events;
CREATE POLICY "Anyone can view published events" 
  ON public.events FOR SELECT 
  USING (is_published = true AND published_at IS NOT NULL AND published_at <= NOW());

DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
CREATE POLICY "Admins can manage events" 
  ON public.events FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- RLS POLICIES FOR EVENT ATTENDEES
-- ============================================
DROP POLICY IF EXISTS "Users can manage their event registrations" ON public.event_attendees;
CREATE POLICY "Users can manage their event registrations" 
  ON public.event_attendees FOR ALL 
  USING (true);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_chord_sheets_song_id ON public.chord_sheets(song_id);
CREATE INDEX IF NOT EXISTS idx_chord_sheets_key_signature ON public.chord_sheets(key_signature);
CREATE INDEX IF NOT EXISTS idx_chord_sheets_difficulty ON public.chord_sheets(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_chord_sheets_instrument ON public.chord_sheets(instrument_type);

CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_city ON public.events(city);
CREATE INDEX IF NOT EXISTS idx_events_featured ON public.events(is_featured);
CREATE INDEX IF NOT EXISTS idx_events_published ON public.events(is_published);
CREATE INDEX IF NOT EXISTS idx_events_needs_coverage ON public.events(needs_audio_coverage, needs_video_coverage);

CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON public.event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_email ON public.event_attendees(email);

CREATE INDEX IF NOT EXISTS idx_artist_promotions_artist_id ON public.artist_promotions(artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_promotions_user_id ON public.artist_promotions(user_id);
CREATE INDEX IF NOT EXISTS idx_artist_promotions_type ON public.artist_promotions(promotion_type);
CREATE INDEX IF NOT EXISTS idx_artist_promotions_status ON public.artist_promotions(status);
CREATE INDEX IF NOT EXISTS idx_artist_promotions_created_at ON public.artist_promotions(created_at);

-- ============================================
-- ARTIST PROMOTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.artist_promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    promotion_type VARCHAR(50) NOT NULL, -- featured_artist, featured_song, verified_profile
    duration_months INTEGER DEFAULT 1, -- Not applicable for verified_profile
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'RWF',
    status VARCHAR(20) DEFAULT 'pending', -- pending, paid, active, expired, cancelled
    payment_method VARCHAR(50) DEFAULT 'stripe',
    payment_intent_id VARCHAR(255), -- Stripe payment intent ID
    custom_message TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to new tables
DROP TRIGGER IF EXISTS update_chord_sheets_updated_at ON public.chord_sheets;
CREATE TRIGGER update_chord_sheets_updated_at 
    BEFORE UPDATE ON public.chord_sheets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON public.events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_artist_promotions_updated_at ON public.artist_promotions;
CREATE TRIGGER update_artist_promotions_updated_at 
    BEFORE UPDATE ON public.artist_promotions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================
INSERT INTO public.events (
  title, slug, description, event_type, event_date, event_time,
  venue, venue_address, city, organizer_name, organizer_phone,
  needs_audio_coverage, needs_video_coverage, is_published, published_at
) VALUES
  (
    'Gospel Night Concert',
    'gospel-night-concert',
    'An evening of uplifting gospel music featuring top Rwandan gospel artists',
    'concert',
    CURRENT_DATE + INTERVAL '30 days',
    '18:00',
    'Kigali Convention Center',
    'KG 7 Ave, Kigali, Rwanda',
    'Kigali',
    'Job House Production',
    '+250788123456',
    true,
    true,
    true,
    NOW()
  ),
  (
    'Youth Gospel Crusade',
    'youth-gospel-crusade',
    'A three-day crusade focused on youth empowerment through gospel music',
    'crusade',
    CURRENT_DATE + INTERVAL '45 days',
    '15:00',
    'Amahoro Stadium',
    'KN 4 Ave, Kigali, Rwanda',
    'Kigali',
    'Rwanda Gospel Fellowship',
    '+250788987654',
    true,
    true,
    true,
    NOW()
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE public.chord_sheets IS 'Detailed chord progressions for worship songs';
COMMENT ON TABLE public.events IS 'Gospel events, concerts, and conferences';
COMMENT ON TABLE public.event_attendees IS 'Event registration tracking';

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 
  'chord_sheets' as table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'chord_sheets') as columns
UNION ALL
SELECT 
  'events',
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'events')
UNION ALL
SELECT 
  'event_attendees',
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'event_attendees');
