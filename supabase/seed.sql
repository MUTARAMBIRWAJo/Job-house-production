-- Job House Production Seed Data
-- Uses uuid_generate_v4() for automatic ID generation

-- ============================================
-- SEED ARTISTS (using automatic UUID generation)
-- ============================================
INSERT INTO artists (name, slug, bio, verified_status, genres, email, social_links, founded_year, songs_count, followers)
VALUES 
('Grace Mugabe', 'grace-mugabe', 'Award-winning gospel artist with over 10 years of experience in Christian music production. Known for her soulful voice and meaningful lyrics.', true, ARRAY['Gospel'], 'grace@gospelartist.com', '{"instagram": "@gracemugabe", "facebook": "gracemugabeofficcial", "whatsapp": "+250788123456"}', 2014, 15, 5420),
('David Kwizera', 'david-kwizera', 'Gospel musician and songwriter focused on contemporary Christian music. Passionate about spreading the message through uplifting melodies.', true, ARRAY['Gospel'], 'david@musicproducer.com', '{"instagram": "@davidkwizera", "facebook": "davidkwizeramusic", "whatsapp": "+250789654321"}', 2016, 12, 3890),
('Moses Kabanda', 'moses-kabanda', 'Veteran gospel producer and arranger. Specializes in traditional gospel arrangements with modern production techniques.', false, ARRAY['Gospel'], 'moses@gospel.com', '{"instagram": "@moseskabanda", "facebook": "moseskabandamusic", "whatsapp": "+250787456789"}', 2012, 20, 2340),
('Sarah Mukamana', 'sarah-mukamana', 'Contemporary gospel artist blending traditional Kinyarwanda lyrics with modern production. Award winner 2023.', true, ARRAY['Gospel'], 'sarah@gospelstar.com', '{"instagram": "@sarahmukamana", "facebook": "sarahmukamanaofficial", "whatsapp": "+250790123456"}', 2015, 18, 6120);

-- ============================================
-- SEED CATEGORIES
-- ============================================
INSERT INTO categories (name, slug, description)
VALUES 
('Hymns', 'hymns', 'Traditional and contemporary gospel hymns'),
('Original Compositions', 'original-compositions', 'Original worship songs and compositions'),
('Production Resources', 'production-resources', 'Music production tools, loops, and samples'),
('Educational Materials', 'educational-materials', 'Books, guides, and educational content'),
('Digital Resources', 'digital-resources', 'Digital assets and templates'),
('Sheet Music & Arrangements', 'sheet-music-arrangements', 'Sheet music and vocal arrangements');

-- ============================================
-- SEED PRODUCTS
-- ============================================
INSERT INTO products (title, slug, description, price, currency, cover_image, file_url, category, is_active, is_featured)
VALUES 
('Gospel Hymn Collection - Vol. 1', 'gospel-hymn-collection-vol-1', 
'A curated collection of 50 traditional and contemporary gospel hymns in high-quality digital format. Perfect for worship services, personal devotion, and study.',
9.99, 'USD', '/products/gospel-hymns-vol1.jpg', 'gospel-hymns-vol-1.zip', 'Hymns', true, true),
('Kinyarwanda Worship Songs Pack', 'kinyarwanda-worship-songs', 
'Exclusive collection of 30 original worship songs in Kinyarwanda language. Composed by local gospel artists from Rwanda.',
14.99, 'USD', '/products/kinyarwanda-worship.jpg', 'kinyarwanda-worship-pack.zip', 'Original Compositions', true, true),
('Contemporary Gospel Production Kit', 'contemporary-gospel-production-kit', 
'Complete music production toolkit including loops, samples, and MIDI patterns for creating contemporary gospel music.',
29.99, 'USD', '/products/production-kit.jpg', 'gospel-production-kit.zip', 'Production Resources', true, false),
('Gospel Music Theory Guide (E-Book)', 'gospel-music-theory-guide', 
'Comprehensive PDF guide covering music theory specific to gospel compositions, arrangements, and performance techniques.',
4.99, 'USD', '/products/theory-guide.jpg', 'gospel-music-theory.pdf', 'Educational Materials', true, false),
('Christian Worship Video Templates', 'christian-worship-video-templates', 
'Ready-to-use video templates for church presentations, worship services, and social media content. Includes MP4 and editable source files.',
19.99, 'USD', '/products/video-templates.jpg', 'worship-video-templates.zip', 'Digital Resources', true, false),
('Advanced Vocal Arrangement Pack', 'advanced-vocal-arrangement-pack', 
'Professional vocal arrangements for 25 gospel songs with detailed notation and performance notes for choir directors.',
24.99, 'USD', '/products/vocal-arrangements.jpg', 'vocal-arrangement-pack.zip', 'Sheet Music & Arrangements', true, false);

