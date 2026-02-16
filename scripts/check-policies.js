const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkPolicies() {
  await client.connect();
  
  const result = await client.query(`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
    FROM pg_policies 
    WHERE tablename = 'news'
    ORDER BY policyname
  `);
  
  console.log('News table RLS policies:');
  console.log(JSON.stringify(result.rows, null, 2));
  
  await client.end();
}

checkPolicies().catch(console.error);
