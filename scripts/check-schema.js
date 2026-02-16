#!/usr/bin/env node

/**
 * Check Actual Database Schema
 */

const { Client } = require('pg');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

async function checkSchema() {
  if (!DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🔍 CHECKING ACTUAL DATABASE SCHEMA\n');

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check songs table structure
    console.log('🎵 SONGS TABLE STRUCTURE:');
    console.log('=====================================');
    const songsSchema = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'songs' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    songsSchema.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });

    // Check artists table structure
    console.log('\n👥 ARTISTS TABLE STRUCTURE:');
    console.log('=====================================');
    const artistsSchema = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'artists' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    artistsSchema.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });

    // Check foreign key relationships
    console.log('\n🔗 FOREIGN KEY RELATIONSHIPS:');
    console.log('=====================================');
    const foreignKeys = await client.query(`
      SELECT
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
    `);
    
    if (foreignKeys.rows.length > 0) {
      foreignKeys.rows.forEach(fk => {
        console.log(`  - ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
      });
    } else {
      console.log('  No foreign key relationships found');
    }

    // Check sample data
    console.log('\n📊 SAMPLE DATA:');
    console.log('=====================================');
    
    const songsData = await client.query('SELECT * FROM songs LIMIT 1');
    if (songsData.rows.length > 0) {
      console.log('  Songs table has data:', Object.keys(songsData.rows[0]));
    } else {
      console.log('  Songs table is empty');
    }

    const artistsData = await client.query('SELECT * FROM artists LIMIT 1');
    if (artistsData.rows.length > 0) {
      console.log('  Artists table has data:', Object.keys(artistsData.rows[0]));
    } else {
      console.log('  Artists table is empty');
    }

  } catch (error) {
    console.error('❌ Schema check failed:', error.message);
  } finally {
    await client.end();
  }
}

checkSchema();
