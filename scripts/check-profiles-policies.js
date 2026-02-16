const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkProfilesPolicies() {
  await client.connect();
  
  const result = await client.query(`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
    FROM pg_policies 
    WHERE tablename = 'profiles'
    ORDER BY policyname
  `);
  
  console.log('Profiles table RLS policies:');
  console.log(JSON.stringify(result.rows, null, 2));
  
  await client.end();
}

checkProfilesPolicies().catch(console.error);
