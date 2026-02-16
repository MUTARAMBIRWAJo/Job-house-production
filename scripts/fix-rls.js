#!/usr/bin/env node

/**
 * Check and fix RLS policies for public content
 */

const { Client } = require('pg');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

async function checkAndFixRLS() {
  if (!DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🔍 Checking and Fixing RLS Policies...\n');

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check if RLS is enabled on key tables
    const tables = ['songs', 'artists', 'news', 'events'];
    
    for (const table of tables) {
      console.log(`🔒 Checking RLS for ${table}...`);
      
      // Check if RLS is enabled
      const rlsCheck = await client.query(`
        SELECT relrowsecurity 
        FROM pg_class 
        WHERE relname = '${table}' 
        AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      `);
      
      const rlsEnabled = rlsCheck.rows[0]?.relrowsecurity || false;
      console.log(`  RLS Enabled: ${rlsEnabled ? '✅' : '❌'}`);
      
      if (rlsEnabled) {
        // Check if public read policy exists
        const policyCheck = await client.query(`
          SELECT policyname, permissive, roles, cmd, qual 
          FROM pg_policies 
          WHERE tablename = '${table}' 
          AND policyname = 'Public read access'
        `);
        
        if (policyCheck.rows.length === 0) {
          console.log(`  ⚠️  No public read policy found. Creating...`);
          
          // Create public read policy
          await client.query(`
            CREATE POLICY "Public read access" ON public.${table}
            FOR SELECT USING (true);
          `);
          
          console.log(`  ✅ Created public read policy for ${table}`);
        } else {
          console.log(`  ✅ Public read policy exists`);
        }
      } else {
        console.log(`  ⚠️  RLS not enabled on ${table}. Enabling...`);
        
        // Enable RLS
        await client.query(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
        
        // Create public read policy
        await client.query(`
          CREATE POLICY "Public read access" ON public.${table}
          FOR SELECT USING (true);
        `);
        
        console.log(`  ✅ Enabled RLS and created public read policy for ${table}`);
      }
    }

    console.log('\n🎉 RLS policies check completed!');
    console.log('\n📋 Summary:');
    console.log('  - Checked RLS status for key tables');
    console.log('  - Created missing public read policies');
    console.log('  - Songs, artists, news, and events should now be publicly readable');

  } catch (error) {
    console.error('❌ RLS check failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

checkAndFixRLS();
