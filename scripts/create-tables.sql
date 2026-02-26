-- Create core tables for Job House Production
-- Execute this migration to set up the database schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ARTISTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    verified_status BOOLEAN DEFAULT FALSE,
    genres TEXT[] DEFAULT '{}',
    email VARCHAR(255),
    social_links JSONB DEFAULT '{}',
    founded_year INTEGER,
    songs_count INTEGER DEFAULT 0,
    followers INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    follower_count INTEGER DEFAULT 0,
    play_count INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    phone VARCHAR(50),
    website VARCHAR(500),
    location VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SONGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS songs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    artist_name VARCHAR(255) NOT NULL,
    artist_id UUID REFERENCES artists(id),
    featured_artist VARCHAR(255),
    language VARCHAR(50) DEFAULT 'Kinyarwanda',
    lyrics TEXT,
    audio_url VARCHAR(500),
    cover_image VARCHAR(500),
    view_count INTEGER DEFAULT 0,
    play_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    duration_seconds INTEGER,
    chords JSONB,
    key_signature VARCHAR(10),
    tempo INTEGER,
    time_signature VARCHAR(10),
    genre VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image VARCHAR(500),
    category VARCHAR(100),
    featured BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    published_date DATE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    featured_image VARCHAR(500),
    event_date DATE,
    event_time TIME,
    location VARCHAR(500),
    capacity INTEGER,
    registered_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CATEGORIES TABLE (for Products)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    cover_image VARCHAR(500),
    file_url VARCHAR(500),
    demo_url VARCHAR(500),
    category VARCHAR(100),
    category_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    user_phone VARCHAR(50),
    stripe_payment_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_title VARCHAR(255),
    product_price DECIMAL(10, 2),
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ============================================
-- STUDIO LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS studio_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    artist_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    service_type VARCHAR(255),
    project_type VARCHAR(255),
    genre VARCHAR(100),
    budget DECIMAL(10, 2),
    budget_range VARCHAR(50),
    description TEXT,
    timeline VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'medium',
    assigned_to VARCHAR(255),
    internal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DOWNLOADS TABLE (for tracking downloads)
-- ============================================
CREATE TABLE IF NOT EXISTS downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255),
    product_id UUID REFERENCES products(id),
    song_id UUID REFERENCES songs(id),
    order_id UUID REFERENCES orders(id),
    download_token VARCHAR(255) UNIQUE,
    download_count INTEGER DEFAULT 0,
    max_downloads INTEGER DEFAULT 3,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STUDIO SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS studio_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    duration_days INTEGER,
    features JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROFILES TABLE (for authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    full_name VARCHAR(255),
    avatar_url VARCHAR(500),
    role VARCHAR(50) DEFAULT 'customer',
    is_verified BOOLEAN DEFAULT FALSE,
    phone VARCHAR(50),
    bio TEXT,
    artist_id UUID REFERENCES artists(id),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_artists_slug ON artists(slug);
CREATE INDEX IF NOT EXISTS idx_artists_verified ON artists(verified_status);
CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);
CREATE INDEX IF NOT EXISTS idx_songs_artist ON songs(artist_name);
CREATE INDEX IF NOT EXISTS idx_songs_artist_id ON songs(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_language ON songs(language);
CREATE INDEX IF NOT EXISTS idx_songs_view_count ON songs(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(is_featured);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(user_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_studio_leads_status ON studio_leads(status);
CREATE INDEX IF NOT EXISTS idx_studio_leads_priority ON studio_leads(priority);
CREATE INDEX IF NOT EXISTS idx_downloads_product ON downloads(product_id);

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

-- Apply triggers for automatic updated_at
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_studio_leads_updated_at BEFORE UPDATE ON studio_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_downloads_updated_at BEFORE UPDATE ON downloads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_studio_services_updated_at BEFORE UPDATE ON studio_services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
