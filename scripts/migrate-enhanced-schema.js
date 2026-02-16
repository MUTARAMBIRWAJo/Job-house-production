#!/usr/bin/env node

/**
 * Enhanced Schema Migration Script
 * Execute this in Supabase SQL Editor to implement all enhancements
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

async function executeMigration() {
  if (!DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🔄 EXECUTING ENHANCED SCHEMA MIGRATION\n');

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Read the enhanced schema SQL
    const schemaPath = path.join(__dirname, 'enhanced-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    console.log('📝 Executing enhanced schema...\n');

    // Execute the schema
    await client.query(schemaSQL);

    console.log('✅ Enhanced schema executed successfully!\n');

    // Verify tables were created
    const tablesCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN (
        'genres', 'albums', 'venues', 'news_categories', 
        'event_categories', 'song_genres', 'artist_genres',
        'playlists', 'playlist_songs', 'reviews', 'comments',
        'tags', 'content_tags', 'analytics'
      )
      ORDER BY table_name
    `);

    console.log('\n📊 New Tables Created:');
    console.log('=====================================');
    tablesCheck.rows.forEach(table => {
      console.log(`✅ ${table.table_name}`);
    });

    // Check if foreign key columns were added
    const fkCheck = await client.query(`
      SELECT column_name, table_name
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name IN ('songs', 'artists', 'news', 'products', 'events')
      AND column_name IN (
        'artist_id', 'album_id', 'genre_id', 'author_id', 
        'category_id', 'organizer_id', 'venue_id', 'event_type_id'
      )
      ORDER BY table_name, column_name
    `);

    console.log('\n🔗 Foreign Key Columns Added:');
    console.log('=====================================');
    fkCheck.rows.forEach(col => {
      console.log(`✅ ${col.table_name}.${col.column_name}`);
    });

    console.log('\n🎉 MIGRATION COMPLETE! 🎉');
    console.log('\n💡 Next Steps:');
    console.log('1. Update application code to use actual JOIN queries');
    console.log('2. Test all pages with enhanced data');
    console.log('3. Monitor performance with new indexes');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Execute migration
executeMigration();
