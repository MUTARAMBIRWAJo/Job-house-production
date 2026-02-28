-- Seed Data for JOB HOUSE PRODUCTION
-- Insert sample data for development and testing

-- Insert Genres
INSERT INTO genres (name, slug, description, color) VALUES
  ('Hip-Hop', 'hip-hop', 'Rap and hip-hop music', '#FF6B6B'),
  ('R&B', 'rnb', 'Rhythm and blues', '#4ECDC4'),
  ('Pop', 'pop', 'Popular music', '#45B7D1'),
  ('Electronic', 'electronic', 'Electronic and EDM', '#96CEB4'),
  ('Rock', 'rock', 'Rock and alternative', '#FFEAA7'),
  ('Jazz', 'jazz', 'Jazz and smooth jazz', '#DDA0DD'),
  ('Soul', 'soul', 'Soul music', '#FFB6C1'),
  ('Reggae', 'reggae', 'Reggae and dancehall', '#98D8C8')
ON CONFLICT DO NOTHING;

-- Insert Categories
INSERT INTO categories (name, slug, description) VALUES
  ('Music Production', 'music-production', 'Music production services'),
  ('Mixing', 'mixing', 'Audio mixing services'),
  ('Mastering', 'mastering', 'Audio mastering services'),
  ('Collaboration', 'collaboration', 'Artist collaboration'),
  ('News', 'news', 'News and updates'),
  ('Events', 'events', 'Music events'),
  ('Portfolio', 'portfolio', 'Artist portfolio items')
ON CONFLICT DO NOTHING;

