const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixNewsPolicies() {
  await client.connect();
  
  try {
    console.log('Dropping existing news policies...');
    
    // Drop all existing news policies
    await client.query('DROP POLICY IF EXISTS "Admin full access news" ON news');
    await client.query('DROP POLICY IF EXISTS "Admins can manage news" ON news');
    await client.query('DROP POLICY IF EXISTS "Editors can manage news" ON news');
    await client.query('DROP POLICY IF EXISTS "Public news read" ON news');
    await client.query('DROP POLICY IF EXISTS "Public read access" ON news');
    
    console.log('Creating new simplified news policies...');
    
    // Create simple public read policy
    await client.query(`
      CREATE POLICY "Public can read news" ON news
        FOR SELECT USING (true);
    `);
    
    // Create admin management policy
    await client.query(`
      CREATE POLICY "Admins can manage news" ON news
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
          )
        );
    `);
    
    console.log('News policies fixed successfully!');
    
  } catch (error) {
    console.error('Error fixing news policies:', error);
  } finally {
    await client.end();
  }
}

fixNewsPolicies().catch(console.error);
