#!/usr/bin/env node

/**
 * Migration Verification Script
 * Checks if all required tables and structures were created
 */

const { Client } = require('pg');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

async function verifyMigration() {
  if (!DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🔍 Verifying Migration Results...\n');

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check key tables
    const tables = [
      'profiles',
      'artists', 
      'songs',
      'news',
      'categories',
      'products',
      'orders',
      'order_items',
      'studio_leads',
      'downloads',
      'chord_sheets',
      'events',
      'artist_promotions',
      'otp_verifications'
    ];

    console.log('📋 Checking tables:');
    let existingTables = 0;
    
    for (const table of tables) {
      try {
        const result = await client.query(`SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${table}'
        )`);
        
        const exists = result.rows[0].exists;
        if (exists) {
          console.log(`  ✅ ${table}`);
          existingTables++;
        } else {
          console.log(`  ❌ ${table} (missing)`);
        }
      } catch (error) {
        console.log(`  ❓ ${table} (check failed: ${error.message})`);
      }
    }

    console.log(`\n📊 Table Summary: ${existingTables}/${tables.length} tables found`);

    // Check if RLS is enabled
    console.log('\n🔒 Checking Row Level Security:');
    try {
      const rlsResult = await client.query(`
        SELECT table_name, rowlevelsecurity 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('${tables.join("','")}')
        ORDER BY table_name
      `);
      
      rlsResult.rows.forEach(row => {
        const status = row.rowlevelsecurity ? '✅' : '❌';
        console.log(`  ${status} ${row.table_name}: RLS ${row.rowlevelsecurity ? 'enabled' : 'disabled'}`);
      });
    } catch (error) {
      console.log(`  ❓ RLS check failed: ${error.message}`);
    }

    // Check record counts
    console.log('\n📈 Record Counts:');
    try {
      for (const table of ['artists', 'songs', 'news', 'studio_leads']) {
        try {
          const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
          console.log(`  📊 ${table}: ${countResult.rows[0].count} records`);
        } catch (error) {
          console.log(`  ❓ ${table}: Unable to count (${error.message})`);
        }
      }
    } catch (error) {
      console.log(`  ❓ Count check failed: ${error.message}`);
    }

    console.log('\n🎉 Migration verification completed!');

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

verifyMigration();
