const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addEvents() {
  await client.connect();
  
  try {
    console.log('Adding diverse events to the database...');
    
    const eventsInsert = `
      INSERT INTO events (
        title, slug, description, event_type, event_date, event_time, 
        venue, venue_address, city, country, is_free, ticket_price, 
        organizer_name, organizer_phone, organizer_email, needs_audio_coverage, 
        needs_video_coverage, is_featured, is_published, published_at
      ) VALUES 
      (
        'Gospel Music Workshop 2024', 'gospel-music-workshop-2024',
        'Join us for an intensive workshop on gospel music production, songwriting, and performance techniques.',
        'workshop', '2024-03-15', '09:00',
        'Job House Production Studio', 'KG 543 Ave, Kigali', 'Kigali', 'Rwanda',
        false, 25000, 'Job House Production', '+250788123456', 'info@jobhouse.rw',
        true, false, true, true, '2024-02-10'
      ),
      (
        'Easter Gospel Concert', 'easter-gospel-concert',
        'A special Easter celebration featuring top gospel artists from Rwanda and beyond.',
        'concert', '2024-03-29', '18:00',
        'Kigali Arena', 'KN 4 Ave, Kigali', 'Kigali', 'Rwanda',
        false, 15000, 'Gospel Events Rwanda', '+250787654321', 'tickets@gospel.rw',
        true, true, true, true, '2024-02-08'
      ),
      (
        'Youth Gospel Crusade', 'youth-gospel-crusade',
        'A three-day crusade focused on reaching young people with the gospel message through music and testimony.',
        'crusade', '2024-04-05', '14:00',
        'Amahoro Stadium', 'Stade Ave, Kigali', 'Kigali', 'Rwanda',
        true, 0, 'Rwanda Gospel Fellowship', '+250789876543', 'crusade@gospel.rw',
        false, true, true, true, '2024-02-05'
      ),
      (
        'Gospel Music Business Conference', 'gospel-music-business-conference',
        'Learn about the business side of gospel music - marketing, distribution, and monetization.',
        'conference', '2024-04-20', '09:00',
        'Kigali Convention Center', 'Nyarugenge, Kigali', 'Kigali', 'Rwanda',
        false, 35000, 'Music Business Association', '+250785432109', 'conference@mba.rw',
        false, false, true, true, '2024-02-12'
      ),
      (
        'Praise and Worship Night', 'praise-worship-night',
        'An intimate evening of worship and praise featuring local gospel musicians.',
        'concert', '2024-05-10', '19:00',
        'Christian Life Center', 'Remera, Kigali', 'Kigali', 'Rwanda',
        true, 0, 'Christian Life Center', '+250782345678', 'info@clc.rw',
        false, false, false, true, '2024-02-15'
      )
      ON CONFLICT (slug) DO NOTHING;
    `;
    
    await client.query(eventsInsert);
    
    // Verify the data was inserted
    const countResult = await client.query('SELECT COUNT(*) as count FROM events');
    console.log(`Events in database after insertion: ${countResult.rows[0].count}`);
    
    console.log('Events added successfully!');
    
  } catch (error) {
    console.error('Error adding events:', error);
  } finally {
    await client.end();
  }
}

addEvents().catch(console.error);
