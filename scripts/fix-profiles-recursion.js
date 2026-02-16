const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixProfilesRecursion() {
  await client.connect();
  
  console.log('🔧 Fixing profiles table infinite recursion...\n');
  
  try {
    // Drop the problematic policy
    console.log('1. Dropping problematic policy...');
    await client.query('DROP POLICY IF EXISTS "Anyone can view public profile info" ON profiles');
    console.log('✅ Policy dropped');
    
    // Create a new policy without self-reference
    console.log('\n2. Creating new policy...');
    await client.query(`
      CREATE POLICY "Anyone can view public profile info" 
      ON profiles 
      FOR SELECT 
      TO public 
      USING (is_verified = true)
    `);
    console.log('✅ New policy created');
    
    console.log('\n🎉 Profiles RLS recursion fixed!');
    
  } catch (error) {
    console.error('❌ Error fixing profiles policy:', error.message);
  } finally {
    await client.end();
  }
}

fixProfilesRecursion().catch(console.error);