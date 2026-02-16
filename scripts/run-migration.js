#!/usr/bin/env node

/**
 * Supabase Migration Script using pg
 * Runs schema and seed migrations against Supabase
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

async function migrate() {
      if (!DATABASE_URL) {
            console.error('❌ Error: DATABASE_URL environment variable is not set');
            console.error('Please make sure .env.local is properly configured');
            process.exit(1);
      }

      console.log('🚀 Starting Supabase Migration...\n');

      // Read schema and seed files
      const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
      const seedPath = path.join(__dirname, '..', 'supabase', 'seed.sql');

      if (!fs.existsSync(schemaPath)) {
            console.error('❌ Error: schema.sql not found at', schemaPath);
            process.exit(1);
      }

      const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
      const seedSQL = fs.existsSync(seedPath) ? fs.readFileSync(seedPath, 'utf8') : null;

      const client = new Client({
            connectionString: DATABASE_URL,
            ssl: { rejectUnauthorized: false }
      });

      try {
            console.log('📦 Connecting to database...');
            await client.connect();
            console.log('✅ Connected successfully\n');

            // Run schema migration
            console.log('📦 Creating database schema...');
            await client.query(schemaSQL);
            console.log('✅ Schema created successfully\n');

            // Run seed data
            if (seedSQL) {
                  console.log('📦 Seeding database with initial data...');
                  await client.query(seedSQL);
                  console.log('✅ Seed data inserted successfully\n');
            }

            console.log('🎉 Migration completed successfully!');
            console.log('\n📋 Summary:');
            console.log('  - Tables created: artists, songs, news, categories, products, orders, order_items, studio_leads, downloads');
            console.log('  - Indexes created for performance');
            console.log('  - RLS policies configured');
            console.log('  - Seed data inserted');
            console.log('\n⚠️  Note: Storage buckets need to be created manually in Supabase Dashboard:');
            console.log('  - avatars (for artist avatars)');
            console.log('  - covers (for song/album covers)');
            console.log('  - products (for product files)');
            console.log('  - news (for news images)');

      } catch (error) {
            console.error('❌ Migration failed:', error.message);
            if (error.code) {
                  console.error('Error code:', error.code);
            }
            process.exit(1);
      } finally {
            await client.end();
            console.log('\n👋 Database connection closed');
      }
}

migrate();
