#!/usr/bin/env node

/**
 * Check new tables and add sample data if needed
 */

const { Client } = require('pg');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

async function checkAndSeedNewTables() {
  if (!DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🔍 Checking and Seeding New Tables...\n');

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check record counts for new tables
    const newTables = ['chord_sheets', 'events', 'artist_promotions'];
    
    console.log('📈 New Table Record Counts:');
    for (const table of newTables) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
        const count = parseInt(countResult.rows[0].count);
        console.log(`  📊 ${table}: ${count} records`);
        
        // Add sample data if table is empty
        if (count === 0) {
          console.log(`  ➕ Adding sample data to ${table}...`);
          await addSampleData(client, table);
        }
      } catch (error) {
        console.log(`  ❓ ${table}: Unable to count (${error.message})`);
      }
    }

    console.log('\n🎉 Database update completed!');

  } catch (error) {
    console.error('❌ Operation failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

async function addSampleData(client, table) {
  try {
    if (table === 'chord_sheets') {
      // Get a song ID to reference
      const songResult = await client.query('SELECT id FROM public.songs LIMIT 1');
      if (songResult.rows.length > 0) {
        const songId = songResult.rows[0].id;
        
        await client.query(`
          INSERT INTO public.chord_sheets (song_id, title, key_signature, tempo, time_signature, chord_progression, difficulty_level, instrument_type, is_official)
          VALUES 
            ($1, 'Amazing Grace - Basic', 'C', 120, '4/4', '[{"title": "Verse", "chords": [{"chord": "C", "position": 0}, {"chord": "G", "position": 4}, {"chord": "Am", "position": 8}, {"chord": "F", "position": 12}]}]', 'beginner', 'guitar', true),
            ($2, 'Amazing Grace - Advanced', 'G', 140, '4/4', '[{"title": "Verse", "chords": [{"chord": "G", "position": 0}, {"chord": "D", "position": 4}, {"chord": "Em", "position": 8}, {"chord": "C", "position": 12}]}]', 'advanced', 'guitar', true)
        `, [songId, songId]);
        
        console.log(`    ✅ Added 2 sample chord sheets`);
      }
    }
    
    if (table === 'events') {
      await client.query(`
        INSERT INTO public.events (title, slug, description, event_type, event_date, event_time, venue, venue_address, city, country, organizer_name, organizer_phone, organizer_email)
        VALUES 
          ('Gospel Music Festival 2024', 'gospel-music-festival-2024', 'Annual celebration of gospel music featuring local and international artists', 'concert', '2024-12-25', '18:00', 'Kigali Convention Center', 'KN 123 St, Kigali', 'Kigali', 'Rwanda', 'Gospel Music Rwanda', '+250788123456', 'info@gospelmusic.rw'),
          ('Worship Workshop', 'worship-workshop-2024', 'Learn contemporary worship techniques and songwriting', 'workshop', '2024-12-15', '14:00', 'Christian Life Center', 'KG 456 Ave, Kigali', 'Kigali', 'Rwanda', 'CLC Rwanda', '+250789654321', 'workshop@clc.rw')
      `);
      
      console.log(`    ✅ Added 2 sample events`);
    }
    
    if (table === 'artist_promotions') {
      // Get profile IDs to reference
      const profileResult = await client.query('SELECT id FROM public.profiles LIMIT 2');
      if (profileResult.rows.length >= 2) {
        await client.query(`
          INSERT INTO public.artist_promotions (artist_id, title, description, promotion_type, start_date, end_date, budget, status, created_by)
          VALUES 
            ($1, 'Album Launch Campaign', 'Promotion for new gospel album release', 'album_launch', '2024-12-01', '2024-12-31', 500000, 'active', $2),
            ($3, 'Christmas Special', 'Holiday season promotion for Christmas songs', 'seasonal', '2024-12-15', '2024-12-31', 250000, 'planned', $4)
        `, [profileResult.rows[0].id, profileResult.rows[0].id, profileResult.rows[1].id, profileResult.rows[1].id]);
        
        console.log(`    ✅ Added 2 sample artist promotions`);
      }
    }
    
  } catch (error) {
    console.log(`    ❌ Failed to add sample data: ${error.message}`);
  }
}

checkAndSeedNewTables();
