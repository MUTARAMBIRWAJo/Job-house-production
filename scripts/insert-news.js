const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function insertNews() {
  try {
    await client.connect();
    
    const result = await client.query('SELECT COUNT(*) as count FROM news');
    console.log('Current news count:', result.rows[0].count);
    
    if (result.rows[0].count === 0) {
      console.log('Inserting news data...');
      
      const newsInsert = `
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
`;
      
      await client.query(newsInsert);
      console.log('News data inserted successfully!');
      
      const newCount = await client.query('SELECT COUNT(*) as count FROM news');
      console.log('New news count:', newCount.rows[0].count);
    } else {
      console.log('News data already exists');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

insertNews();
