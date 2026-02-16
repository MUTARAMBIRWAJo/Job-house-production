const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkEvents() {
  await client.connect();
  
  try {
    const result = await client.query('SELECT COUNT(*) as count FROM events');
    console.log('Total events in database:', result.rows[0].count);
    
    if (result.rows[0].count > 0) {
      const eventsResult = await client.query(`
        SELECT id, title, event_date, event_type, is_published, created_at 
        FROM events 
        ORDER BY created_at DESC 
        LIMIT 5
      `);
      
      console.log('Latest 5 events:');
      eventsResult.rows.forEach((event, index) => {
        console.log(`${index + 1}. ${event.title} (${event.event_date}) - Published: ${event.is_published}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking events:', error);
  } finally {
    await client.end();
  }
}

checkEvents().catch(console.error);
