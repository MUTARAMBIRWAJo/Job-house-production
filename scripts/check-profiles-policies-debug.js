const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkProfilesPolicies() {
  await client.connect();
  
  console.log('🔍 Checking profiles table RLS policies...\n');
  
  const result = await client.query(`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
    FROM pg_policies 
    WHERE tablename = 'profiles'
    ORDER BY policyname
  `);
  
  console.log('Profiles table RLS policies:');
  console.log(JSON.stringify(result.rows, null, 2));
  
  // Check for potential infinite recursion
  console.log('\n🔍 Checking for potential infinite recursion issues...\n');
  
  // Look for policies that might reference other tables or have complex conditions
  result.rows.forEach(policy => {
    if (policy.qual && policy.qual.includes('profiles')) {
      console.log(`⚠️  Policy "${policy.policyname}" has condition referencing profiles table: ${policy.qual}`);
    }
  });
  
  await client.end();
}

checkProfilesPolicies().catch(console.error);