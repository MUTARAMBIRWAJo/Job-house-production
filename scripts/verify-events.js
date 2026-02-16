const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verifyEvents() {
  await client.connect();
  
  try {
    const eventsResult = await client.query(`
      SELECT title, event_type, event_date, created_at, is_published
      FROM events 
      WHERE is_published = true
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    console.log('Latest 5 published events (newest first):');
    eventsResult.rows.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}`);
      console.log(`   Type: ${event.event_type}`);
      console.log(`   Date: ${event.event_date}`);
      console.log(`   Created: ${event.created_at}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error verifying events:', error);
  } finally {
    await client.end();
  }
}

verifyEvents().catch(console.error);
