const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkSongs() {
  await client.connect();
  
  try {
    const result = await client.query('SELECT COUNT(*) as count FROM songs');
    console.log('Total songs in database:', result.rows[0].count);
    
    if (result.rows[0].count > 0) {
      const songsResult = await client.query(`
        SELECT id, title, artist_name, created_at 
        FROM songs 
        ORDER BY created_at DESC 
        LIMIT 3
      `);
      
      console.log('Latest 3 songs:');
      songsResult.rows.forEach((song, index) => {
        console.log(`${index + 1}. ${song.title} by ${song.artist_name} (${song.created_at})`);
      });
    }
    
  } catch (error) {
    console.error('Error checking songs:', error);
  } finally {
    await client.end();
  }
}

checkSongs().catch(console.error);
