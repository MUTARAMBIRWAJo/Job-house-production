#!/usr/bin/env node

/**
 * Supabase Seed Script
 * Runs only the seed data against Supabase
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

async function seed() {
      if (!DATABASE_URL) {
            console.error('❌ Error: DATABASE_URL environment variable is not set');
            console.error('Please make sure .env.local is properly configured');
            process.exit(1);
      }

      console.log('🚀 Starting Supabase Seed...\n');

      // Read seed file
      const seedPath = path.join(__dirname, '..', 'supabase', 'seed.sql');

      if (!fs.existsSync(seedPath)) {
            console.error('❌ Error: seed.sql not found at', seedPath);
            process.exit(1);
      }

      const seedSQL = fs.readFileSync(seedPath, 'utf8');

      const client = new Client({
            connectionString: DATABASE_URL,
            ssl: { rejectUnauthorized: false }
      });

      try {
            console.log('📦 Connecting to database...');
            await client.connect();
            console.log('✅ Connected successfully\n');

            // Run seed data
            console.log('📦 Seeding database with initial data...');
            await client.query(seedSQL);
            console.log('✅ Seed data inserted successfully\n');

            // Verify data
            console.log('📊 Verifying seed data...');

            const counts = await Promise.all([
                  client.query('SELECT COUNT(*) as count FROM artists'),
                  client.query('SELECT COUNT(*) as count FROM songs'),
                  client.query('SELECT COUNT(*) as count FROM news'),
                  client.query('SELECT COUNT(*) as count FROM products'),
                  client.query('SELECT COUNT(*) as count FROM categories'),
                  client.query('SELECT COUNT(*) as count FROM orders'),
                  client.query('SELECT COUNT(*) as count FROM studio_leads'),
            ]);

            console.log('✅ Seed data verification:');
            console.log(`   - Artists: ${counts[0].rows[0].count}`);
            console.log(`   - Songs: ${counts[1].rows[0].count}`);
            console.log(`   - News: ${counts[2].rows[0].count}`);
            console.log(`   - Products: ${counts[3].rows[0].count}`);
            console.log(`   - Categories: ${counts[4].rows[0].count}`);
            console.log(`   - Orders: ${counts[5].rows[0].count}`);
            console.log(`   - Studio Leads: ${counts[6].rows[0].count}`);

            console.log('\n🎉 Seed completed successfully!');

      } catch (error) {
            console.error('❌ Seed failed:', error.message);
            if (error.code) {
                  console.error('Error code:', error.code);
            }
            process.exit(1);
      } finally {
            await client.end();
            console.log('\n👋 Database connection closed');
      }
}

seed();
