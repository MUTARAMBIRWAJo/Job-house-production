const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkArtistsSchema() {
  await client.connect();
  
  try {
    const result = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'artists' 
      ORDER BY ordinal_position
    `);
    
    console.log('Artists table columns:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}`);
    });
    
  } catch (error) {
    console.error('Error checking artists schema:', error);
  } finally {
    await client.end();
  }
}

checkArtistsSchema().catch(console.error);
