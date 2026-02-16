#!/usr/bin/env node

/**
 * Supabase Migration Script
 * This script runs the schema and seed migrations against Supabase
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('Loading env from:', envPath);
  console.log('Env content preview:', envContent.substring(0, 200));
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const [, key, value] = match;
        process.env[key] = value;
        console.log(`Set ${key} = ${value.substring(0, 20)}...`);
      }
    }
  });
} else {
  console.log('Env file not found at:', envPath);
}

// Configuration
const DATABASE_URL = process.env.DATABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('DATABASE_URL check:', DATABASE_URL ? 'SET' : 'NOT SET');
console.log('SERVICE_ROLE_KEY check:', SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');

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

if (!fs.existsSync(seedPath)) {
      console.error('❌ Error: seed.sql not found at', seedPath);
      process.exit(1);
}

const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
const seedSQL = fs.readFileSync(seedPath, 'utf8');

/**
 * Run SQL against Supabase using psql
 */
function runSQL(sql, description) {
      console.log(`📦 ${description}...`);

      try {
            // Create a temporary SQL file
            const tempFile = path.join(__dirname, 'temp_migration.sql');
            fs.writeFileSync(tempFile, sql);

            // Run psql command
            const command = `psql "${DATABASE_URL}" -f "${tempFile}" --quiet`;
            execSync(command, {
                  encoding: 'utf8',
                  stdio: ['pipe', 'pipe', 'pipe']
            });

            // Clean up temp file
            fs.unlinkSync(tempFile);

            console.log(`✅ ${description} completed successfully\n`);
            return true;
      } catch (error) {
            console.error(`❌ ${description} failed:`, error.message);
            return false;
      }
}

// Run schema migration
const schemaSuccess = runSQL(schemaSQL, 'Creating database schema');

// Only run seed if schema was successful
if (schemaSuccess) {
      const seedSuccess = runSQL(seedSQL, 'Seeding database with initial data');

      if (seedSuccess) {
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
      } else {
            console.log('⚠️  Seed data insertion failed. Please check the errors above.');
            process.exit(1);
      }
} else {
      console.log('⚠️  Schema creation failed. Please check the errors above.');
      process.exit(1);
}
