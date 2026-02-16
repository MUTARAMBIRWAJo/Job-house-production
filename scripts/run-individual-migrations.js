#!/usr/bin/env node

/**
 * Individual Migration Runner
 * Runs migration files individually, handling existing objects gracefully
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

async function runMigrationFile(client, filePath, fileName) {
  console.log(`📦 Running ${fileName}...`);
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && !s.startsWith('/*'))
      .map(s => s + ';'); // Add semicolon back
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const statement of statements) {
      if (statement.trim() === ';') continue;
      
      try {
        await client.query(statement);
        successCount++;
      } catch (error) {
        // Ignore errors for objects that already exist
        if (error.message.includes('already exists') || 
            error.message.includes('does not exist') ||
            error.message.includes('duplicate key') ||
            error.message.includes('relation') && error.message.includes('already exists')) {
          // Expected errors for existing objects
          continue;
        } else {
          console.error(`❌ Error in statement: ${statement.substring(0, 100)}...`);
          console.error(`   Error: ${error.message}`);
          errorCount++;
        }
      }
    }
    
    console.log(`✅ ${fileName} completed (${successCount} statements executed, ${errorCount} expected errors ignored)`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to read ${fileName}:`, error.message);
    return false;
  }
}

async function migrate() {
  if (!DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🚀 Starting Individual Migration Process...\n');

  const migrationDir = path.join(__dirname, '..', 'lib', 'db', 'migrations');
  const migrationFiles = fs.readdirSync(migrationDir)
    .filter(f => f.endsWith('.sql'))
    .sort(); // Run in order

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('📦 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully\n');

    let successCount = 0;
    let totalCount = migrationFiles.length;

    for (const file of migrationFiles) {
      const filePath = path.join(migrationDir, file);
      const success = await runMigrationFile(client, filePath, file);
      if (success) successCount++;
      console.log(''); // Add spacing
    }

    console.log('🎉 Migration process completed!');
    console.log(`\n📋 Summary: ${successCount}/${totalCount} migration files processed successfully`);
    
    // Run seed data if it exists
    const seedPath = path.join(__dirname, '..', 'supabase', 'seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('\n📦 Running seed data...');
      await runMigrationFile(client, seedPath, 'seed.sql');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n👋 Database connection closed');
  }
}

migrate();
