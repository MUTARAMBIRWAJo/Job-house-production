const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkFullArtistsSchema() {
  await client.connect();
  
  try {
    // Check the actual structure returned by the join
    const testQuery = await client.query(`
      SELECT 
        s.id as song_id,
        s.title,
        s.artist_name,
        a.id as artist_id,
        a.name as artist_name,
        a.slug as artist_slug,
        a.avatar_url as artist_avatar,
        a.is_verified as artist_verified,
        a.is_featured as artist_featured
      FROM songs s
      LEFT JOIN artists a ON s.artist_name = a.name
      LIMIT 3
    `);
    
    console.log('Test query results (songs with artist join):');
    testQuery.rows.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, {
        song_id: row.song_id,
        artist_id: row.artist_id,
        artist_name: row.artist_name,
        artist_slug: row.artist_slug,
        artist_avatar: row.artist_avatar,
        artist_verified: row.artist_verified,
        artist_featured: row.artist_featured
      });
    });
    
  } catch (error) {
    console.error('Error checking artists schema:', error);
  } finally {
    await client.end();
  }
}

checkFullArtistsSchema().catch(console.error);
