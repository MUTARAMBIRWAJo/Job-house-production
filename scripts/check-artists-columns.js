const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkArtistsColumns() {
  await client.connect();
  
  try {
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'artists' 
      AND column_name LIKE '%verified%'
      ORDER BY ordinal_position
    `);
    
    console.log('Artists table verification columns:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type})`);
    });
    
  } catch (error) {
    console.error('Error checking artists columns:', error);
  } finally {
    await client.end();
  }
}

checkArtistsColumns().catch(console.error);