-- Insert Artists (20 artists)
INSERT INTO artists (name, slug, bio, image_url, verified_status) VALUES
  ('The Harmony Collective', 'the-harmony-collective', 'A talented group of session musicians and producers', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'verified'),
  ('Luna Echo', 'luna-echo', 'Indie pop artist blending electronic and organic sounds', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', 'verified'),
  ('Rhythm Masters', 'rhythm-masters', 'Award-winning producers specializing in rhythmic compositions', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', 'verified'),
  ('Jazz Innovation Crew', 'jazz-innovation', 'Contemporary jazz fusion specialists', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400', 'verified'),
  ('Soul Searchers', 'soul-searchers', 'Deep soul and R&B creations', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'verified'),
  ('Electric Dreams', 'electric-dreams', 'Electronic and ambient music pioneers', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', 'pending'),
  ('Urban Beats Collective', 'urban-beats', 'Hip-hop and rap beat production', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', 'verified'),
  ('Classical Fusion', 'classical-fusion', 'Merging classical with modern genres', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400', 'verified'),
  ('Pop Sensation Studio', 'pop-sensation', 'Commercial pop music specialists', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'verified'),
  ('World Sound Collective', 'world-sound', 'World music and cultural fusion', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', 'verified'),
  ('Melodic Minds', 'melodic-minds', 'Singer-songwriters with unique perspectives', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', 'verified'),
  ('Ambient Sound Designers', 'ambient-sound', 'Creating immersive sonic landscapes', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400', 'pending'),
  ('Funk Foundation', 'funk-foundation', 'Funky grooves and dance rhythms', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'verified'),
  ('Rock Legends', 'rock-legends', 'Classic and modern rock compositions', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', 'verified'),
  ('Caribbean Rhythms', 'caribbean-rhythms', 'Reggae and Caribbean music masters', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', 'verified'),
  ('Digital Harmonies', 'digital-harmonies', 'Synth-pop and digital production', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400', 'verified'),
  ('Soul Voices Studio', 'soul-voices', 'Vocal training and soul music production', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'verified'),
  ('Experimental Beats Lab', 'experimental-beats', 'Pushing boundaries in music production', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', 'pending'),
  ('Acoustic Harmony Studio', 'acoustic-harmony', 'Acoustic instruments and natural recording', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', 'verified'),
  ('Future Sound Lab', 'future-sound', 'Next-generation music production', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400', 'verified')
ON CONFLICT DO NOTHING;

-- Insert Songs (20 songs)
INSERT INTO songs (title, slug, artist_id, lyrics, description, cover_image, release_date, status, featured) VALUES
  ('Midnight Dreams', 'midnight-dreams', (SELECT id FROM artists WHERE slug='luna-echo'), 'Verse 1: Under moonlight glow', 'A dreamy indie pop track', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', '2024-01-15', 'published', true),
  ('Rhythm of the Night', 'rhythm-of-the-night', (SELECT id FROM artists WHERE slug='rhythm-masters'), 'Feel the beat, feel the sound', 'Energetic dance production', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', '2024-01-20', 'published', true),
  ('Jazz for the Soul', 'jazz-for-the-soul', (SELECT id FROM artists WHERE slug='jazz-innovation'), 'Smooth jazz melodies flow', 'Contemporary jazz composition', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400', '2024-01-25', 'published', false),
  ('Deep Soul Connection', 'deep-soul-connection', (SELECT id FROM artists WHERE slug='soul-searchers'), 'In the darkness, light shines', 'Soulful R&B track', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', '2024-02-01', 'published', true),
  ('Electronic Paradise', 'electronic-paradise', (SELECT id FROM artists WHERE slug='electric-dreams'), 'Synths and beats combined', 'Ambient electronic music', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', '2024-02-05', 'published', false),
  ('Urban Hustle', 'urban-hustle', (SELECT id FROM artists WHERE slug='urban-beats'), 'From the streets to the beat', 'Hip-hop production', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', '2024-02-10', 'published', true),
  ('Classical Evolution', 'classical-evolution', (SELECT id FROM artists WHERE slug='classical-fusion'), 'Bridging old and new', 'Classical meets modern', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400', '2024-02-15', 'published', false),
  ('Pop Sensation Wave', 'pop-sensation-wave', (SELECT id FROM artists WHERE slug='pop-sensation'), 'Catchy hooks and melodies', 'Commercial pop hit', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', '2024-02-20', 'published', true),
  ('World Harmony', 'world-harmony', (SELECT id FROM artists WHERE slug='world-sound'), 'Voices from around the globe', 'World music fusion', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', '2024-02-25', 'published', false),
  ('Melodic Journey', 'melodic-journey', (SELECT id FROM artists WHERE slug='melodic-minds'), 'A songwriters tale', 'Indie singer-songwriter', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', '2024-03-01', 'published', false),
  ('Summer Vibes', 'summer-vibes', (SELECT id FROM artists WHERE slug='soul-searchers'), 'Summer energy in the air', 'Uplifting summer track', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', '2024-03-05', 'published', false),
  ('Winter Reflection', 'winter-reflection', (SELECT id FROM artists WHERE slug='ambient-sound'), 'Cold nights, warm hearts', 'Ambient winter composition', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', '2024-02-28', 'published', false),
  ('Spring Awakening', 'spring-awakening', (SELECT id FROM artists WHERE slug='funk-foundation'), 'New beginnings emerge', 'Funky spring vibes', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400', '2024-03-15', 'published', true),
  ('Autumn Melancholy', 'autumn-melancholy', (SELECT id FROM artists WHERE slug='rock-legends'), 'Leaves falling, hearts yearning', 'Rock ballad about seasons', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600', '2024-03-20', 'published', false),
  ('Night Vision', 'night-vision', (SELECT id FROM artists WHERE slug='digital-harmonies'), 'Synth waves in the dark', 'Electronic night track', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', '2024-03-25', 'published', true),
  ('Daylight Harmony', 'daylight-harmony', (SELECT id FROM artists WHERE slug='soul-voices'), 'Vocal harmony in sunshine', 'Bright soul vocalization', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', '2024-03-26', 'published', false),
  ('Midnight Echo', 'midnight-echo', (SELECT id FROM artists WHERE slug='experimental-beats'), 'Echoes through the night', 'Experimental soundscape', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400', '2024-03-27', 'draft', false),
  ('Crystal Waters', 'crystal-waters', (SELECT id FROM artists WHERE slug='acoustic-harmony'), 'Clear acoustic waves', 'Acoustic masterpiece', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', '2024-03-28', 'published', false),
  ('Urban Lights', 'urban-lights', (SELECT id FROM artists WHERE slug='future-sound'), 'City lights and future beats', 'Modern urban production', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', '2024-03-29', 'published', true),
  ('Timeless Groove', 'timeless-groove', (SELECT id FROM artists WHERE slug='caribbean-rhythms'), 'Reggae vibes eternal', 'Classic reggae composition', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', '2024-03-30', 'published', false)
ON CONFLICT DO NOTHING;

-- Insert News Posts (15 posts)
INSERT INTO news (title, slug, content, featured_image, category, status, featured) VALUES
  ('New Album Releases: January Recap', 'new-album-releases-january', 'This month saw incredible releases from our top artists', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600', 'Music Production', 'published', true),
  ('Behind the Scenes: Studio Recording Tips', 'behind-scenes-recording-tips', 'Learn the secrets to professional recording quality', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600', 'Music Production', 'published', true),
  ('Artist Spotlight: Luna Echo Interview', 'artist-spotlight-luna-echo', 'We sat down with Luna Echo to discuss creative process', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600', 'News', 'published', false),
  ('Technology in Music: The Future is Here', 'technology-music-future', 'Exploring how AI and technology shape modern music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600', 'Music Production', 'published', true),
  ('Collaboration Announcement: Major Partnership', 'collaboration-announcement', 'Exciting news about our latest partnership', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600', 'Collaboration', 'published', false),
  ('Award Winners Announced', 'award-winners-announced', 'Congratulations to this years award-winning artists', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600', 'News', 'published', false),
  ('Summer Festival Lineup Revealed', 'summer-festival-lineup', 'Check out the amazing lineup for our summer festival', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600', 'Events', 'published', true),
  ('Streaming Records: New Milestones', 'streaming-records-milestones', 'Our artists hit new streaming records this month', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600', 'News', 'published', false),
  ('Producer Workshop: Sign Up Now', 'producer-workshop-signup', 'Join our exclusive producer workshop this month', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600', 'Music Production', 'published', false),
  ('New Features Launched', 'new-features-launched', 'Discover whats new on our platform', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600', 'News', 'published', true),
  ('Mastering Secrets Revealed', 'mastering-secrets-revealed', 'Professional mastering tips from industry experts', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600', 'Music Production', 'published', false),
  ('Global Music Trends Report', 'global-music-trends', 'Analysis of music trends across continents', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600', 'News', 'published', false),
  ('Artist Development Program Launches', 'artist-development-program', 'New opportunities for emerging artists', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600', 'Collaboration', 'published', true),
  ('Vinyl Records Make a Comeback', 'vinyl-records-comeback', 'The resurgence of analog music formats', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600', 'News', 'published', false),
  ('Industry Conference Highlights', 'industry-conference-highlights', 'Key takeaways from this years major conference', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600', 'News', 'published', true)
ON CONFLICT DO NOTHING;

-- Insert Events (10 events)
INSERT INTO events (title, slug, description, event_date, event_end_date, location, venue_address, featured_image, capacity, status) VALUES
  ('Spring Music Festival 2024', 'spring-music-festival-2024', 'A celebration of music with performances from top artists', '2024-04-15 10:00:00+00', '2024-04-17 23:00:00+00', 'Central Park', '123 Main St, New York, NY', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600', 5000, 'upcoming'),
  ('Jazz Night Live', 'jazz-night-live', 'An evening of smooth jazz performances', '2024-03-22 19:00:00+00', '2024-03-22 23:00:00+00', 'Blue Note Jazz Club', '456 Jazz Ave, Los Angeles, CA', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600', 300, 'upcoming'),
  ('Electronic Music Showcase', 'electronic-music-showcase', 'Latest electronic and EDM productions', '2024-04-05 20:00:00+00', '2024-04-06 04:00:00+00', 'Future Sounds Arena', '789 Tech Dr, San Francisco, CA', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600', 2000, 'upcoming'),
  ('Soul Music Masterclass', 'soul-music-masterclass', 'Learn from soul music legends', '2024-03-30 14:00:00+00', '2024-03-30 18:00:00+00', 'Soul Studio', '321 Soulful Ln, Atlanta, GA', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600', 200, 'upcoming'),
  ('Hip-Hop Summit 2024', 'hip-hop-summit-2024', 'Industry conference and showcase', '2024-05-10 09:00:00+00', '2024-05-12 18:00:00+00', 'Convention Center', '654 Urban St, Chicago, IL', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600', 3000, 'upcoming'),
  ('Rock Night Extravaganza', 'rock-night-extravaganza', 'Electric rock performances all night long', '2024-04-25 20:00:00+00', '2024-04-25 23:30:00+00', 'The Stone Venue', '987 Rock Rd, Phoenix, AZ', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600', 1500, 'upcoming'),
  ('Pop Music Awards Show', 'pop-music-awards-show', 'Celebrating the best in pop music', '2024-05-01 19:00:00+00', '2024-05-01 22:00:00+00', 'Grand Theater', '111 Broadway, New York, NY', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600', 2500, 'upcoming'),
  ('World Music Festival', 'world-music-festival', 'Diverse musical traditions from around the globe', '2024-06-01 11:00:00+00', '2024-06-02 23:00:00+00', 'Cultural Park', '222 Global Ave, Miami, FL', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600', 4000, 'upcoming'),
  ('Producer Networking Event', 'producer-networking-event', 'Connect with industry producers and engineers', '2024-04-12 17:00:00+00', '2024-04-12 21:00:00+00', 'Music Hub', '333 Studio St, Los Angeles, CA', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600', 300, 'upcoming'),
  ('Annual Music Awards Ceremony', 'annual-music-awards', 'Honoring excellence in music production and artistry', '2024-06-15 18:00:00+00', '2024-06-15 22:00:00+00', 'Elegant Hall', '444 Awards Blvd, Nashville, TN', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600', 1000, 'upcoming')
ON CONFLICT DO NOTHING;

-- Insert Portfolio Items (10 items)
INSERT INTO portfolio (title, slug, description, content, artist_id, category, featured, status) VALUES
  ('Studio Production Showcase', 'studio-production-showcase', 'A collection of our best studio productions', 'Full-featured studio work', (SELECT id FROM artists WHERE slug='the-harmony-collective'), 'Music Production', true, 'published'),
  ('Live Concert Documentation', 'live-concert-documentation', 'Professional live concert recordings', 'Live performance documentation', (SELECT id FROM artists WHERE slug='rhythm-masters'), 'Events', true, 'published'),
  ('Mixing and Mastering Services', 'mixing-mastering-services', 'Professional mixing and mastering portfolio', 'Advanced mixing techniques', (SELECT id FROM artists WHERE slug='urban-beats'), 'Music Production', false, 'published'),
  ('Artist Collaboration Project', 'artist-collaboration-project', 'Featured artist collaborations', 'Multi-artist collaboration work', (SELECT id FROM artists WHERE slug='luna-echo'), 'Collaboration', true, 'published'),
  ('Jazz Fusion Album', 'jazz-fusion-album', 'Contemporary jazz fusion compositions', 'Innovative jazz arrangements', (SELECT id FROM artists WHERE slug='jazz-innovation'), 'Music Production', false, 'published'),
  ('Electronic Production Collection', 'electronic-production-collection', 'Original electronic and synth-pop productions', 'Electronic music creations', (SELECT id FROM artists WHERE slug='electric-dreams'), 'Music Production', true, 'published'),
  ('Music Video Production', 'music-video-production', 'Professional music video creations', 'Visual and audio production', (SELECT id FROM artists WHERE slug='pop-sensation'), 'Events', false, 'published'),
  ('Acoustic Sessions', 'acoustic-sessions', 'Intimate acoustic recordings', 'Unplugged and raw recordings', (SELECT id FROM artists WHERE slug='melodic-minds'), 'Music Production', true, 'published'),
  ('Remix and Remaster Portfolio', 'remix-remaster-portfolio', 'Classic remixes and remastered tracks', 'Reimagined classic tracks', (SELECT id FROM artists WHERE slug='rock-legends'), 'Music Production', false, 'published'),
  ('Cultural Fusion Project', 'cultural-fusion-project', 'World music and cultural integration', 'Global music collaboration', (SELECT id FROM artists WHERE slug='world-sound'), 'Collaboration', true, 'published')
ON CONFLICT DO NOTHING;


