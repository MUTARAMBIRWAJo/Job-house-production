-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Artists table
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  verified_status BOOLEAN DEFAULT FALSE,
  genres TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lyrics table
CREATE TABLE lyrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  kinyarwanda_text TEXT,
  chords TEXT,
  youtube_url TEXT,
  key TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News table
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  featured_image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Studio Leads table
CREATE TABLE studio_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_type TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  description TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Musicians/Directory table
CREATE TABLE musicians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL,
  genres TEXT[] DEFAULT '{}',
  verified_status BOOLEAN DEFAULT FALSE,
  hire_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_lyrics_artist_id ON lyrics(artist_id);
CREATE INDEX idx_lyrics_slug ON lyrics(slug);
CREATE INDEX idx_lyrics_views ON lyrics(views DESC);
CREATE INDEX idx_artists_slug ON artists(slug);
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_musicians_role ON musicians(role);
CREATE INDEX idx_musicians_slug ON musicians(slug);

-- Enable Row Level Security
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE lyrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE musicians ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "artists_public_read" ON artists FOR SELECT USING (true);
CREATE POLICY "lyrics_public_read" ON lyrics FOR SELECT USING (true);
CREATE POLICY "news_public_read" ON news FOR SELECT USING (true);
CREATE POLICY "musicians_public_read" ON musicians FOR SELECT USING (true);

-- RLS Policy for studio_leads (insert only, no read without auth)
CREATE POLICY "studio_leads_insert" ON studio_leads FOR INSERT WITH CHECK (true);
