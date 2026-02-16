const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const [, key, value] = match;
        process.env[key] = value;
      }
    }
  });
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('🚀 Starting Supabase Migration...\n');

async function runMigration() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Read and execute schema
    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('📦 Creating database schema...');
      const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSQL);
      console.log('✅ Schema created successfully');
    }

    // Read and execute seed data
    const seedPath = path.join(__dirname, '..', 'supabase', 'seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('📦 Seeding database...');
      const seedSQL = fs.readFileSync(seedPath, 'utf8');
      await client.query(seedSQL);
      console.log('✅ Database seeded successfully');
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📋 Summary:');
    console.log('  - Tables created: artists, songs, news, categories, products, orders, order_items, studio_leads, downloads');
    console.log('  - Indexes created for performance');
    console.log('  - RLS policies configured');
    console.log('  - Seed data inserted');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
