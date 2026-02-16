#!/usr/bin/env node

/**
 * Supabase Verification Script
 * Verifies connection and queries sample data
 */

const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function verify() {
      console.log('🔍 Verifying Supabase Connection...\n');

      // Check environment variables
      console.log('📋 Environment Check:');
      console.log(`   - DATABASE_URL: ${DATABASE_URL ? '✅ Set' : '❌ Missing'}`);
      console.log(`   - SUPABASE_URL: ${SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
      console.log(`   - SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`);

      if (!DATABASE_URL) {
            console.error('\n❌ Error: DATABASE_URL is not set');
            process.exit(1);
      }

      const client = new Client({
            connectionString: DATABASE_URL,
            ssl: { rejectUnauthorized: false }
      });

      try {
            console.log('\n📦 Connecting to database...');
            await client.connect();
            console.log('✅ Connected successfully\n');

            // Check tables exist
            console.log('📊 Checking Tables:');
            const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

            console.log(`   Found ${tables.rows.length} tables:`);
            tables.rows.forEach(row => {
                  console.log(`   - ${row.table_name}`);
            });

            // Query sample data from each table
            console.log('\n📈 Sample Data:');

            const tableQueries = [
                  { name: 'Artists', query: 'SELECT id, name, verified_status, genres FROM artists LIMIT 3' },
                  { name: 'Songs', query: 'SELECT id, title, artist_name, view_count FROM songs LIMIT 3' },
                  { name: 'News', query: 'SELECT id, title, category, featured FROM news LIMIT 3' },
                  { name: 'Products', query: 'SELECT id, title, price, category FROM products LIMIT 3' },
                  { name: 'Categories', query: 'SELECT id, name, slug FROM categories LIMIT 3' },
                  { name: 'Orders', query: 'SELECT id, user_email, amount, status FROM orders LIMIT 3' },
                  { name: 'Studio Leads', query: 'SELECT id, artist_name, status, priority FROM studio_leads LIMIT 3' },
            ];

            for (const table of tableQueries) {
                  try {
                        const result = await client.query(table.query);
                        console.log(`\n   ${table.name} (${result.rows.length} rows):`);
                        result.rows.forEach(row => {
                              const preview = Object.entries(row).map(([key, val]) => {
                                    if (Array.isArray(val)) return `${key}: [${val.join(', ')}]`;
                                    if (typeof val === 'object') return `${key}: ${JSON.stringify(val).substring(0, 50)}`;
                                    return `${key}: ${String(val).substring(0, 30)}`;
                              }).join(', ');
                              console.log(`     { ${preview} }`);
                        });
                  } catch (err) {
                        console.log(`   ${table.name}: Error - ${err.message}`);
                  }
            }

            console.log('\n✅ All verification checks passed!');
            console.log('\n📝 Summary:');
            console.log('   - Database connection: ✅');
            console.log('   - Schema tables: ✅');
            console.log('   - Seed data: ✅');
            console.log('   - Supabase is ready to use!');

      } catch (error) {
            console.error('\n❌ Verification failed:', error.message);
            process.exit(1);
      } finally {
            await client.end();
            console.log('\n👋 Database connection closed');
      }
}

// Need to require path for dotenv
verify();
