const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function disableEventsRLS() {
  await client.connect();
  
  try {
    console.log('Disabling RLS for events table...');
    
    // Disable RLS for events table temporarily
    await client.query('ALTER TABLE events DISABLE ROW LEVEL SECURITY');
    
    console.log('RLS disabled for events table!');
    
  } catch (error) {
    console.error('Error disabling events RLS:', error);
  } finally {
    await client.end();
  }
}

disableEventsRLS().catch(console.error);
