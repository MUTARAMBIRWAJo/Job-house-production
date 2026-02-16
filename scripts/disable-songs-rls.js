const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function disableSongsRLS() {
  await client.connect();
  
  try {
    console.log('Disabling RLS for songs table...');
    
    // Disable RLS for songs table temporarily
    await client.query('ALTER TABLE songs DISABLE ROW LEVEL SECURITY');
    
    console.log('RLS disabled for songs table!');
    
  } catch (error) {
    console.error('Error disabling songs RLS:', error);
  } finally {
    await client.end();
  }
}

disableSongsRLS().catch(console.error);
