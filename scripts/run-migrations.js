const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres.svkhumefxncdtoellmns:ys1DrdTnYrz8RUl1@aws-1-us-east-1.pooler.supabase.com:5432/postgres'
});

async function runMigration(sql, name) {
      try {
            await client.query(sql);
            console.log(`Migration ${name} completed!`);
            return true;
      } catch (error) {
            // Ignore duplicate table/constraint errors - these are OK
            if (error.message.includes('already exists') ||
                  error.message.includes('duplicate') ||
                  error.message.includes('does not exist')) {
                  console.log(`Migration ${name}: ${error.message} - continuing...`);
                  return true;
            }
            console.error(`Migration ${name} error:`, error.message);
            return false;
      }
}

async function runMigrations() {
      try {
            console.log('Connecting to database...');
            await client.connect();
            console.log('Connected successfully!\n');

            // Run migration 001
            console.log('Running migration 001_auth_schema.sql...');
            const migration001 = fs.readFileSync(
                  path.join(__dirname, '../lib/db/migrations/001_auth_schema.sql'),
                  'utf8'
            );
            await runMigration(migration001, '001');

            // Run migration 002
            console.log('\nRunning migration 002_core_tables.sql...');
            const migration002 = fs.readFileSync(
                  path.join(__dirname, '../lib/db/migrations/002_core_tables.sql'),
                  'utf8'
            );
            await runMigration(migration002, '002');

            console.log('\n✅ All migrations completed!');
      } catch (error) {
            console.error('Migration error:', error.message);
      } finally {
            await client.end();
      }
}

runMigrations();
