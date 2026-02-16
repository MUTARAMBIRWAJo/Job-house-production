const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixProfilesPolicies() {
  await client.connect();
  
  try {
    console.log('Fixing profiles policies to prevent infinite recursion...');
    
    // Drop the problematic policy
    await client.query('DROP POLICY IF EXISTS "Admin full access to profiles" ON profiles');
    
    // Create a corrected admin policy without recursion
    await client.query(`
      CREATE POLICY "Admins can manage all profiles" ON profiles
        FOR ALL USING (
          auth.role() = 'service_role' OR
          (auth.uid() IS NOT NULL AND 
           EXISTS (
             SELECT 1 FROM auth.users 
             WHERE auth.users.id = auth.uid() 
             AND raw_user_meta_data->>'role' = 'admin'
           ))
        );
    `);
    
    console.log('Profiles policies fixed successfully!');
    
  } catch (error) {
    console.error('Error fixing profiles policies:', error);
  } finally {
    await client.end();
  }
}

fixProfilesPolicies().catch(console.error);