-- ============================================
-- SEED SONGS
-- ============================================
INSERT INTO songs (title, artist_name, featured_artist, language, lyrics, view_count, created_at)
VALUES 
('Imana Yanjye', 'Grace Mugabe', NULL, 'Kinyarwanda', 
'Imana Yanjye, wewe ndi umuntu wanjye
Amahoro y''agahinda, nzahindura ibyongeraho
Imana Yanjye, wewe ndi umuntu wanjye
Nzahindura ibyongeraho, nzahindura ibyo nshaka

Verse 1:
Umwanya wanjye wari mabi cyane
Nkaba ndi mu mahoro yuzuraguhuza
Ariko Imana yanjye yateje indakira
Akampa amahoro ashira mu mutima wanjye

Chorus:
Imana Yanjye, wewe ndi umuntu wanjye
Amahoro y''agahinda, nzahindura ibyongeraho
Imana Yanjye, wewe ndi umuntu wanjye
Nzahindura ibyongeraho, nzahindura ibyo nshaka', 2451, '2024-01-15'),
('Ubwenge Bwanjye', 'David Kwizera', 'Grace Mugabe', 'Kinyarwanda', 
'Ubwenge bwanjye biza mu Imana
Ubwenge bwanjye biza mu Imana
Ntabwo nyo munsi, ntabwo nyo mu mahoro
Ubwenge bwanjye biza mu Imana

Verse 1:
Mu mahoro yuzuraguhuza, nararibuka Imana
Mu mahoro yuzuraguhuza, nararibuka Imana
Nkaba ndi mu nda yabahembe
Ariko Imana yateje indakira

Chorus:
Ubwenge bwanjye biza mu Imana
Ubwenge bwanjye biza mutabwo nyo Imana
N munsi, ntabwo nyo mu mahoro
Ubwenge bwanjye biza mu Imana', 1893, '2024-02-01'),
('Nzibire', 'Moses Kabanda', NULL, 'Kinyarwanda', 
'Nzibire, Imana yanjye, nzibire
Mu mahoro yuzuraguhuza, nzibire
Amahoro ashira, nzibire
Mu mutima wanjye, nzibire

Verse 1:
Hari igihe ndari neza
Ndari neza, ndari amahoro
Ndari neza mu mutima wanjye
Ariko Imana yatejindakira

Chorus:
Nzibire, Imana yanjye, nzibire
Mu mahoro yuzuraguhuza, nzibire
Amahoro ashira, nzibire
Mu mutima wanjye, nzibire', 1634, '2024-02-10'),
('Ushindi', 'Sarah Mukamana', 'David Kwizera', 'Kinyarwanda', 
'Ushindi, ushindi, Imana ndi ushindi
Ushindi, ushindi, Imana ndi ushindi
Ntabwo nyo inzira, ntabwo nyo igihe
Ushindi, ushindi, Imana ndi ushindi

Verse 1:
Barandaguza ibikolimo
Barandaguza ibyo bihe
Ariko Imana yari mu nzira
Akampa ushindi', 2156, '2024-02-15'),
('Yambaye Ubwenge', 'John Muvunyi', NULL, 'Kinyarwanda', 
'Yambaye ubwenge Imana yanjye
Yambaye ubwenge, yambaye umugisha
Mu mahoro yuzuraguhuza
Yambaye ubwenge, yambaye umugisha

Verse 1:
Mu mahoro yuzuraguhuza
Ndari neza, ndari igihe
Ariko Imana yatejindakira
Akampa ubwenge bushya', 1421, '2024-02-20'),
('Amahoro Ashira', 'Grace Mugabe', 'Sarah Mukamana', 'Kinyarwanda', 
'Amahoro ashira mu mutima wanjye
Amahoro ashira, nzabimenyesha
Amahoro ashira mu mutima wanjye
Amahoro ashira, nzabimenyesha

Verse 1:
Hari igihe ndari amahoro
Ndari amahoro mu mutima
Ariko Imana yatejindakira
Akampa amahoro ashira', 1876, '2024-02-25');

-- ============================================
-- SEED NEWS
-- ============================================
INSERT INTO news (title, slug, excerpt, content, category, featured, published_date)
VALUES 
('Gospel Music Conference 2024 Announced', 'gospel-music-conference-2024', 
'Annual gospel music conference to be held in Kigali featuring international and local artists.',
'The annual Gospel Music Conference 2024 has been officially announced and will take place in Kigali from June 15-17, 2024. This year''s conference will feature renowned international gospel artists alongside talented local musicians from Rwanda.

The conference aims to promote gospel music in East Africa and provide a platform for emerging artists to showcase their talents. Workshops, masterclasses, and networking sessions are planned throughout the three-day event.

Early bird registration is now open with discounted rates for students and emerging artists.',
'Events', true, '2024-02-10'),
('New Gospel Music Streaming Platform Launches', 'new-gospel-music-streaming-platform', 
'Digital platform dedicated to gospel music from African artists goes live',
'A new streaming platform exclusively for gospel music from African artists has launched this week. The platform aims to support local musicians and increase visibility of African gospel music globally.

Features include artist profiles, high-quality audio streaming, and direct artist-to-fan connections. The platform is available on web and mobile devices.

Several Rwandan artists have already registered their music on the platform.',
'Technology', true, '2024-02-08'),
('Grace Mugabe Wins Best Gospel Artist Award', 'grace-mugabe-wins-award', 
'Local artist Grace Mugabe recognized at international music awards ceremony',
'Grace Mugabe, a renowned gospel artist, has been awarded the Best Gospel Artist award at the International African Music Awards ceremony held last weekend.

The award recognizes her outstanding contributions to gospel music and her influence in the Christian music community across East Africa.

Mugabe expressed her gratitude and dedication to continuing to produce meaningful gospel music that inspires and uplifts audiences.',
'Artists', false, '2024-02-05'),
('Studio Recording Tips from Industry Experts', 'studio-recording-tips', 
'Professional musicians share insights on producing quality gospel music',
'Industry experts have released a comprehensive guide on best practices for gospel music studio recording. The guide covers topics including microphone selection, acoustic treatment, and mixing techniques specific to gospel music.

Key recommendations include:
- Using high-quality microphones suited for vocal recording
- Proper room acoustic treatment
- Understanding the cultural context of gospel music
- Mixing for clarity and emotional impact

The guide is available for free download on the Job House Production website.',
'Music Production', false, '2024-02-01'),
('Gospel Music Trends in 2024', 'gospel-music-trends-2024', 
'Industry analysts discuss emerging trends in gospel music production and consumption',
'Music industry analysts have identified several key trends shaping gospel music in 2024:

1. Fusion Genres: Blending traditional gospel with contemporary music styles
2. Digital Distribution: Increased focus on streaming platforms and digital releases
3. Artist Collaborations: More cross-border collaborations among African artists
4. Live Performances: Growth in online gospel music concerts and virtual events
5. Production Quality: Higher production standards and investment in professional studios

These trends reflect the evolving landscape of gospel music and the opportunities for artists to reach wider audiences.',
'Industry', false, '2024-01-28');

-- ============================================
-- SEED STUDIO LEADS
-- ============================================
INSERT INTO studio_leads (artist_name, email, phone, project_type, genre, budget, budget_range, description, timeline, status, priority, assigned_to, internal_notes)
VALUES 
('Emmanuel Nshimiyimana', 'emmanuel@example.com', '+250788123456', 'Music Production Package', 'Gospel', 150000, '$100-200', 'Looking for professional production of my debut gospel album', '3 months', 'new', 'high', NULL, NULL),
('Theresa Uwitonze', 'theresa@gospel.com', '+250789654321', 'Studio Recording Package', 'Gospel', 50000, '$50-100', 'Single recording session for my new song', '1 month', 'contacted', 'medium', 'Admin', 'Responded to inquiry, waiting for confirmation'),
('Paul Kabisibo', 'paul.music@example.com', '+250787456789', 'Mixing & Mastering', 'Gospel', 75000, '$50-100', 'Need professional mixing and mastering for 5 songs', '2 weeks', 'in_progress', 'high', 'James', 'Files received, mixing started'),
('Claudette Nkubito', 'claudette@gospel.music', '+250790123456', 'Music Production Package', 'Gospel', 120000, '$100-200', 'Full production service for gospel EP with 3 tracks', '2 months', 'in_progress', 'medium', 'Sarah', 'Pre-production complete, recording starts next week'),
('Innocent Ntiranyibanza', 'innocent@example.com', '+250791234567', 'Studio Recording Package', 'Gospel', 50000, '$50-100', 'Recording one gospel song for charity event', '1 week', 'completed', 'low', 'Admin', 'Project completed successfully. Great collaboration!'),
('Betty Habimana', 'betty.music@example.com', '+250792345678', 'Music Production Package', 'Gospel', 180000, '$100-200', 'Full album production for debut gospel release', '4 months', 'new', 'high', NULL, NULL);

-- ============================================
-- SEED ORDERS
-- ============================================
INSERT INTO orders (user_email, stripe_payment_id, amount, status)
VALUES 
('user@example.com', 'pi_1234567890', 9.99, 'paid'),
('john@example.com', 'pi_0987654321', 44.98, 'paid');

-- ============================================
-- UPDATE ARTISTS SONGS COUNT
-- ============================================
UPDATE artists a
SET songs_count = (
    SELECT COUNT(*) FROM songs s WHERE s.artist_name = a.name
);

-- ============================================
-- SEED ORDER ITEMS (using subqueries to get product IDs)
-- ============================================
INSERT INTO order_items (order_id, product_id, product_title, product_price, quantity)
SELECT 
    o.id,
    p.id,
    p.title,
    p.price,
    1
FROM orders o, products p
WHERE o.user_email = 'user@example.com' 
    AND p.slug = 'gospel-hymn-collection-vol-1'
LIMIT 1;

INSERT INTO order_items (order_id, product_id, product_title, product_price, quantity)
SELECT 
    o.id,
    p.id,
    p.title,
    p.price,
    1
FROM orders o, products p
WHERE o.user_email = 'john@example.com' 
    AND p.slug = 'kinyarwanda-worship-songs'
LIMIT 1;

INSERT INTO order_items (order_id, product_id, product_title, product_price, quantity)
SELECT 
    o.id,
    p.id,
    p.title,
    p.price,
    1
FROM orders o, products p
WHERE o.user_email = 'john@example.com' 
    AND p.slug = 'contemporary-gospel-production-kit'
LIMIT 1;

-- ============================================
-- Verify seed data
-- ============================================
-- SELECT 'Artists: ' || COUNT(*) FROM artists;
-- SELECT 'Songs: ' || COUNT(*) FROM songs;
-- SELECT 'News: ' || COUNT(*) FROM news;
-- SELECT 'Products: ' || COUNT(*) FROM products;
-- SELECT 'Orders: ' || COUNT(*) FROM orders;
-- SELECT 'Studio Leads: ' || COUNT(*) FROM studio_leads;
