const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function disableNewsRLS() {
  await client.connect();
  
  try {
    console.log('Disabling RLS for news table...');
    
    // Disable RLS for news table temporarily
    await client.query('ALTER TABLE news DISABLE ROW LEVEL SECURITY');
    
    console.log('RLS disabled for news table!');
    
  } catch (error) {
    console.error('Error disabling news RLS:', error);
  } finally {
    await client.end();
  }
}

disableNewsRLS().catch(console.error);
